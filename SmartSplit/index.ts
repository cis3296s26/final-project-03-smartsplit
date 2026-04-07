import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Missing DATABASE_URL env var');
  throw new Error('Missing DATABASE_URL env var');
}
console.log('DATABASE_URL:', url.replace(/\/\/.*@/, '//***@')); // partial mask for safety

let dbInstance: ReturnType<typeof drizzle> | null = null;

export async function initDb() {
  if (dbInstance) return dbInstance;
  // try pool first
  const pool = mysql.createPool(url);
  // quick sanity check connection
  const conn = await pool.getConnection();
  conn.release();
  dbInstance = drizzle(pool);
  return dbInstance;
}

export default initDb;