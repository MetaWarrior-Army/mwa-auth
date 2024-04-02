
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
