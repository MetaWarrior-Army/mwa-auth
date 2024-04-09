import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { uploadAvatarPinata, uploadNFTPinata } from '@/utils/ipfs/pinata'

// Blockies
import { generateAvatar } from '@/utils/app/nft/avatar'
import { generateNftJson } from '@/utils/app/nft/json'
import { getMwaUser, updateMwaUsername } from '@/utils/app/db/utils'
import { MwaUser, AppSessionToken } from '@/utils/app/types'
import { APP_BASE_URL, PRIVATE_API_KEY } from '@/utils/app/constants'
import { sha512 } from '@/utils/app/sha512'


export async function POST(req: NextRequest) {
  console.log('/api/nft/build: ')

  // Get Token
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'Invalid session'})

  // Get parameters
  const { id, msg } = await req.json()
  if(!id || !msg) return NextResponse.json({error:'Invalid parameters.',status:500})

  // Decode parameters
  const username = atob(msg)
  const address = atob(id)

  // Validate session
  if(address !== token.id) return NextResponse.json({error:'Session mismatch'})

  // Check username
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const usernameCheck = await fetch(APP_BASE_URL+'/api/user/checkusername',{
    method:'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({secret: SECRET_HASH, username: username})
  })
  const userCheck = await usernameCheck.json()
  if(!userCheck.valid) return NextResponse.json({error:'Invalid username',status:500})

  // Verify user
  const user = await getMwaUser(token.id) as MwaUser
  if(user.email_active) return NextResponse.json({error:'User already has account',status:500})

  // Generate avatar
  const avatarFilePath = await generateAvatar({address}) as string
  if(!avatarFilePath) return NextResponse.json({error:'Failed to generate avatar',status:500})

  // Upload Avatar
  const avatarCID = await uploadAvatarPinata({address,avatarFilePath})
  if(!avatarCID) return NextResponse.json({error:'Failed to upload avatar',status:500})

  // Generate NFT JSON
  const nftFilePath = await generateNftJson({address,username,avatarCID})
  if(!nftFilePath) return NextResponse.json({error:'Failed to build NFT JSON file'})

  // Upload NFT
  const nftCID = await uploadNFTPinata({nftFilePath,address})
  if(!nftCID) return NextResponse.json({error:'Failed to upload NFT JSON',status:500})

  // Update the database
  const uMwaUsername = await updateMwaUsername(address,username,avatarCID,nftCID)
  if(!uMwaUsername) return NextResponse.json({error:'Failed to update user',status:500})

  // Return response
  return NextResponse.json({nft_cid: nftCID as string, avatar_cid: avatarCID as string})
 
}