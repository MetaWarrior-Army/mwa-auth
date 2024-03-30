import { NextRequest, NextResponse } from "next/server";
import { sha512 } from '@/utils/sha512';
import { getMwaUser } from '@/utils/app/users/db/utils';

// Private
const PRIVATE_API_KEY = process.env.PRIVATE_API_KEY as string

// PRIVATE API ENDPOINT
// Only accept POST
export async function POST(req: NextRequest) {
  console.log('getMwaUser: ')
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const { secret, address } = await req.json()
  if(secret !== SECRET_HASH) return NextResponse.json({error:'Unauthorized',status:500})
  const user = await getMwaUser(address)
  if(!user) return NextResponse.json({error:'Failed to get user',status:500})
  return NextResponse.json(user)
}