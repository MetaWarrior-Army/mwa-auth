import { sha512 } from '@/utils/app/sha512'
import { clearMwaUsername, getMwaUser } from '@/utils/app/db/utils'
import { NextRequest, NextResponse } from 'next/server'
import { PRIVATE_API_KEY } from '@/utils/app/constants'
import { MwaUser } from '@/utils/app/types'
import { unpinCID } from '@/utils/ipfs/pinata'

// PRIVATE API ENDPOINT
// Only accept POST
export async function POST(req: NextRequest) {
  console.log('/api/user/clearUsername: ')
  // Validate parameters
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const { secret, address } = await req.json()
  if(secret !== SECRET_HASH) return NextResponse.json({error:'Unauthorized',status:500})
  if(!address) return NextResponse.json({error:'Invalid parameters',status:500})
  // Get user
  const user = await getMwaUser(address) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to get user',status:500})
  if(user.email_active) return NextResponse.json({error:'User is active',status:500})
  if(user.nft_0_tx) return NextResponse.json({error:'User has minted',status:500})
  if(!user.nft_0_avatar_cid) return NextResponse.json({error:'User has no recorded CID',status:500})
  console.log('Got user')
  console.log(user)

  // Delete user information and ideally Pinata IPFS content
  // Unpin from IPFS
  const unpinAvatar = await unpinCID(user.nft_0_avatar_cid as string)
  const unpinNFT = await unpinCID(user.nft_0_cid as string)
  if(!unpinAvatar || !unpinNFT) return NextResponse.json({error:'Failed to unpin from IPFS',status:500})
  
  // Clear username from DB
  const usernameCleared = await clearMwaUsername(user.address)
  if(!usernameCleared) return NextResponse.json({error:'Failed to clear username',status:500})
  
  return NextResponse.json({cleared:true})
}