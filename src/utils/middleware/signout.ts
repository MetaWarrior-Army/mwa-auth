import { NextRequest, NextResponse } from 'next/server'

export async function signoutMiddleware(req: NextRequest) {
  console.log('middleware: /signout')
    // We need to get a redirect_to from the query parameters
    const redirect = req.nextUrl.searchParams.get('redirect')
    const resp = NextResponse.next()
    resp.cookies.set('auth_redirect',redirect as string)
    return resp
}