import { AppSessionToken, MwaUser } from '@/utils/app/types';
import { getMwaUser } from '@/utils/app/db/utils';
import {getMfaCredentials} from '@/utils/mfa/db/utils'
import {MfaCredential} from '@/utils/mfa/types'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'


// GET registration options
export async function GET(req: NextRequest) {
  console.log('/api/mfa/getKeyCount: ')
  // Get Session
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'Invalid Session',status:500})
  // Get User
  const user = await getMwaUser(token.id) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to find user',status:500})
  // Get Registration Options
  const credentials: MfaCredential[] = await getMfaCredentials(user.address)
  // Return result
  return NextResponse.json({keycount: credentials.length});
}