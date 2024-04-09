import { startAuthentication } from '@simplewebauthn/browser'
import { toasterNotify } from '@/utils/app/toaster'

// Verify MFA Key
export function VerifyMFAModal() {
  // Get Auth Options
  async function getAuthOptions(){
    const getOptsReq = await fetch('/api/mfa/verify')
    const getOptsRes = await getOptsReq.json()
    return getOptsRes
  }
  // Verify Auth Response
  async function verifyAuthentication(verifyResponse: any) {
    const authReq = await fetch('/api/mfa/verify', {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify(verifyResponse)
    })
    const authResp = await authReq.json()
    if(!authResp) throw Error('Failed to get response from /api/mfa/verify')
    return authResp
  }
  // Verify MFA Key
  async function verifyKey() {
    // Get Options
    try{
      const options = await getAuthOptions()
      // Start authentication with client
      const verifyResponse = await startAuthentication(options)
      // Validate authentication results
      const authResponse = await verifyAuthentication(verifyResponse)
      if(authResponse.verified){
        toasterNotify({message:'Key Verified!',type:'success'})
      }
    }
    catch(e: any) {
      toasterNotify({message:'Failed to verify key.',type:'error'})
    }
  }

  return (
    <>
      <p>
        <button className="bg-slate-950 p-2 text-yellow-500 rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
        onClick={()=>verifyKey()}
        >Verify Key</button>
      </p>
    </>
  )
}