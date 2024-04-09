import { signIn } from 'next-auth/react'

export type MwaSignInMessage = {
  address: string,
  message: any,
  signature: string,
  type: string,
  login_challenge: string,
  auth_client: string,
  auth_redirect: string,
}

// Mwa Wrapper for Next-Auth SignIn
// Controls redirect and handles OAuth
export async function mwaSignIn(signInMessage: MwaSignInMessage){
  // User doesn't have MFA, we need to signIn()
  // encode credentials
  const signInResult = await signIn("MWA", {
    address: btoa(signInMessage.address),
    message: btoa(JSON.stringify(signInMessage.message)),
    signature: btoa(signInMessage.signature),
    type: btoa(signInMessage.type),
    redirect: false,
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
      if(!acceptLoginRes) throw Error('Failed to get result from /api/oauth/acceptLogin')
      if(acceptLoginRes.error) throw Error(acceptLoginRes.error)
      // Redirect user
      return acceptLoginRes.redirect_to
    }
  }
  // Failed to signIn()
  return undefined
}