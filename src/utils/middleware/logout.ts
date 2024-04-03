import { NextRequest, NextResponse } from 'next/server'
import { getOAuth2LogoutRequest,acceptOAuth2LogoutRequest} from '@/utils/hydra/admin'
import { APP_BASE_URL } from '@/utils/app/constants'

export async function logoutMiddleware(req: NextRequest) {
  console.log('middleware: /logout')
    // We should receive a logout_challenge
    const logout_challenge = req.nextUrl.searchParams.get('logout_challenge')
    const redirect = req.nextUrl.searchParams.get('redirect')
    // Check for OAuth logout
    if(logout_challenge){
      // Validate logout challenge
      const logoutRequest = await getOAuth2LogoutRequest(logout_challenge)
      if(!logoutRequest) return NextResponse.json({error:'Failed to get logout_challenge',status:500})
      // Accept logout challenge
      const acceptRequest = await acceptOAuth2LogoutRequest(logoutRequest.challenge)
      if(!acceptRequest) return NextResponse.json({error:'Failed to accept logout request',status:500})
      // Redirect user
      return NextResponse.redirect(new URL(acceptRequest.redirect_to,req.url))
    }
    else if(redirect && redirect.startsWith(APP_BASE_URL)){
      const resp = NextResponse.next()
      resp.cookies.set('auth_redirect',redirect as string)
      return resp
    }
    // Else redirect to PROJECT URL
    const resp = NextResponse.next()
    resp.cookies.set('auth_redirect',APP_BASE_URL)
    return resp
}