import { int, mysqlTable, serial, varchar, json, timestamp } from 'drizzle-orm/mysql-core';

export const Household = mysqlTable('Household', {
  id: int('id').primaryKey().notNull().autoincrement(),
  name: varchar({ length: 255 }).primaryKey().notNull(),
  num_roommates: int('num_roommates').notNull(),
  roommates: json().notNull(),
  joinKey: varchar({ length: 36 }).unique().notNull(),
  created_at: timestamp('created_at').defaultNow(),
});
