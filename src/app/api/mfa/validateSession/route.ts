import { sha512 } from '@/utils/sha512';
import { getMwaUser } from '@/utils/app/db/utils';
import { NextRequest, NextResponse } from "next/server";
import { MwaUser } from '@/utils/app/types';
import { PRIVATE_API_KEY } from '@/utils/app/constants'


// PRIVATE API ENDPOINT
// Only accept POST
export async function POST(req: NextRequest) {
  console.log('/api/mfa/validateSession: POST')
  // Get parameters
  const { secret, address, session } = await req.json()
  // Validate secret
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  if(secret !== SECRET_HASH) return NextResponse.json({error:'Unauthorized',status:500})
  // Get user
  const user = await getMwaUser(address) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to get user',status:500})
  // Hash the stored session
  const mfaSessionHash = await sha512(user.current_mfa_session as string)
  if(session == mfaSessionHash) {
    // Return results
    return NextResponse.json({verified: true, status:200})
  }
  // Return results
  return NextResponse.json({verified: false})
}