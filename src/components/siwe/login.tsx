import { ConnectWalletModal } from '@/components/web3/web3'
import { useAccount, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { useRouter } from "next/navigation"
import { toasterNotify } from '@/utils/app/toaster'
import { mwaSignIn } from '@/utils/next-auth/signin'
import { APP_DOMAIN } from '@/utils/app/constants'

export function SIWELoginModal({client, redirect, login_challenge}:{
  client: string,
  redirect: string,
  login_challenge?: string
}) {
  const { address } = useAccount()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const router = useRouter();

  // SignIn with Next-Auth and SIWE
  async function verifySIWE() {
    // Generate message
    const message = new SiweMessage({
      domain: window.location.host,
      address: address,
      statement: "Sign in with Ethereum.",
      uri: window.location.origin,
      version: "1",
      chainId: 1,
    })
    // User signs message client-side
    let signature
    try{
      signature = await signMessageAsync({
        account: address,
        message: message.prepareMessage(),
      })
    }
    catch(e: any) {
      toasterNotify({message:'Failed to sign message.',type:'error'})
    }
    // Verify message - Supports MFA Session Creation
    // Encode parameters
    const encodedmsg = btoa(JSON.stringify(message))
    const encodedsig = btoa(signature as string)
    const verifyReq = await fetch('/api/siwe/verify', {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({msg: encodedmsg, id: encodedsig})
    })
    const verifyRes = await verifyReq.json()
    if(!verifyRes) return false
    // SIWE Verified
    if(verifyRes.verified){
      toasterNotify({message:'Verified!',type:'success'})
      // Redirect to MFA - signIn() happens on mfa page
      if(verifyRes.mfa_session){
        const mfaRedirect = 'https://'+APP_DOMAIN+'/mfa/verify?id='+encodeURIComponent(btoa(address as string))+'&session='+encodeURIComponent(btoa(verifyRes.mfa_session))
        router.push(mfaRedirect)
      }
      // Sign In
      const signinResult = await mwaSignIn({
        message,
        signature: signature as string,
        type: 'siwe',
        address: address as string,
        login_challenge: login_challenge as string,
        auth_client: client,
        auth_redirect: redirect,
      })
      if(!signinResult) throw Error('Failed to mwaSignIn')
      router.push(signinResult)
      
      return false
    }
    return false;
  }

  return (
    <div className="space-y-6 py-8 text-base leading-7 dark:text-slate-400">
      <div id="login">
        <button hidden={isConnected ? false : true}
          className="bg-slate-950 p-2 text-yellow-500 rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
          onClick={() => verifySIWE()}>Login</button>
      </div>
      <ConnectWalletModal showDisconnect={true}/>
    </div>
  )
}