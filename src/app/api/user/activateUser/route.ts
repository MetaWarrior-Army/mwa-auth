import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getMwaUser } from '@/utils/app/db/utils'
import { validateMfaSession } from '@/utils/mfa/db/utils'
import { MwaUser, AppSessionToken } from '@/utils/app/types'
import { MAILSERVER_API_KEY, MAILSERVER_API_URL } from '@/utils/app/constants'

export async function POST(req: NextRequest) {
  console.log('/api/user/activateUser: ')

  // Get token
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'No Session',status:500})
  console.log('Got token')

  // Get parameters
  const { id, msg } = await req.json()
  console.log('Got parameters')

  // Decode parameters
  const address = atob(id)
  const session = atob(msg)
  console.log('Decoded parameters')

  // Validate Token
  if(token.id !== address) return NextResponse.json({error:'Invalid token',status:500})
  console.log('Validated token')

  // Get user
  const user = await getMwaUser(address) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to get user',status:500})
  console.log('Validated User')

  // Validate Session
  const validSession = await validateMfaSession(address,session)
  if(!validSession) return NextResponse.json({error:'Invalid session',status:500})
  console.log('Validated session')

  // Right now this sets email_active in user row, effectively enabling their account across all protected OAuth Clients
  // Create Mailbox
  console.log('Creating mailbox')
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