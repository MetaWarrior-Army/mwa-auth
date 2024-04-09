import dbConn from "./conn";
import { MwaUser } from "../types";

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
