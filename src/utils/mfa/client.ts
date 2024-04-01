//import { startAuthentication } from '@simplewebauthn/browser'

// Get Auth Options
export async function mfaClientGetAuthOptions(address: string){
  const getOptsReq = await fetch('/api/mfa/verify?address='+address)
  const getOptsRes = await getOptsReq.json()
  if(!getOptsRes) return undefined
  return getOptsRes
}
// Verify Auth Response
export async function mfaClientVerifyAuthentication(verifyResponse: any) {
  const authReq = await fetch('/api/mfa/verify', {
    method: 'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify(verifyResponse)
  })
  const authResp = await authReq.json()
  if(!authResp) return undefined
  return authResp
}
// Verify MFA Key
/*
export async function mfaClientVerifyKey() {
  // Get Options
  try{
    const options = await mfaClientGetAuthOptions()
    // Start authentication with client
    const verifyResponse = await startAuthentication(options)
    // Validate authentication results
    const authResponse = await mfaClientVerifyAuthentication(verifyResponse)
    console.log(authResponse)
    if(!authResponse) return undefined
    if(authResponse.verified) return true
    if(authResponse.error) {
      console.log(error)
      return undefined
    }
  }
  catch(e: any) {
    console.log(e)
    return undefined
  }
}
*/