import {NextRequest,NextResponse} from 'next/server'
import {sha512} from '@/utils/sha512'
// Private
const PRIVATE_API_KEY = process.env.PRIVATE_API_KEY as string

export async function mfaVerifyMiddleware(req: NextRequest) {
  console.log('middleware: /mfa/verify')
  
  // Get Parameters
  const mfaSession = req.nextUrl.searchParams.get('mfasession')
  const address = req.nextUrl.searchParams.get('address')

  // Verify MFA session before giving the user the option to signIn()
  // This ensures the user is coming successfully from initially verifying with SIWE
  if(!mfaSession || !address) return NextResponse.json({error:'Invalid parameters',status:500})
  // Validate session - ping API
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const verifyMfaSessionReq = await fetch('https://auth.metawarrior.army/api/mfa/validateSession',{
    method: 'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({secret: SECRET_HASH, address: address, session: mfaSession})
  })
  const verifyMfaSessionRes = await verifyMfaSessionReq.json()
  // Check response
  if(!verifyMfaSessionRes) return NextResponse.json({error:'Failed to verify MFA Session via /api',status:500})
  if(verifyMfaSessionRes.verified){
    
    // Return response
    return NextResponse.next()
  }
  
  // This should never happen because we verify above
  return NextResponse.json({error:'Failed',status:500})
}