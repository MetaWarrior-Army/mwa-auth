import {MwaUser} from '@/utils/app/types'
import {getMfaCredentials,updateMfaCurrentChallenge,createMfaCredential} from './db/utils'
import {MfaCredential} from './types'
import {RP_ID,RP_NAME,RP_ORIGIN,MAX_MFA_PER_USER} from './constants'
import {generateRegistrationOptions,verifyRegistrationResponse} from '@simplewebauthn/server'
import {CredentialDeviceType, RegistrationResponseJSON} from '@simplewebauthn/types'


// Get MFA Registration Options
export async function getRegistrationOptions(user: MwaUser){
  // Get current credentials
  const userAuthenticators: MfaCredential[] = await getMfaCredentials(user.address)
  // Prevent voiding Max Registrations Per User
  if((userAuthenticators.length+1) > MAX_MFA_PER_USER) return false
  // Generate options
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: user.address,
    userName: user.username as string,
    attestationType: 'none',
    // Prevent users from re-registering existing authenticators
    excludeCredentials: userAuthenticators.map(authenticator => ({
      id: authenticator.credentialID,
      type: 'public-key',
      transports: authenticator.transports,
    })),
    authenticatorSelection: {
      // Defaults
      residentKey: 'preferred',
      userVerification: 'preferred'
    },
  });
  // Update user's current challenge
  const storeCreds = await updateMfaCurrentChallenge(user.address as string, options.challenge)
  if(!storeCreds) return false
  // Return options
  return options
}


// Verify Registration Response
export async function verifyCredentialRegistrationResponse(user: MwaUser, body: RegistrationResponseJSON) {
  // Get Challenge
  const expectedChallenge: string = user.current_mfa_challenge as string
  // Verify response
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: RP_ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: false,
    });
  } catch (error) {
    console.error(error);
    return undefined
  }
  const { verified } = verification;
  // Registration Verified
  if(verified) {
    // Build Credential
    const { registrationInfo } = verification;
    const newCredential: MfaCredential = {
      credentialID: registrationInfo?.credentialID as Uint8Array,
      credentialPublicKey: registrationInfo?.credentialPublicKey as Uint8Array,
      counter: registrationInfo?.counter as number,
      credentialDeviceType: registrationInfo?.credentialDeviceType as CredentialDeviceType,
      credentialBackedUp: registrationInfo?.credentialBackedUp as boolean,
      transports: body.response.transports,
      user_address: user.address
    };
    // Save credential to database
    const newCred = await createMfaCredential(newCredential)
    if(!newCred) return undefined
  }
  return verified
}

