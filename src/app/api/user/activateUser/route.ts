import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createReferral, getMwaUser, useInviteCode } from '@/utils/app/db/utils'
import { validateMfaSession } from '@/utils/mfa/db/utils'
import { MwaUser, AppSessionToken } from '@/utils/app/types'
import { MAILSERVER_API_KEY, MAILSERVER_API_URL } from '@/utils/app/constants'

export async function POST(req: NextRequest) {
  console.log('/api/user/activateUser: ')

  // Get token
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'No Session',status:500})

  // Get parameters
  const { id, msg, invite } = await req.json()

  // Decode parameters
  const address = atob(id)
  const session = atob(msg)

  // Validate Token
  if(token.id !== address) return NextResponse.json({error:'Invalid token',status:500})

  // Get user
  const user = await getMwaUser(address) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to get user',status:500})

  // Validate Session
  const validSession = await validateMfaSession(address,session)
  if(!validSession) return NextResponse.json({error:'Invalid session',status:500})

  // Consume invite code
  //const useInv = await useInviteCode(address,invite)
  //if(!useInv) return NextResponse.json({error:'Failed to consume invite code',status:500})

  // Create personal referral code
  //const createRef = await createReferral(address)
  //if(!createRef) return NextResponse.json({error:'Failed to create referral',status:500})

  // Right now this sets email_active in user row, effectively enabling their account across all protected OAuth Clients
  // Create Mailbox
  const createMB = await fetch(MAILSERVER_API_URL+'/create_mailbox.php', {
    method: 'POST',
    headers: {'Content-type': 'application/json',},
    body: JSON.stringify({username: user.username, key: MAILSERVER_API_KEY}),
  })
  const createRes = await createMB.json()
  if(!createRes) return NextResponse.json({error:'Failed to create mailbox',status:500})
  if(!createRes.success) return NextResponse.json({error:'Failed to create mailbox',status:500})

  
  
  // Account activated
  // Return response
  return NextResponse.json({activated:true})
}