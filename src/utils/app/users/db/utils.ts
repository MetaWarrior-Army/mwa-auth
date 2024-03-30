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
  if(typeof userCheck !== 'undefined') return undefined  // User exists
  const insertUserQuery = 'INSERT INTO USERS (address) VALUES (\''+address+'\')'
  const insertUserRes = await dbConn.query(insertUserQuery)
  if (insertUserRes.rowCount == 0) return undefined // Failed Insert
  const newDBUser = await getMwaUser(address)
  if (!newDBUser) return undefined  // Failed get
  return newDBUser as MwaUser
}


