'use-client'
import { mfaClientGetAuthOptions} from '@/utils/mfa/client'
import { ConnectWalletModal } from '@/components/web3/web3'
import { useAccount, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'
import { startAuthentication } from '@simplewebauthn/browser'


export function LoginModal({client, redirect, authType}:{
  client: string,
  redirect: string,
  authType: string,
}) {
  const { address } = useAccount()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const router = useRouter();
  const cookies = Cookies.get()

  // SignIn with Next-Auth and SIWE
  async function loginButton() {

    // Sign in with SIWE
    if(authType == 'siwe'){
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum.",
        uri: window.location.origin,
        version: "1",
        chainId: 1,
      })
      const signature = await signMessageAsync({
        account: address,
        message: message.prepareMessage(),
      })
      const signInResult = await signIn("MWA", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        type: authType,
        address: address,
      })
      if(!signInResult) return false
      // If signin successful, accept login and redirect    
      if(signInResult.ok){
        // Are we logging in for OAuth?
        if(client == 'oauth'){
          // Session established, ping secure API endpoint      
          const acceptReq = await fetch('/api/acceptLogin',{
            method: 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({login_challenge: cookies.login_challenge, address: address})
          })
          const acceptRes = await acceptReq.json()
          if(!acceptRes) throw Error('Failed to get result from /api/acceptLogin')
          if(acceptRes.error) throw Error(acceptRes.error)
          router.push(acceptRes.redirect_to)
        }
        // App Login
        else{
          router.push(redirect as string)
        }
      }
      else{
        console.log(signInResult)
        return false
      }
    }

    // MFA Login
    else if(authType=='mfa') {
      // Get authOpts
      const authOpts = await mfaClientGetAuthOptions(address as string)
      // Start authentication client-side
      const verifyResponse = await startAuthentication(authOpts)
      // Validate authentication response
      const signInResult = await signIn("MWA",{
        message: JSON.stringify(verifyResponse),
        signature: '0x0',
        redirect: false,
        type: authType,
        address: address,
      })
      if(!signInResult) return false
      if(signInResult?.ok){
        // Redirect user 
        router.push(redirect as string)
      }
      console.log(signInResult)
    }

    return true;
  }

  return (
    <div className="space-y-6 py-8 text-base leading-7 dark:text-slate-400">
      <p>Login to <b>MetaWarrior Army</b></p>
      {(authType == 'siwe') ? 
          <p className="text-xs">Sign a message with your wallet to <b>Log In</b>.</p>
        :
        (authType == 'mfa') ? 
          <p className="text-xs">Verify your account with one of your registered keys.</p>
          :
          <></>
      }
      
      <p>::</p>
      
      <div id="login">
        <button hidden={isConnected ? false : true}
          className="bg-slate-950 p-2 text-yellow-500 rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
          onClick={() => loginButton()}>{(authType=='mfa') ? "Verify" : "Login"}</button>
      </div>

      {(authType=='mfa') ?
          <ConnectWalletModal showDisconnect={false}/>
        :
          <ConnectWalletModal showDisconnect={true}/>
      }
      
    </div>
  )
}