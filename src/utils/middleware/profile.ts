import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { sha512 } from '@/utils/app/sha512'
import { APP_BASE_URL,PRIVATE_API_KEY } from '../app/constants'
import { MAIL_DOMAIN } from '../mail/constants'
import { AppSessionToken, MwaUser } from '../app/types'

export async function profileMiddleware(req: NextRequest) {
  // Validate session
  const token = await getToken({req}) as AppSessionToken
  if(!token || !token.user) return NextResponse.redirect(new URL('/login?redirect='+APP_BASE_URL+'/profile',req.url))

  // Get user
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const userReq = await fetch(APP_BASE_URL+'/api/user/getMwaUser', {
    method: 'POST',
    headers: {'Content-type':'application:json'},
    body: JSON.stringify({secret: SECRET_HASH, address: token.id})
  })
  const user = await userReq.json() as MwaUser
  if(!user) return NextResponse.redirect(new URL('/',req.url))

  // Verify user
  if(!user.email_active) {
    // Clear any leftover cookies
    const resp = NextResponse.redirect(new URL('/mint',req.url))
    resp.cookies.delete('account_address')
    resp.cookies.delete('username')
    resp.cookies.delete('email')
    resp.cookies.delete('nft_avatar_cid')
    resp.cookies.delete('nft_cid')
    resp.cookies.delete('nft_tx')
    resp.cookies.delete('referral')
    return resp
  }

  // Build response
  const response = NextResponse.next()      
  // Cookies
  const email = user.username+'@'+MAIL_DOMAIN
  response.cookies.set('account_address',user.address)
  response.cookies.set('username',user.username as string)
  response.cookies.set('email',email)
  response.cookies.set('nft_avatar_cid',user.nft_0_avatar_cid as string)
  response.cookies.set('nft_cid',user.nft_0_cid as string)
  response.cookies.set('nft_id',user.nft_0_id as string)
  response.cookies.set('nft_tx',user.nft_0_tx as string)
  response.cookies.set('referral',user.referral_code as string)

  // Return
  return response

}