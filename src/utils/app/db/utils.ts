import dbConn from "./conn";
import { MwaUser } from "../types";
import { getRandomString } from "../rand";

export async function getMwaUser(address: string): Promise<MwaUser|undefined> {
  const getUserQuery = "SELECT * FROM users WHERE address='"+address+"'"
  const getUserRes = await dbConn.query(getUserQuery)
  if (getUserRes.rowCount == 0) return undefined
  return getUserRes.rows[0] as MwaUser
}

export async function createMwaUser(address: string): Promise<MwaUser|undefined> {
  const userCheck = getMwaUser(address)
  if(!userCheck) return undefined  // User exists
  const insertUserQuery = 'INSERT INTO USERS (address) VALUES (\''+address+'\')'
  const insertUserRes = await dbConn.query(insertUserQuery)
  if (insertUserRes.rowCount == 0) return undefined // Failed Insert
  const newDBUser = await getMwaUser(address)
  if (!newDBUser) return undefined  // Failed get
  return newDBUser as MwaUser
}

export async function getMwaUsername(username: string): Promise<MwaUser|undefined> {
  const getUserQuery = "SELECT * FROM users WHERE username='"+username+"'"
  const getUserRes = await dbConn.query(getUserQuery)
  if (getUserRes.rowCount == 0) return undefined
  return getUserRes.rows[0] as MwaUser
}

export async function updateMwaUsername(address:string,username:string,avatarCID:string,nftCID:string) {
  const updateQuery = "UPDATE users SET nft_0_avatar_cid='"+avatarCID+"', nft_0_cid='"+nftCID+"', username='"+username+"' WHERE address='"+address+"'"
  const queryRes = await dbConn.query(updateQuery)
  if(!queryRes) return undefined
  if(queryRes.rowCount == 0) return undefined
  return true
}

export async function clearMwaUsername(address:string){
  const clearQuery = "UPDATE users SET username=NULL,nft_0_avatar_cid=NULL,nft_0_cid=NULL WHERE address='"+address+"'"
  const clearRes = await dbConn.query(clearQuery)
  if(clearRes.rowCount == 0) return undefined
  return true
}

export async function updateNftTx(address: string,txHash:string,tokenId:number) {
  const updateQuery = "UPDATE users SET nft_0_tx='"+txHash+"', nft_0_id="+tokenId+" WHERE address='"+address+"'"
  const queryRes = await dbConn.query(updateQuery)
  if(!queryRes) return undefined
  if(queryRes.rowCount == 0) return undefined
  return true
}

export async function checkInvite(invite:string) {
  const searchQuery = "SELECT * from codes WHERE code='"+invite+"'"
  const searchRes = await dbConn.query(searchQuery)
  if(searchRes.rowCount == 0) return undefined
  const code = searchRes.rows[0]
  if(parseInt(code.times_used) >= parseInt(code.supply)) return undefined
  return true
}

export async function consumeInvite(address:string, invite:string) {
  // Check code
  const checkInv = await checkInvite(invite)
  if(!checkInv) return undefined
  // Update code
  // Get code
  const getInvQuery = "SELECT * FROM codes WHERE code='"+invite+"'"
  const getInvRes = await dbConn.query(getInvQuery)
  if(getInvRes.rowCount == 0) return undefined
  // Increment usage
  const newCount = parseInt(getInvRes.rows[0].times_used) + 1
  const updateInvQuery = "UPDATE codes SET times_used="+newCount+" WHERE code='"+invite+"'"
  const updateRes = await dbConn.query(updateInvQuery)
  if(updateRes.rowCount == 0) return undefined
  // Update user
  const updateUserQuery = "UPDATE users SET invite_code='"+invite+"' WHERE address='"+address+"'"
  const updateUserRes = await dbConn.query(updateUserQuery)
  if(updateUserRes.rowCount == 0) return undefined
  // Finished
  return true
}

export async function checkReferral(code:string) {
  const searchCodeQuery = "SELECT * FROM users WHERE referral_code='"+code+"'"
  const searchRes = await dbConn.query(searchCodeQuery)
  if(searchRes.rowCount == 0) return undefined
  return true
}

export async function consumeReferral(address:string,code:string) {
  if(!(await checkReferral(code))) return undefined
  // update code
  // Get code
  const getRefQuery = "SELECT * FROM users WHERE referral_code='"+code+"'"
  const getRefRes = await dbConn.query(getRefQuery)
  if(getRefRes.rowCount == 0) return undefined
  // Get user
  const user = getRefRes.rows[0] as MwaUser
  if(!user) return undefined
  // Increment num_referrals
  const newRefCount = user.num_referrals as number + 1
  const updateRefCountQuery = "UPDATE users SET num_referrals="+newRefCount+" WHERE address='"+user.address+"'"
  const updateRefCountRes = await dbConn.query(updateRefCountQuery)
  if(updateRefCountRes.rowCount == 0) return undefined
  // Update user
  const updateUserQuery = "UPDATE users SET invite_code='"+code+"' WHERE address='"+address+"'"
  const updateUserRes = await dbConn.query(updateUserQuery)
  if(updateUserRes.rowCount == 0) return undefined
  // finished
  return true
}

export async function createReferral(address:string) {
  let code = getRandomString(8)
  while(await checkReferral(code)) code = getRandomString(8)
  const updateQuery = "UPDATE users SET referral_code='"+code+"' WHERE address='"+address+"'"
  const updateRes = await dbConn.query(updateQuery)
  if(updateRes.rowCount == 0) return undefined
  return true
}