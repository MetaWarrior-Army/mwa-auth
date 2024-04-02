'use-client'
import { ConnectWalletModal } from '@/components/web3/web3'
import { useAccount, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { useRouter } from "next/navigation"
import { signIn } from 'next-auth/react'


// This is the login function. 
// This is where we control the user flow
// First thing we need to know is where the user
// is going next.

// The first thing we check is whether or not we 
// can get an MFA Session from the server.
// If so, we know we're sending the user there afterwards

// Otherwise we either send the user to /consent for oauth clients
// or to a previously provided redirect

export function SIWEVerifyModal({client, redirect, login_challenge}:{
  client: string,
  redirect: string,
  login_challenge?: string
}) {
  const { address } = useAccount()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const router = useRouter();

  // SignIn with Next-Auth and SIWE
  async function loginButton() {
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
    const signature = await signMessageAsync({
      account: address,
      message: message.prepareMessage(),
    })
    // Verify message - Supports MFA Session Creation
    const verifyReq = await fetch('/api/siwe/verify', {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({message: message, signature: signature})
    })
    const verifyRes = await verifyReq.json()
    if(!verifyRes) return false
    // Redirect user
    if(verifyRes.verified){
      // Redirect to MFA - signIn() happens on mfa page
      if(verifyRes.mfa_session){
        const mfaRedirect = 'https://auth.metawarrior.army/mfa/verify?address='+encodeURIComponent(address as string)+'&mfasession='+encodeURIComponent(verifyRes.mfa_session)
        router.push(mfaRedirect)
      }
      // User doesn't have MFA, we need to signIn()
      const signInResult = await signIn("MWA", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        type: 'siwe',
        address: address,
      })
      if(!signInResult) return false
      // If signin successful, accept login and redirect    
      if(signInResult.ok){
        // Kick regular users back to redirect
        if(client !== 'oauth') window.location.href=redirect
        // acceptOAuth2LoginRequest
        if(client == 'oauth') {
          const acceptLoginReq = await fetch('/api/oauth/acceptLogin',{
            method: 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({login_challenge: login_challenge, address: address})
          })
          const acceptLoginRes = await acceptLoginReq.json()
          if(!acceptLoginRes) throw Error('Failed to get result from /api/acceptLogin')
          if(acceptLoginRes.error) throw Error(acceptLoginRes.error)
          // Redirect user
          router.push(acceptLoginRes.redirect_to)
        }  
      }
      else{
        console.log('/components/siwe/verify: Failed to signIn()')
      }
    }

    return true;
  }

  return (
    <div className="space-y-6 py-8 text-base leading-7 dark:text-slate-400">
      <p>Login to <b>MetaWarrior Army</b></p>
      
      <p className="text-xs">Sign a message with your wallet to <b>Log In</b>.</p>
      
      <p>::</p>
      
      <div id="login">
        <button hidden={isConnected ? false : true}
          className="bg-slate-950 p-2 text-yellow-500 rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
          onClick={() => loginButton()}>Login</button>
      </div>

      <ConnectWalletModal showDisconnect={true}/>
      
    </div>
  )
}