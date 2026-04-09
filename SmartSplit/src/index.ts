import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('Missing DATABASE_URL env var');

const pool = mysql.createPool(url);
const db = drizzle(pool);

export default db;
