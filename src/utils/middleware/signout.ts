import { NextRequest, NextResponse } from 'next/server'
import { APP_BASE_URL } from '../app/constants'

export async function signoutMiddleware(req: NextRequest) {
  console.log('middleware: /signout')
    // We need to get a redirect_to from the query parameters
    const redirect = req.nextUrl.searchParams.get('redirect')
    if(!redirect) {
      const resp = NextResponse.next()
      resp.cookies.set('auth_redirect',APP_BASE_URL+'/mfa')
      return resp
    }
    const resp = NextResponse.next()
    resp.cookies.set('auth_redirect',redirect as string)
    return resp
}