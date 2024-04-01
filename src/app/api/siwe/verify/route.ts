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
    return NextResponse.json({verified: true, status:200})
  }
  return NextResponse.json({verified: false, status:200})
}
