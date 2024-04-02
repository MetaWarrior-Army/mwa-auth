import { AppSessionToken, MwaUser } from '@/utils/app/types';
import { getMwaUser } from '@/utils/app/db/utils';
import {getAuthenticationOptions,verifyCredentialAuthenticationResponse} from '@/utils/mfa/verify'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'


// GET Authentication Options
export async function GET(req: NextRequest) {
  console.log('/api/mfa/verify: GET: ')
  // Get Session
  const token = await getToken({req}) as AppSessionToken
  let userid: string
  if(!token) {
    // Client's that don't have a session can send us an address to start an authentication flow
    const address = req.nextUrl.searchParams.get('address')
    if(!address) return NextResponse.json({error:'Invalid parameters',status:500})
    userid = address
  }
  else{
    userid = token.id
  }
  // Get User
  const user = await getMwaUser(userid) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to find user',status:500})
  // Get Options
  const options = await getAuthenticationOptions(user)
  if(!options) return NextResponse.json({error:'Failed getting authenticator options',status:500})
  // Return Options
  return NextResponse.json(options);
}


// POST Authentication Response
export async function POST(req: NextRequest) {
  console.log('/api/mfa/verify: POST: ')
  // Get Session
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'Invalid Session',status:500})
  // Get Authentication Resposne
  const body = await req.json();
  if(!body) return NextResponse.json({error:'Failed to retrieve body',status:500})
  // Get User
  const user = await getMwaUser(token.id) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to find user',status:500})
  // Verify Authentication Response
  const verified = await verifyCredentialAuthenticationResponse(user,body)
  if(!verified) return NextResponse.json({error:'Failed to verify authentication response',status:500})
  // Return verificatioin result
  return NextResponse.json({verified: verified, status:200})
}
