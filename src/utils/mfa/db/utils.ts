import dbConn from '@/utils/app/db/conn'
import { MfaCredential } from '../types'


// CREATE MFA CREDENTIAL 
export async function createMfaCredential(cred: MfaCredential) {
  // Encode transports,credId,publicKey for database
  const transports = JSON.stringify(cred.transports)
  const credId = Buffer.from(cred.credentialID).toString('base64url')
  const publicKey = Buffer.copyBytesFrom(cred.credentialPublicKey).toString('hex')
  // INSERT into database
  const insertQuery = "INSERT INTO mfa_credentials (cred_id,cred_pkey,counter,device_type,backed_up,transports,user_address) VALUES ('"+credId+"','"+publicKey+"',"+cred.counter+",'"+cred.credentialDeviceType+"',"+cred.credentialBackedUp+",'"+transports+"','"+cred.user_address+"')"
  const insertRes = await dbConn.query(insertQuery)
  if(insertRes.rowCount == 0) return undefined
  return true
}


// GET MFA CREDENTIALS (MULTIPLE AS ARRAY)
export async function getMfaCredentials(address: string) {
  // SELECT from database
  const getCredQuery = "SELECT * FROM mfa_credentials WHERE user_address='"+address+"'"
  const getCredRes = await dbConn.query(getCredQuery)
  if(getCredRes.rowCount == 0) return []
  // Collect credentials
  let credentials: Array<MfaCredential> = []
  getCredRes.rows.forEach((cred) => {
    // Decode transports, credId, and publicKey from database
    const transports = JSON.parse(cred.transports)
    const credId = new Uint8Array(Buffer.from(cred.cred_id, 'base64url'))
    const publicKey = new Uint8Array(Buffer.from(cred.cred_pkey,'hex'))
    // Build credential
    let credential: MfaCredential = {
      credentialID: credId,
      credentialPublicKey: publicKey,
      transports: transports,
      credentialBackedUp: cred.backed_up,
      credentialDeviceType: cred.device_type,
      counter: cred.counter,
      user_address: cred.user_address,
    }
    credentials.push(credential)
  })
  return credentials as MfaCredential[]
}


// GET SINGLE CREDENTIAL AS MFACREDENTIAL
export async function getMfaCredential(address: string, id: string) {
  // SELECT from database
  const getCredQuery = "SELECT * FROM mfa_credentials WHERE user_address='"+address+"' AND cred_id='"+id+"'"
  const getCredRes = await dbConn.query(getCredQuery)
  if(getCredRes.rowCount == 0) return undefined
  const cred = getCredRes.rows[0]
  // Decode transports, credId, and publicKey from database
  const transports = JSON.parse(cred.transports)
  const credId = new Uint8Array(Buffer.from(cred.cred_id, 'base64url'))
  const publicKey = new Uint8Array(Buffer.from(cred.cred_pkey,'hex'))
  // Build credential
  const credential: MfaCredential = {
    credentialID: credId,
    credentialPublicKey: publicKey,
    transports: transports,
    credentialDeviceType: cred.device_type,
    credentialBackedUp: cred.backed_up,
    counter: cred.counter,
    user_address: cred.user_address
  }
  return credential as MfaCredential
}


// UPDATE MFA CURRENT CHALLENGE
export async function updateMfaCurrentChallenge(address: string, challenge: string) {
  const updateQuery = "UPDATE users SET current_mfa_challenge='"+challenge+"' WHERE address='"+address+"'"
  const updateRes = await dbConn.query(updateQuery)
  if(updateRes.rowCount == 0) return undefined
  return true
}


// UPDATE MFA CREDENTIAL COUNTER
export async function updateMfaCredentialCounter(credentialID: Uint8Array, newCounter: number) {
  // Convert credId
  const credId = Buffer.from(credentialID).toString('base64url')
  const updateQuery = "UPDATE mfa_credentials SET counter="+newCounter+" WHERE cred_id='"+credId+"'"
  const updateRes = await dbConn.query(updateQuery)
  if(updateRes.rowCount == 0) return undefined
  return true
}
