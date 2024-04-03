import { startRegistration } from '@simplewebauthn/browser'
import { toasterNotify } from '@/utils/toast/toaster'

// Register new MFA Key
export function RegisterMFAModal({onRegister}: {onRegister: any}) {

  // Get Registration Options
  async function generateOptions() {
    const getOptsReq = await fetch('/api/mfa/register')
    const getOptsRes = await getOptsReq.json()
    return getOptsRes
  }

  // Verify Registration
  async function register(attestationResponse: any) {
    const verifyReq = await fetch('/api/mfa/register',{
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify(attestationResponse)
    })
    const verifyRes = await verifyReq.json()
    if(!verifyRes) throw Error('Failed to register security key')
    // Return result
    return verifyRes
  }

  // Register new Key
  async function registerNewKey() {
    try{
      // Generate Options
      const options = await generateOptions()
      // Start Registration client-side
      const attestationResponse = await startRegistration(options)
      // Validate registration response
      const registerResult = await register(attestationResponse)
      if(registerResult.verified){
        toasterNotify({message:'New Key Registered!',type:'success'})
        // Update UI
        onRegister()
      }
    }
    catch(e: any){
      toasterNotify({message:e.message,type:'error'})
    }
  }

  return (
    <>
      <p>
        <button className="bg-slate-950 p-2 text-yellow-500 rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
        onClick={()=>registerNewKey()}
        >Register New Key</button>
      </p>
    </>
  )
}