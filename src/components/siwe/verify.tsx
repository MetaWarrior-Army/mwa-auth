'use-client'
import { mfaClientGetAuthOptions} from '@/utils/mfa/client'
import { ConnectWalletModal } from '@/components/web3/web3'
import { useAccount, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'
import { startAuthentication } from '@simplewebauthn/browser'


export function SIWEVerifyModal({redirect}:{
  redirect: string
}) {
  const { address } = useAccount()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const router = useRouter();
  const cookies = Cookies.get()

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
    // Verify message
    const verifyReq = await fetch('/api/siwe/verify', {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({message: message, signature: signature})
    })
    const verifyRes = await verifyReq.json()
    if(!verifyRes) return false
    // Redirect user
    if(verifyRes.verified){
      router.push(redirect)
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