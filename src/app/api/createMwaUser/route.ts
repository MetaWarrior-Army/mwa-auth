import { NextRequest, NextResponse } from "next/server";
import { sha512 } from '@/utils/sha512';
import { createMwaUser } from '@/utils/app/users/db/utils';

// Private
const PRIVATE_API_KEY = process.env.PRIVATE_API_KEY as string

// PRIVATE API ENDPOINT
// Only accept POST
export async function POST(req: NextRequest) {
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const { secret, address } = await req.json()
  if(secret !== SECRET_HASH) return NextResponse.json({error:'Unauthorized',status:500})
  if(!address) return NextResponse.json({error:'Invalid parameters',status:500})
  console.log('Creating user: ',address)
  const newUser = await createMwaUser(address)
  if(!newUser) return NextResponse.json({error:'Failed to get user',status:500})
  return NextResponse.json(newUser)
}