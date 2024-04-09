import { NextRequest, NextResponse } from 'next/server'
import { getOAuth2LogoutRequest,acceptOAuth2LogoutRequest} from '@/utils/hydra/admin'
import { APP_BASE_URL } from '@/utils/app/constants'
import { TRUSTED_OAUTH_CLIENTS } from '../hydra/constants'

export async function logoutMiddleware(req: NextRequest) {
  console.log('middleware: /logout')

    // Get parameters
    const logout_challenge = req.nextUrl.searchParams.get('logout_challenge')
    const redirect = req.nextUrl.searchParams.get('redirect')
    
    // Handle oauth logout_challenge
    if(logout_challenge){

      // Validate logout challenge
      const logoutRequest = await getOAuth2LogoutRequest(logout_challenge)
      if(!logoutRequest) return NextResponse.json({error:'Failed to get logout_challenge',status:500})
      
      // Accept logout challenge
      const acceptRequest = await acceptOAuth2LogoutRequest(logoutRequest.challenge)
      if(!acceptRequest) return NextResponse.json({error:'Failed to accept logout request',status:500})
      
      // Check for Trusted OAuth Clients
      // Forward trusted OAuth clients to log out here
      if(TRUSTED_OAUTH_CLIENTS.includes(logoutRequest.client.client_id)){
        console.log('middleware: /logout: trusted oauth client logging out')
        const resp = NextResponse.next()
        console.log('Setting response to: ',acceptRequest.redirect_to)
        resp.cookies.set('auth_redirect',acceptRequest.redirect_to)
        return resp
      }

      // Redirect user
      return NextResponse.redirect(new URL(acceptRequest.redirect_to,req.url))
    }
    // Check for redirect
    else if(redirect && redirect.startsWith(APP_BASE_URL)){
      const resp = NextResponse.next()
      resp.cookies.set('auth_redirect',redirect as string)
      return resp
    }

    // Else redirect to profile
    const resp = NextResponse.next()
    resp.cookies.set('auth_redirect',APP_BASE_URL+'/profile')
    return resp
}