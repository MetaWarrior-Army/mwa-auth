import {NextRequest, NextResponse} from 'next/server'
import {getOAuth2LoginRequest,acceptOAuth2LoginRequest} from '@/utils/hydra/admin'
import {OAUTH_LOGIN_SKIP,OAUTH_LOGIN_REMEMBER} from '@/utils/hydra/constants'
import { APP_BASE_URL } from '@/utils/app/constants'
import { getToken } from 'next-auth/jwt'
import { AppSessionToken } from '../app/types'

export async function loginMiddleware(req: NextRequest){
  console.log('middleware: /login')

  // We should receive a login_challenge Or a redirect in url params
  const login_challenge = req.nextUrl.searchParams.get('login_challenge')
  const auth_redirect = req.nextUrl.searchParams.get('redirect')
  if(!login_challenge && !auth_redirect) return NextResponse.json({error:'Invalid parameters',status:500})
  
  // OAuth Login Challenge
  if(login_challenge){
    // Validate login_challenge with OAuth
    const loginRequest = await getOAuth2LoginRequest(login_challenge)
    if(!loginRequest) return NextResponse.json({error:'Failed to get login request',status:500})
    if(loginRequest.redirect_to) return NextResponse.redirect(new URL(loginRequest.redirect_to,req.url))
    // Skip if the user is already logged in
    const token = await getToken({req}) as AppSessionToken
    if(token && token.user.address){
      console.log('middleware: /login: token: skipping login')
      const acceptRequest = await acceptOAuth2LoginRequest(loginRequest.challenge,{
        subject: token.user.address,
        remember: OAUTH_LOGIN_SKIP,
        remember_for: OAUTH_LOGIN_REMEMBER,
      })
      if(!acceptRequest) return NextResponse.json({error:'Failed to accept oauth login'})
      // Redirect user
      return NextResponse.redirect(new URL(acceptRequest.redirect_to,req.url))
    }
    // Skip if directed to do so by OAuth
    if(loginRequest.skip){
      console.log('middleware: /login: oauth: skipping login')
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
    const res = NextResponse.next()
    if(!auth_redirect.startsWith(APP_BASE_URL)) res.cookies.set('auth_redirect',APP_BASE_URL+'/profile')
    else res.cookies.set('auth_redirect',auth_redirect)
    res.cookies.set('auth_client','mwa-auth')
    // Return
    return res
  }
}