// dbConn.ts
import { Pool } from "pg"

let dbConn;

if (!dbConn) {
  dbConn = new Pool({
    user: process.env.PGSQL_MAIL_USER,
    password: process.env.PGSQL_MAIL_PASS,
    host: process.env.PGSQL_MAIL_HOST,
    port: parseInt(process.env.PGSQL_MAIL_PORT as string),
    database: process.env.PGSQL_MAIL_DB,
  });
}

export default dbConn as Pool