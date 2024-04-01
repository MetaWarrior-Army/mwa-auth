import { AppSessionToken, MwaUser } from '@/utils/app/types';
import { getMwaUser } from '@/utils/app/db/utils';
import {getRegistrationOptions,verifyCredentialRegistrationResponse} from '@/utils/mfa/register'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'


// GET registration options
export async function GET(req: NextRequest) {
  console.log('/api/mfa/register: ')
  // Get Session
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'Invalid Session',status:500})
  // Get User
  const user = await getMwaUser(token.id) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to find user',status:500})
  // Get Registration Options
  const options = await getRegistrationOptions(user)
  if(!options) return NextResponse.json({error:'Failed to generate registration options',status:500})
  // Return options
  return NextResponse.json(options);
}


// POST Registration Response
export async function POST(req: NextRequest) {
  console.log('/api/mfa/register: ')
  // Get Session
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'Invalid Session',status:500})
  // Get Body
  const body = await req.json();
  if(!body) return NextResponse.json({error:'Failed, no body found',status:500})
  // Get User
  const user = await getMwaUser(token.id) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to find user',status:500})
  // Verify Response
  const verified = await verifyCredentialRegistrationResponse(user, body)
  if(!verified) return NextResponse.json({error:'Failed to verify registration response',status:500})
  // Return verification results
  return NextResponse.json({verified: verified, status:200})
}
