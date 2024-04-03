import { NextRequest, NextResponse } from 'next/server'
import { getOAuth2LogoutRequest,acceptOAuth2LogoutRequest} from '@/utils/hydra/admin'

export async function logoutMiddleware(req: NextRequest) {
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