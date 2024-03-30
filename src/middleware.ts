import { getOAuth2LoginRequest, 
  acceptOAuth2LoginRequest,
  getOAuth2ConsentRequest,
  acceptOAuth2ConsentRequest,
  getOAuth2LogoutRequest,
  acceptOAuth2LogoutRequest,
  OAUTH_CONSENT_REMEMBER,
  OAUTH_CONSENT_SKIP,
  OAUTH_LOGIN_REMEMBER,
  OAUTH_LOGIN_SKIP,
  genOAuthClientToken
} from './utils/hydra/hydraAdmin'
import { MwaUser } from '@/utils/app/users/types'
import { sha512 } from '@/utils/sha512'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Private
const PRIVATE_API_KEY = process.env.PRIVATE_API_KEY as string

// Middleware
export async function middleware(req: NextRequest) {


  // Middleware for /login
  if (req.nextUrl.pathname.startsWith('/login')) {
    console.log('middleware: /login')
    // We should receive a login_challenge
    const login_challenge = req.nextUrl.searchParams.get('login_challenge')
    if(!login_challenge) return NextResponse.json({error:'invalid parameters',status:500})
    // Validate login_challenge with OAuth
    const loginRequest = await getOAuth2LoginRequest(login_challenge)
    if(!loginRequest) return NextResponse.json({error:'Failed to get login request',status:500})
    if(loginRequest.redirect_to) return NextResponse.redirect(new URL(loginRequest.redirect_to,req.url))
    // Skip if directed to do so
    if(loginRequest.skip){
      console.log('skipping login')
      // Accept Login Request with OAuth Server
      const acceptRequest = await acceptOAuth2LoginRequest(loginRequest.challenge,{
        subject: loginRequest.subject,
        remember: OAUTH_LOGIN_SKIP,
        remember_for: OAUTH_LOGIN_REMEMBER,
      })
      if(!acceptRequest) return NextResponse.json({error:'Failed to accept login request',status:500})

      return NextResponse.redirect(new URL(acceptRequest.redirect_to,req.url))
    }
    // Present UI for Next-Auth Sign In
    const res = NextResponse.next()
    res.cookies.set('login_challenge',loginRequest.challenge)
    return res
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
    let user: MwaUser
    const getUserReq = await fetch('https://auth.metawarrior.army//api/getMwaUser',{
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({secret: SECRET_HASH, address: consentRequest.subject})
    })
    const mwaUser = await getUserReq.json()
    if(!mwaUser) return NextResponse.json({error:'Failed to interact with /api/getMwaUser',status:500})
    // Create User
    if(mwaUser.error){
      console.log('middleware: /consent: creating user')
      const createReq = await fetch('https://auth.metawarrior.army//api/createMwaUser',{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({secret: SECRET_HASH, user: {address: consentRequest.subject}})
      })
      const newUser = await createReq.json()
      if(!newUser) return NextResponse.json({error:'Failed to interact with /api/createMwaUser',status:500})
      if(newUser.error) return NextResponse.json({error:newUser.error,status:500})
      // Created User
      user = newUser
    }
    else{
      user = mwaUser
    }
    console.log('Found user')
    // Build the response
    const resp = NextResponse.next()
    resp.cookies.delete('redirect_to')
    if(user.email_active) resp.cookies.set('username',user.username as string)
    resp.cookies.set('oauth_client_name',consentRequest.client.client_name)
    resp.cookies.set('oauth_logo_uri',consentRequest.client.logo_uri)
    resp.cookies.set('consent_challenge',consentRequest.challenge)
    // Are we being asked to skip?
    //if(consentRequest.skip){
    if(consentRequest.skip || consentRequest.client.skip_consent){
      console.log('skipping consent')
      // generate tokenData
      const tokenData = await genOAuthClientToken(user)
      console.log('generated token data')
      // Accept consent
      console.log('Accepting consent')
      const acceptReq = await acceptOAuth2ConsentRequest(consentRequest.challenge,{
        grant_scope: consentRequest.requested_scope,
        remember: OAUTH_CONSENT_SKIP, 
        remember_for: OAUTH_CONSENT_REMEMBER,
        session: tokenData
      })
      if(!acceptReq) return NextResponse.json({error:'Failed to accept consent request',status:500})
      // Set cookie for the client-side redirect
      resp.cookies.set('redirect_to',acceptReq.redirect_to)
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
}


export const config = {
  matcher: [
    /*
     * Only run middleware on the following:
     * - login
     * - consent
     * - logout
     * NOT:
     * - api (API routes)
     * - _next
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next|_next\/static|_next\/image|favicon.ico))(login|consent|logout)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    }

  ],
}