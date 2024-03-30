import dbConn from "./conn";
import { MwaUser } from "../types";

export async function getMwaUser(address: string): Promise<MwaUser|undefined> {
  const getUserQuery = "SELECT * FROM users WHERE address='"+address+"'"
  const getUserRes = await dbConn.query(getUserQuery)
  if (getUserRes.rowCount == 0) return undefined
  return getUserRes.rows[0] as MwaUser
}

export async function createMwaUser(address: string): Promise<MwaUser|undefined> {
  console.log('Creating user: ',address)
  const userCheck = getMwaUser(address)
  if(!userCheck) return undefined  // User exists
  console.log('User doesn\'t exist, continuing')
  const insertUserQuery = 'INSERT INTO USERS (address) VALUES (\''+address+'\')'
  console.log('Insert Query: ',insertUserQuery)
  const insertUserRes = await dbConn.query(insertUserQuery)
  if (insertUserRes.rowCount == 0) return undefined // Failed Insert
  console.log('User created')
  const newDBUser = await getMwaUser(address)
  if (!newDBUser) return undefined  // Failed get
  console.log('Found new user')
  return newDBUser as MwaUser
}


