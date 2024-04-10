import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { sha512 } from '@/utils/app/sha512'
import { PRIVATE_API_KEY, APP_BASE_URL, APP_INVITE_ONLY } from '@/utils/app/constants'
import { AppSessionToken } from '@/utils/app/types'


export async function mintMiddleware(req: NextRequest) {
  console.log('middleware: /mint')

  // Check if app is set to INVITE ONLY
  let invite
  if(APP_INVITE_ONLY == 'true'){
    invite = req.nextUrl.searchParams.get('invite')
    if(!invite) return NextResponse.redirect(APP_BASE_URL+'/invite')

    const SECRET_HASH = await sha512(PRIVATE_API_KEY)
    const checkInvReq = await fetch(APP_BASE_URL+'/api/user/checkinvite',{
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({secret: SECRET_HASH, msg:btoa(invite)})
    })
    const checkInvRes = await checkInvReq.json()
    if(!checkInvRes) return NextResponse.redirect(APP_BASE_URL+'/invite')
    if(!checkInvRes.ok) return NextResponse.redirect(APP_BASE_URL+'/invite')
  }

  // Get Token
  const token = await getToken({req}) as AppSessionToken
  if(!token || !token.user) return NextResponse.redirect(new URL('/login?redirect='+APP_BASE_URL+'/mint',req.url))

  // Get/Validate user
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const userReq = await fetch(APP_BASE_URL+'/api/user/getMwaUser',{
    method:'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({secret:SECRET_HASH,address:token.id})
  })
  const user = await userReq.json()
  if(!user) return NextResponse.json({error:'Failed to get user',status:500})
  if(user.email_active) return NextResponse.redirect(APP_BASE_URL+'/profile')

  // Build response
  const resp = NextResponse.next()
  if(user.username){
    resp.cookies.set('username',user.username)
    resp.cookies.set('nft_avatar_cid',user.nft_0_avatar_cid)
    resp.cookies.set('nft_cid',user.nft_0_cid)
  }
  else{
    resp.cookies.delete('username')
    resp.cookies.delete('nft_avatar_cid')
    resp.cookies.delete('nft_cid')
  }
  if(APP_INVITE_ONLY) resp.cookies.set('invite',invite as string)
  resp.cookies.set('address',token.id)

  // Return
  return resp

}