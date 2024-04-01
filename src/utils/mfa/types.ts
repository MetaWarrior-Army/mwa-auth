import type { AuthenticatorTransportFuture, CredentialDeviceType } from '@simplewebauthn/types';

// MFA Credential for working with @simplewebauthn
// Required fields:
// - credentialId: Uint8Array - Convert to base64url and store in DB
// - credentialPublicKey: Uint8Array - Convert raw bytes to hex string and store in DB
// - counter: number - SQL BIGINT
// - credentialDeviceType: CredentialDeviceType
// - credentialBackedUp: boolean
// - transports?: AuthenticatorTransportFuture[] - Converted to JSON string and stored in DB
// - user_address?: string - Required for MWA Application

export type MfaCredential = {
  credentialID: Uint8Array;
  credentialPublicKey: Uint8Array;
  counter: number;
  credentialDeviceType: CredentialDeviceType;
  credentialBackedUp: boolean;
  transports?: AuthenticatorTransportFuture[];
  user_address?: string;
};