import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { AppSessionToken } from '@/utils/app/types'
import { APP_DOMAIN } from '@/utils/app/constants'

export async function mfaMiddleware(req: NextRequest) {
  console.log('middleware: /mfa')
    // Check for active session
    const sessionToken = await getToken({req}) as AppSessionToken
    if(!sessionToken){
      // Send user to /login with redirect
      const resp = NextResponse.redirect(new URL('/login?redirect=https://'+APP_DOMAIN+'/mfa',req.url))
      // Come back after authenticating
      resp.cookies.set('auth_redirect','https://'+APP_DOMAIN+'/mfa')
      return resp
    }
    // Valid session, continue
    return NextResponse.next()
}