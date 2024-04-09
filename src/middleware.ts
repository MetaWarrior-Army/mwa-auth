import { NextRequest, NextResponse } from 'next/server'
import { loginMiddleware } from '@/utils/middleware/login'
import { consentMiddleware } from '@/utils/middleware/consent'
import { logoutMiddleware } from '@/utils/middleware/logout'
import { mfaVerifyMiddleware } from '@/utils/middleware/mfaVerify'
import { mfaMiddleware } from '@/utils/middleware/mfa'
import { profileMiddleware } from '@/utils/middleware/profile'
import { mintMiddleware } from '@/utils/middleware/mint'
import { declineUsernameMiddleware } from '@/utils/middleware/declineusername'

// Middleware
export default async function middleware(req: NextRequest) {


  // Middleware for /login
  if (req.nextUrl.pathname.startsWith('/login')) {
    return loginMiddleware(req)
  }

  // Middleware for /consent 
  else if (req.nextUrl.pathname.startsWith('/consent')) {
    const resp = consentMiddleware(req)
    return resp
  }

  // Middleware for /logout
  else if (req.nextUrl.pathname.startsWith('/logout')) {
    return logoutMiddleware(req)
  }

  // Middleware for /mfa/verify
  else if (req.nextUrl.pathname.startsWith('/mfa\/verify')){
    return mfaVerifyMiddleware(req)
  }

  // Middleware for /mfa
  else if (req.nextUrl.pathname.startsWith('/mfa')) {
    return mfaMiddleware(req)
  }

  // Middleware for /profil
  else if (req.nextUrl.pathname.startsWith('/profile')) {
    return profileMiddleware(req)
  }

  else if (req.nextUrl.pathname.startsWith('/mint/declineusername')) {
    return declineUsernameMiddleware(req)
  }

  else if (req.nextUrl.pathname.startsWith('/mint')) {
    return mintMiddleware(req)
  }

  else if (req.nextUrl.pathname.startsWith('/')) {
    // Check if logged in, send to /profile
    return NextResponse.redirect(new URL('/profile',req.url))
  }
}


export const config = {
  matcher: [
    /*
     * Only run middleware on the following:
     * - login
     * - consent
     * - logout
     * - mfa
     * - mfa/verified
     * - profile
     * - mint
     * - mint/declineusername
     * - /
     * NOT:
     * - api (API routes)
     * - _next
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next|_next\/static|_next\/image|favicon.ico))(login|consent|logout|mfa|mfa\/verify|profile|mint|mint\/declineusername|)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    }

  ],
}