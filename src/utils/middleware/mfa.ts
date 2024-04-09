import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { AppSessionToken } from '@/utils/app/types'
import { APP_BASE_URL } from '@/utils/app/constants'

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
    // Valid session, continue
    return NextResponse.next()
}