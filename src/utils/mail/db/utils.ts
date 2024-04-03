import dbConn from './conn'

export async function getMailbox(
  username: string
) {
  const mbQuery = "SELECT * FROM mailbox WHERE username='"+username+"'"
  const mbRes = await dbConn.query(mbQuery)
  if(mbRes.rowCount == 0) return false
  return mbRes.rows[0]
}

export async function getMailQuota(
  mailbox: string
) {
    const getMailboxQuery = "SELECT * FROM mailbox WHERE username='"+mailbox+"'"
    const getMailboxRes = await dbConn.query(getMailboxQuery)
    if(getMailboxRes.rowCount == 0) return false
    // Format quota rules
    const quotabytes = Number(getMailboxRes.rows[0].quota);
    const quotam = quotabytes / 1000000;
    const quota_rule = "dirsize:storage=+"+String(quotam)+"M";
    return quota_rule
}

export async function getMailAlias(
  alias: string
) {
  const getAliasQuery = "SELECT * FROM alias WHERE address='"+alias+"'"
  const getAliasRes = await dbConn.query(getAliasQuery)
  if(getAliasRes.rowCount == 0) return false
  return getAliasRes.rows[0]
}