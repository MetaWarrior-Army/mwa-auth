import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { PRIVATE_API_KEY, APP_BASE_URL, APP_INVITE_ONLY } from '@/utils/app/constants'
import { sha512 } from '@/utils/app/sha512'
import { AppSessionToken } from '../app/types'

export async function declineUsernameMiddleware(req: NextRequest) {
  console.log('middleware: /mint/declineusername')

  // Get token
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'Invalid token',status:500})
  
  // Get/Validate user
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const clearReq = await fetch(APP_BASE_URL+'/api/user/clearUsername',{
    method: 'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({secret: SECRET_HASH, address: token.id})
  })
  const res = await clearReq.json()
  if(!res) return NextResponse.json({error:'Failed to clear username',status:500})
  if(!res.cleared) return NextResponse.json({error:'Failed to clear username',status:500})

  // Check for invite
  const invite = req.nextUrl.searchParams.get('invite')
    
  // Build response
  let resp
  if(invite) {
    resp = NextResponse.redirect(APP_BASE_URL+'/mint?invite='+invite)
  }
  else{
    resp = NextResponse.redirect(APP_BASE_URL+'/mint')
  }
  resp.cookies.delete('username')
  resp.cookies.delete('nft_avatar_cid')
  resp.cookies.delete('nft_cid')
  return resp
}
