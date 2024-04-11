import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { AppSessionToken } from '@/utils/app/types'
import { checkInvite, checkReferral } from '@/utils/app/db/utils'
import { sha512 } from '@/utils/app/sha512'
import { PRIVATE_API_KEY } from '@/utils/app/constants'

export async function POST(req: NextRequest) {
  console.log('/api/user/checkinvite: ')

  // Get token
  const token = await getToken({req}) as AppSessionToken
  
  // Get parameters
  const { secret, msg } = await req.json()

  // Validate session
  if(secret){
    const SECRET_HASH = await sha512(PRIVATE_API_KEY)
    if(secret !== SECRET_HASH) return NextResponse.json({error:'Invalid parameters',status:500})
  }
  else{
    if(!token) return NextResponse.json({error:'Invalid token',status:500})
  }

  // Decode parameters
  const invite = atob(msg)

  // Verify valid characters
  if(/(#|\$|\^|%|@|!|&|\*|\(|\)|\+|=|\[|\]|{|}|\\|\||\;|:|'|"|~|`|,|\.|\?|>|\/|<)/.test(invite)) return NextResponse.json({error:'Invalid characters',status:500})

  // Check invite
  const checkInv = await checkInvite(invite)
  const checkRef = await checkReferral(invite)
  if(!checkInv && !checkRef) return NextResponse.json({error:'Invalid code',status:500})
  
    // Return result
  return NextResponse.json({ok:true,msg:'Valid code'})
}