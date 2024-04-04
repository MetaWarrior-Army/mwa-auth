import {NextRequest,NextResponse} from 'next/server'
import {sha512} from '@/utils/sha512'
import { PRIVATE_API_KEY, APP_BASE_URL } from '@/utils/app/constants'

export async function mfaVerifyMiddleware(req: NextRequest) {
  console.log('middleware: /mfa/verify')
  
  // Get Parameters
  const codedSession = req.nextUrl.searchParams.get('session')
  const id = req.nextUrl.searchParams.get('id')

  // Verify MFA session before giving the user the option to signIn()
  // This ensures the user is coming successfully from initially verifying with SIWE
  if(!codedSession || !id) return NextResponse.json({error:'Invalid parameters',status:500})
  
  // Decode parameters
  const address = atob(id)
  const mfaSession = atob(codedSession)
  
  // Validate session - ping API
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)
  const verifySessionReq = await fetch(APP_BASE_URL+'/api/mfa/validateSession',{
    method: 'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({secret: SECRET_HASH, address: address, session: mfaSession})
  })
  const verifySessionRes = await verifySessionReq.json()
  // Check response
  if(!verifySessionRes) return NextResponse.json({error:'Failed to verify MFA Session via /api',status:500})
  if(verifySessionRes.verified){
    // Return response
    const resp = NextResponse.next()
    resp.cookies.set('mfa_session',mfaSession)
    return resp
  }
  
  // This should never happen because we verify above
  return NextResponse.json({error:'Failed',status:500})
}