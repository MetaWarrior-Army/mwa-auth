import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { APP_BASE_URL } from '../app/constants'

export async function inviteMiddleware(req:NextRequest) {
  console.log('middleware: /invite')
  // Get Token
  const token = await getToken({req})
  if(!token) return NextResponse.redirect(APP_BASE_URL+'/login?redirect=https://auth.metawarrior.army/invite')
  return NextResponse.next()
}