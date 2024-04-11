import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { AppSessionToken } from '@/utils/app/types'
import { APP_BASE_URL, PRIVATE_API_KEY } from '@/utils/app/constants'
import { sha512 } from '@/utils/app/sha512'


export async function mfaMiddleware(req: NextRequest) {
  console.log('middleware: /mfa')
    // Check for active session
    const token = await getToken({req}) as AppSessionToken
    if(!token){
      // Send user to /login with redirect
      const resp = NextResponse.redirect(new URL('/login?redirect='+APP_BASE_URL+'/mfa',req.url))
      // Come back after authenticating
      resp.cookies.set('auth_redirect',APP_BASE_URL+'/mfa')
      return resp
    }

    // Get/Validate user
    const SECRET_HASH = await sha512(PRIVATE_API_KEY)
    const userReq = await fetch(APP_BASE_URL+'/api/user/getMwaUser',{
      method:'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({secret:SECRET_HASH,address:token.id})
    })
    const user = await userReq.json()
    if(!user) return NextResponse.json({error:'Failed to get user',status:500})
    if(!user.email_active) return NextResponse.redirect(APP_BASE_URL+'/mint')
    // Valid session, continue
    return NextResponse.next()
}