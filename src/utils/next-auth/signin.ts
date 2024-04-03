import { signIn } from 'next-auth/react'

type MwaSignInMessage = {
  message: any,
  signature: string,
  type: string,
  address: string,
  login_challenge: string,
  mfasession?: string,
  auth_client: string,
  auth_redirect: string,
}

export async function mwaSignIn(signInMessage: MwaSignInMessage){
  // User doesn't have MFA, we need to signIn()
  const signInResult = await signIn("MWA", {
    message: JSON.stringify(signInMessage.message),
    redirect: false,
    signature: signInMessage.signature,
    type: signInMessage.type,
    address: signInMessage.address,
  })
  if(!signInResult) return undefined
  // If signin successful, accept login and redirect    
  if(signInResult.ok){
    // Kick regular users back to redirect
    if(signInMessage.auth_client !== 'oauth') return signInMessage.auth_redirect
    // acceptOAuth2LoginRequest
    if(signInMessage.auth_client == 'oauth') {
      const acceptLoginReq = await fetch('/api/oauth/acceptLogin',{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({login_challenge: signInMessage.login_challenge, address: signInMessage.address})
      })
      const acceptLoginRes = await acceptLoginReq.json()
      if(!acceptLoginRes) throw Error('Failed to get result from /api/acceptLogin')
      if(acceptLoginRes.error) throw Error(acceptLoginRes.error)
      // Redirect user
      return acceptLoginRes.redirect_to
    }
  }
  // Failed to signIn()
  return undefined
}