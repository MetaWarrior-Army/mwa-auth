import { getMfaCredentials, updateMfaSession } from '@/utils/mfa/db/utils'
import { MfaCredential } from '@/utils/mfa/types'
import { NextResponse, NextRequest } from 'next/server'
import { SiweMessage } from 'siwe'
// Private
const NEXTAUTH_URL = process.env.NEXTAUTH_URL as string

export async function POST(req: NextRequest) {
  // Get parameters
  const {message,signature} = await req.json()
  // Get SIWE Message
  const siwe = new SiweMessage(message)
  const nextAuthUrl = new URL(NEXTAUTH_URL)
  // Verify Message
  const result = await siwe.verify({
    signature: signature || "",
    domain: nextAuthUrl.host,
  })
  // Authentication successful, check for existing user or create one if needed
  if (result.success) {
    // Update user's mfa_session if they have MFA
    // Get Registration Options
    const credentials: MfaCredential[] = await getMfaCredentials(siwe.address)
    if(credentials.length > 0){
      // Generate session string
      console.log('Updating MFA Session from /api/siwe/verify')
      const newSession = await updateMfaSession(siwe.address)
      if(!newSession) return NextResponse.json({error:'Failed to update MFA Session',status:500})
      console.log(newSession)
      return NextResponse.json({verified: true, mfa_session: newSession, status:200})
    }
    return NextResponse.json({verified: true, status:200})
  }
  return NextResponse.json({verified: false, status:200})
}
