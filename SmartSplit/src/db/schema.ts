import { int, mysqlTable, serial, varchar, json } from 'drizzle-orm/mysql-core';

export const Household = mysqlTable('Household', {
  nickname: varchar({ length: 36 }).primaryKey().notNull(),
  roommates: json().notNull(),
  joinKey: varchar({ length: 36 }).unique().notNull(),
});
