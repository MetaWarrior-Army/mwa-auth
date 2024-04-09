import { mfaClientGetAuthOptions} from '@/utils/mfa/client'
import { ConnectWalletModal } from '@/components/web3/web3'
import { useAccount } from 'wagmi'
import { useRouter } from "next/navigation"
import { startAuthentication } from '@simplewebauthn/browser'
import { toasterNotify } from '@/utils/app/toaster'
import { mwaSignIn } from '@/utils/next-auth/signin'


export function MfaLoginModal({client, redirect, login_challenge, mfa_session}:{
  client: string,
  redirect: string,
  login_challenge: string,
  mfa_session: string,
}) {
  const { address } = useAccount()
  const { isConnected } = useAccount()
  const router = useRouter();

  // SignIn with Next-Auth and SIWE
  async function verifyMFA() {  
    // Get authOpts
    const authOpts = await mfaClientGetAuthOptions(address as string)
    // Start authentication client-side
    let verifyResponse
    try {
      verifyResponse = await startAuthentication(authOpts)
    } catch (e) {
      toasterNotify({message:'Failed to verify security key.',type:'error'})
    }
    // Got response
    if(verifyResponse){
      const signInResult = await mwaSignIn({
        message: verifyResponse,
        signature: mfa_session,
        type: 'mfa',
        address: address as string,
        login_challenge: login_challenge as string,
        auth_client: client,
        auth_redirect: redirect,
      })
      if(!signInResult) return false
      toasterNotify({message:'Verified!',type:'success'})
      // SignIn successful, redirect
      router.push(signInResult)
    }
    return true;
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