import {MwaUser} from '@/utils/app/types'
import {getMfaCredentials,updateMfaCurrentChallenge,getMfaCredential,updateMfaCredentialCounter} from './db/utils'
import {RP_ID,RP_ORIGIN} from './constants'
import {MfaCredential} from './types'
import {AuthenticationResponseJSON} from '@simplewebauthn/types'
import {generateAuthenticationOptions,verifyAuthenticationResponse} from '@simplewebauthn/server'


// Get Authentication Options
export async function getAuthenticationOptions(user: MwaUser){
  // Get Credentials
  const userCreds = await getMfaCredentials(user.address)
  if(!userCreds) return undefined
  // Get Options
  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    // Require users to use a previously-registered authenticator
    allowCredentials: userCreds.map((cred) => ({
      id: cred.credentialID,
      type: 'public-key',
      transports: cred.transports,
    })),
    // See "Guiding use of authenticators via authenticatorSelection" below
    userVerification: 'preferred',
  });
  // Update Challenge
  const storeCreds = await updateMfaCurrentChallenge(user.address as string, options.challenge)
  if(!storeCreds) return undefined
  // Return Options
  return options
}


// Verify Authentication Options
export async function verifyCredentialAuthenticationResponse(user: MwaUser, body: AuthenticationResponseJSON) {
  // Get Current Challenge
  const expectedChallenge: string = user.current_mfa_challenge as string
  // Get Credential
  const authenticator = await getMfaCredential(user.address, body.id) as MfaCredential
  if(!authenticator) return undefined
  // Verify credential
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: RP_ORIGIN,
      expectedRPID: RP_ID,
      authenticator,
      requireUserVerification: false,
    });
  } catch (error) {
    console.error(error);
    return undefined
  }
  const { verified } = verification;
  // Credential Verified
  if(verified){
    // Increment credential's counter
    const { authenticationInfo } = verification;
    const { newCounter } = authenticationInfo;
    const counterUpdate = await updateMfaCredentialCounter(authenticator.credentialID, newCounter);
    if(!counterUpdate) return undefined
  }
  return verified
}
