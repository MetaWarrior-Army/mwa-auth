import { getOAuth2LoginRequest, 
  acceptOAuth2LoginRequest,
  getOAuth2ConsentRequest,
  acceptOAuth2ConsentRequest,
  getOAuth2LogoutRequest,
  acceptOAuth2LogoutRequest,
  genOAuthClientToken,
  rejectOAuth2ConsentRequest
} from '@/utils/hydra/admin'
import {OAUTH_CONSENT_REMEMBER,
  OAUTH_CONSENT_SKIP,
  OAUTH_LOGIN_REMEMBER,
  OAUTH_LOGIN_SKIP,
  PROTECTED_OAUTH_CLIENTS
} from '@/utils/hydra/constants'
import { sha512 } from '@/utils/sha512'
import { AppSessionToken } from '@/utils/app/types'
import {APP_DOMAIN} from '@/utils/app/constants'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
// Private
const PRIVATE_API_KEY = process.env.PRIVATE_API_KEY as string


// Middleware
export default async function middleware(req: NextRequest) {


  // Middleware for /login
  if (req.nextUrl.pathname.startsWith('/login')) {
    console.log('middleware: /login')
    // We should receive a login_challenge
    const login_challenge = req.nextUrl.searchParams.get('login_challenge')
    // Or a redirect in url params
    const auth_redirect = req.nextUrl.searchParams.get('redirect')
    if(!login_challenge && !auth_redirect) return NextResponse.json({error:'Invalid parameters',status:500})
    
    // OAuth Login Challenge
    if(login_challenge){
      // Validate login_challenge with OAuth
      const loginRequest = await getOAuth2LoginRequest(login_challenge)
      if(!loginRequest) return NextResponse.json({error:'Failed to get login request',status:500})
      if(loginRequest.redirect_to) return NextResponse.redirect(new URL(loginRequest.redirect_to,req.url))
      // Skip if directed to do so
      if(loginRequest.skip){
        console.log('middleware: /login: skipping login')
        // Accept Login Request with OAuth Server
        const acceptRequest = await acceptOAuth2LoginRequest(loginRequest.challenge,{
          subject: loginRequest.subject,
          remember: OAUTH_LOGIN_SKIP,
          remember_for: OAUTH_LOGIN_REMEMBER,
        })
        if(!acceptRequest) return NextResponse.json({error:'Failed to accept login request',status:500})

        return NextResponse.redirect(new URL(acceptRequest.redirect_to,req.url))
      }
      // Set cookies for /siwe 'oauth' login
      const res = NextResponse.next()
      res.cookies.set('login_challenge',loginRequest.challenge)
      res.cookies.set('auth_client','oauth')
      res.cookies.set('auth_redirect',loginRequest.client.client_uri)
      return res
    }

    // This login follows auth_redirect without a login_challenge
    else{
      if(!auth_redirect) return NextResponse.json({error:'Invalid parameters, no redirect',status:500})
      // Only redirect to our domain
      if(!auth_redirect.startsWith('https://auth.metawarrior.army')) return NextResponse.json({error:'Invalid redirect',status:500})
      const res = NextResponse.next()
      res.cookies.set('auth_client','mwa-auth')
      res.cookies.set('auth_redirect',auth_redirect)
      return res
    }
  }


  // Middleware for /consent 
  else if (req.nextUrl.pathname.startsWith('/consent')) {
    console.log('middleware: /consent')
    const SECRET_HASH = await sha512(PRIVATE_API_KEY)
    // We should receive a consent_challenge
    const consent_challenge = req.nextUrl.searchParams.get('consent_challenge')
    if(!consent_challenge) return NextResponse.json({error:'invalid parameters',status:500})
    // Validate consent challenge or Error
    const consentRequest = await getOAuth2ConsentRequest(consent_challenge)
    if(!consentRequest) return NextResponse.json({error:'Failed to get consent request',status:500})
    if(consentRequest.redirect_to) return NextResponse.redirect(consentRequest.redirect_to)
    // Get MwaUser from /api
    const getUserReq = await fetch('https://'+APP_DOMAIN+'/api/getMwaUser',{
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({secret: SECRET_HASH, address: consentRequest.subject})
    })
    const mwaUser = await getUserReq.json()
    if(!mwaUser) return NextResponse.json({error:'Failed to interact with /api/getMwaUser',status:500})
    // Check protected OAuth clients
    if(!mwaUser.email_active) {
      if(PROTECTED_OAUTH_CLIENTS.includes(consentRequest.client.client_id)) {
        console.log('middleware: /consent: Autorejecting user from protected OAuth client')
        // Reject consent for OAuth clients that require a fully baked user
        const rejectReq = await rejectOAuth2ConsentRequest(consentRequest.challenge)
        if(!rejectReq) return NextResponse.json({error:'Failed to rejectOAuth2ConsentRequest',status:500})
        return NextResponse.redirect(rejectReq.redirect_to)
      }
    }
    // Build the response
    const resp = NextResponse.next()
    resp.cookies.delete('oauth_consent_redirect')
    resp.cookies.set('oauth_client_name',consentRequest.client.client_name)
    resp.cookies.set('oauth_logo_uri',consentRequest.client.logo_uri)
    resp.cookies.set('consent_challenge',consentRequest.challenge)
    // Are we being asked to skip?
    if(consentRequest.skip || consentRequest.client.skip_consent){
      console.log('skipping consent')
      // generate tokenData
      const tokenData = genOAuthClientToken(mwaUser)
      // Accept consent
      const acceptReq = await acceptOAuth2ConsentRequest(consentRequest.challenge,{
        grant_scope: consentRequest.requested_scope,
        remember: OAUTH_CONSENT_SKIP, 
        remember_for: OAUTH_CONSENT_REMEMBER,
        session: tokenData
      })
      if(!acceptReq) return NextResponse.json({error:'Failed to accept consent request',status:500})
      // Set cookie for the client-side redirect
      resp.cookies.set('oauth_consent_redirect',acceptReq.redirect_to)
    }
    return resp
  }


  // Middleware for /logout
  else if (req.nextUrl.pathname.startsWith('/logout')) {
    console.log('middleware: /logout')
    // We should receive a logout_challenge
    const logout_challenge = req.nextUrl.searchParams.get('logout_challenge')
    if(!logout_challenge) return NextResponse.json({error:'invalid parameters',status:500})
    // Validate logout challenge
    const logoutRequest = await getOAuth2LogoutRequest(logout_challenge)
    if(!logoutRequest) return NextResponse.json({error:'Failed to get logout_challenge',status:500})
    // Accept logout challenge
    const acceptRequest = await acceptOAuth2LogoutRequest(logoutRequest.challenge)
    if(!acceptRequest) return NextResponse.json({error:'Failed to accept logout request',status:500})
    // Redirect user
    return NextResponse.redirect(new URL(acceptRequest.redirect_to,req.url))
  }

  // Middleware for /siwe/verified redirect to /mfa/verify once wallet verified
  else if (req.nextUrl.pathname.startsWith('/siwe\/verified')) {
    console.log('middleware: /siwe/verified')
    // Check for active session
    const sessionToken = await getToken({req}) as AppSessionToken
    if(!sessionToken){
      // Send user to /siwe with redirect
      const resp = NextResponse.redirect(new URL('/siwe',req.url))
      resp.cookies.set('verify_redirect_to','https://'+APP_DOMAIN+'/siwe/verified')
      return resp
    }
    return NextResponse.next()
  }


  // Middleware for /mfa/verify
  else if (req.nextUrl.pathname.startsWith('/mfa\/verify')){
    console.log('middleware: /mfa/verify')
    // Get Parameters
    const mfaSession = req.nextUrl.searchParams.get('mfasession')
    const address = req.nextUrl.searchParams.get('address')
    if(!mfaSession || !address) return NextResponse.json({error:'Invalid parameters',status:500})
    // Validate session - ping API
    const SECRET_HASH = await sha512(PRIVATE_API_KEY)
    const verifyMfaSessionReq = await fetch('https://auth.metawarrior.army/api/mfa/validateSession',{
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({secret: SECRET_HASH, address: address, session: mfaSession})
    })
    const verifyMfaSessionRes = await verifyMfaSessionReq.json()
    if(!verifyMfaSessionRes) return NextResponse.json({error:'Failed to verify MFA Session via /api',status:500})
    if(verifyMfaSessionRes.validated){
      const resp = NextResponse.next()
      // This is where the client name would be useful
      // Cookies should already be set for auth_client, login_challenge, and redirect at this point.
      return resp
    }
    return NextResponse.next()
  }

  // Middleware for /mfa
  else if (req.nextUrl.pathname.startsWith('/mfa')) {
    console.log('middleware: /mfa')
    // Check for active session
    const sessionToken = await getToken({req}) as AppSessionToken
    if(!sessionToken){
      // Send user to /login with redirect
      const resp = NextResponse.redirect(new URL('/login?redirect=https://auth.metawarrior.army/mfa',req.url))
      // Come back after authenticating
      resp.cookies.set('auth_redirect','https://'+APP_DOMAIN+'/mfa')
      return resp
    }
    return NextResponse.next()
  }

 
  // Middleware for /signout
  else if(req.nextUrl.pathname.startsWith('/signout')) {
    console.log('middleware: /signout')
    // We need to get a redirect_to from the query parameters
    const redirect = req.nextUrl.searchParams.get('redirect')
    const resp = NextResponse.next()
    resp.cookies.set('auth_redirect',redirect as string)
    return resp
  }
}


export const config = {
  matcher: [
    /*
     * Only run middleware on the following:
     * - login
     * - consent
     * - logout
     * - signin
     * - signout
     * - mfa
     * - siwe/verified
     * NOT:
     * - api (API routes)
     * - _next
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next|_next\/static|_next\/image|favicon.ico))(login|consent|logout|mfa|mfa\/verify|mfa\/verify\/verified|siwe|siwe\/verified|signin|signout)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    }

  ],
}