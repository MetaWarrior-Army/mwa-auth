import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '@/utils/app/constants'
import { getMwaUsername } from '@/utils/app/db/utils'
import { MwaUser, AppSessionToken } from '@/utils/app/types'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('/api/user/checkusername: ')

  // Get Token
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'Invalid session'})

  // Get parameters
  const { username } = await req.json()

  // Verify length
  if(username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) return NextResponse.json({error:'Improper length',status:500})

  // Get user
  const user = await getMwaUsername(username) as MwaUser
  if(user) return NextResponse.json({error:'Username unavailable.',status:500})

  // Username is available
  return NextResponse.json({valid:true})
}