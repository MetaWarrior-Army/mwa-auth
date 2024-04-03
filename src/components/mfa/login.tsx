'use-client'
import { mfaClientGetAuthOptions} from '@/utils/mfa/client'
import { ConnectWalletModal } from '@/components/web3/web3'
import { useAccount } from 'wagmi'
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { startAuthentication } from '@simplewebauthn/browser'
import { useEffect, useState } from 'react'
import { toasterNotify } from '@/utils/toast/toaster'


export function MfaLoginModal({client, redirect, login_challenge}:{
  client: string,
  redirect: string,
  login_challenge: string,
}) {
  const { address } = useAccount()
  const { isConnected } = useAccount()
  const router = useRouter();
  const [isVerified,setIsVerified] = useState(false)


  // SignIn with Next-Auth and SIWE
  async function verifyMFA() {  
    // Get authOpts
    const authOpts = await mfaClientGetAuthOptions(address as string)
    // Start authentication client-side
    let verifyResponse
    try {
      verifyResponse = await startAuthentication(authOpts)
    } catch (e) {
      toasterNotify({message:'Failed to verify security key',type:'error'})
    }
    
    // Validate authentication response
    console.log('Verification response')
    console.log(verifyResponse)
    const signInResult = await signIn("MWA",{
      message: JSON.stringify(verifyResponse),
      signature: '0x0',
      redirect: false,
      type: 'mfa',
      address: address,
    })
    if(!signInResult) return false
    // User is signed in
    if(signInResult?.ok){
      toasterNotify({message:'Verified',type:'success'})
      // Redirect non OAuth users
      if(client!=='oauth') window.location.href=redirect
      if(!login_challenge) throw Error('No login_challenge')
      // OAuth client's need to ping a secure endpoint which returns a redirect_to
      // Session established, ping secure API endpoint      
      const acceptLoginReq = await fetch('/api/oauth/acceptLogin',{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({login_challenge: login_challenge, address: address})
      })
      const acceptLoginRes = await acceptLoginReq.json()
      if(!acceptLoginRes) throw Error('Failed to get result from /api/acceptLogin')
      if(acceptLoginRes.error) throw Error(acceptLoginRes.error)
      // Redirect OAuth User
      router.push(acceptLoginRes.redirect_to)
      setIsVerified(true)
    }
    return false;
  }

  return (
    <div className="space-y-6 py-8 text-base leading-7 dark:text-slate-400">
      <p className="">Verify your account with one of your registered security keys.</p>
      <div id="login">
        <button hidden={isConnected ? false : true}
          className="bg-slate-950 p-2 text-yellow-500 rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
          onClick={() => verifyMFA()}>Verify</button>
      </div>
      <ConnectWalletModal showDisconnect={false}/>
    </div>
  )
}