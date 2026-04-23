/**
 * lib/db.ts
 * Singleton MySQL2 connection pool.
 * Used only in Server Components and Server Actions — never imported on the client.
 */

import mysql from "mysql2/promise";

declare global {
  // Prevent multiple pools in dev hot-reload
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

function createPool(): mysql.Pool {
  return mysql.createPool({
    host:     process.env.DB_HOST     ?? "localhost",
    port:     Number(process.env.DB_PORT ?? 3306),
    user:     process.env.DB_USER     ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME     ?? "novure_db",
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    timezone:           "+00:00",
  });
}

// Reuse pool across hot reloads in dev
const pool: mysql.Pool = global._mysqlPool ?? createPool();
if (process.env.NODE_ENV !== "production") global._mysqlPool = pool;

export default pool;
