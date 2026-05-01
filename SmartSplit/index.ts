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

  const pool = mysql.createPool(url as string);
  let conn = null;
  try {
    conn = await pool.getConnection();
    dbInstance = drizzle(pool as unknown as any) as ReturnType<typeof drizzle>;
    return dbInstance;
  } catch (err) {
    console.error('DB init error:', err);
    throw err;
  } finally {
    if (conn) {
      try { conn.release(); } catch {}
    }
  }
}

export default initDb;
