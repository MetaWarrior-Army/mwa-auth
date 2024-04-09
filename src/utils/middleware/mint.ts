import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { sha512 } from '@/utils/app/sha512'
import { PRIVATE_API_KEY, APP_BASE_URL } from '@/utils/app/constants'
import { AppSessionToken } from '@/utils/app/types'


export async function mintMiddleware(req: NextRequest) {
  console.log('middleware: /mint')

  // Get Token
  const token = await getToken({req}) as AppSessionToken
  if(!token || !token.user) return NextResponse.redirect(new URL('/login?redirect='+APP_BASE_URL+'/mint',req.url))

  // Get user
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const userReq = await fetch(APP_BASE_URL+'/api/user/getMwaUser',{
    method:'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({secret:SECRET_HASH,address:token.id})
  })
  const user = await userReq.json()
  if(!user) return NextResponse.json({error:'Failed to get user',status:500})

  // Build response
  const resp = NextResponse.next()
  resp.cookies.set('address',token.id)

  // Return
  return resp

}