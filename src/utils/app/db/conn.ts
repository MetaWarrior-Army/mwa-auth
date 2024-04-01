// dbConn.ts
import { Pool } from "pg"

let dbConn;

if (!dbConn) {
  dbConn = new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASS,
    host: process.env.PGSQL_HOST,
    port: parseInt(process.env.PGSQL_PORT as string),
    database: process.env.PGSQL_DB,
  });
}

export default dbConn as Pool