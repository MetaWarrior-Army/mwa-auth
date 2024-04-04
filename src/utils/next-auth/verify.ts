// Establish Secure Server Side Session
// Supports SIWE and WebAuthn
import { SiweMessage } from 'siwe'
import { createMwaUser, getMwaUser } from '@/utils/app/db/utils'
import { MwaUser } from '@/utils/app/types'
import { MfaCredential } from '../mfa/types'
import { APP_DOMAIN } from '@/utils/app/constants'
import { verifyCredentialAuthenticationResponse } from '../mfa/verify'
import { getMfaCredentials, validateMfaSession } from '../mfa/db/utils'


type MwaNextAuthCredentials = {
  address: string,
  message: string,
  signature: string,
  type: string
}

export async function verifyCredentials(credentials: MwaNextAuthCredentials) {
  console.log('/utils/next-auth/authOptions: ')
  if(!credentials || !credentials.type) return null
  
  // Decode credentials
  const address = atob(credentials.address)
  const message = atob(credentials.message)
  const signature = atob(credentials.signature)
  const type = atob(credentials.type)

  // SIWE login
  // This is the first signature we ever receive from the user.
  // If the user doesn't exist, we create them here.
  if(type == 'siwe'){
    console.log('/utils/next-auth/authOptions: siwe: ')

    // Get SIWE Message
    const siwe = new SiweMessage(JSON.parse(message))
    
    // Verify Message
    const result = await siwe.verify({
      signature: signature,
      domain: APP_DOMAIN,
    })
    if(!result.success) return null
    
    // Get User
    let user: MwaUser
    const userCheck = await getMwaUser(siwe.address)
  
    // Create new user
    if(!userCheck) {
      const newUser = await createMwaUser(siwe.address)
      if(!newUser) return null
      user = newUser
    }
    else{
      user = userCheck
  
      // MFA Protection
      const mfaCreds: MfaCredential[] = await getMfaCredentials(siwe.address)
      if(mfaCreds.length > 0) return null
    }

    // Return user
    return {
      id: user.address,
      user: user,
    }
  }

  // MFA login (Simple WebAuthn)
  // User has already authenticated with SIWE and received a MFA Session
  else if(type == 'mfa'){
    console.log('/utils/next-auth/authOptions: mfa: ')
    
    // Validate signature (MFA Session)
    const validSession = await validateMfaSession(address,signature)
    if(!validSession) return null
    
    // Valid Session
    if(validSession){
    
      // Get message
      const body = JSON.parse(message)
    
      // Get User
      const user = await getMwaUser(address)
      if(!user) return null
    
      // Verify User
      const verified = await verifyCredentialAuthenticationResponse(user,body)
      if(!verified) return null
    
      // Return user
      return {
        id: user.address,
        user: user,
      }
    }
  }

  // signIn() failed
  console.log('/utils/next-auth/authOptions: Invalid credentials')
  return null
}