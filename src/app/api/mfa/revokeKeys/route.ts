import { AppSessionToken, MwaUser } from '@/utils/app/types';
import { getMwaUser } from '@/utils/app/db/utils';
import {revokeMfaCredentials} from '@/utils/mfa/db/utils'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'


// GET registration options
export async function GET(req: NextRequest) {
  console.log('/api/mfa/revokeKeys: ')
  // Get Session
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'Invalid Session',status:500})
  // Get User
  const user = await getMwaUser(token.id) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to find user',status:500})
  // Revoke user keys
  const revoked = await revokeMfaCredentials(user.address)
  if(!revoked) return NextResponse.json({error:'Failed to revoke credentials',status:500})
  //  Return response
  return NextResponse.json({revoked});
}