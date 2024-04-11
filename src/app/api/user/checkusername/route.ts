import { PRIVATE_API_KEY, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '@/utils/app/constants'
import { getMailAlias } from '@/utils/mail/db/utils'
import { AppSessionToken } from '@/utils/app/types'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { MAIL_DOMAIN } from '@/utils/mail/constants'
import { sha512 } from '@/utils/app/sha512'
import { BLOCKED_USERNAMES } from '@/utils/app/nft/blockedusernames'

// This API endpoint verifies usernames before accepting them.
// This is called by both the client and server-side when building the NFT and writing
// the username to the database.
export async function POST(req: NextRequest) {
  console.log('/api/user/checkusername: ')

  // Get Token
  const token = await getToken({req}) as AppSessionToken

  // Get parameters
  const { secret, username } = await req.json()

  // Validate session
  if(secret) {
    if(secret !== await sha512(PRIVATE_API_KEY)) return NextResponse.json({error:'Invalid parameters',status:500})
  }
  else {
    if(!token) return NextResponse.json({error:'Invalid Token',status:500})
  }

  // Verify length
  if(username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) return NextResponse.json({error:'Improper length',status:500})

  // Verify valid characters
  if(/(#|\$|\^|%|@|!|&|\*|\(|\)|\+|=|\[|\]|{|}|\\|\||\;|:|'|"|~|`|,|\.|\?|>|\/|<)/.test(username)) return NextResponse.json({error:'Invalid characters in username.',status:500})

  // Check blocked usernames
  if(BLOCKED_USERNAMES.includes(username)) return NextResponse.json({error:'Username unavailable.',status:500})

  // Check email aliases
  const alias = await getMailAlias(username+'@'+MAIL_DOMAIN)
  if(alias) return NextResponse.json({error:'Username unavailable.',status:500})

  // Username is available
  return NextResponse.json({valid:true})
}