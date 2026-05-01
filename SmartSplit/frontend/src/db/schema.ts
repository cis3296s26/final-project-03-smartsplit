import { int, mysqlTable, serial, varchar, json, timestamp } from 'drizzle-orm/mysql-core';

export const Household = mysqlTable('Household', {
  id: int('id').primaryKey().notNull().autoincrement(),
  name: varchar({ length: 255 }).primaryKey().notNull(),
  num_roommates: int('num_roommates').notNull(),
  roommates: json().notNull(),
  joinKey: varchar({ length: 36 }).unique().notNull(),
  created_at: timestamp('created_at').defaultNow(),
});


export const User = mysqlTable('User', {
  userId: varchar('userId', { length: 36 }).primaryKey().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
});


export const HouseholdMember = mysqlTable('HouseholdMember', {
  userId: varchar('userId', { length: 36 }).notNull().references(() => User.userId),
  householdId: varchar('householdId', { length: 36 }).notNull().references(() => Household.householdId),
});

export const Expense = mysqlTable('Expense', {
  expenseId: varchar('expenseId', { length: 36 }).primaryKey().notNull(),
  description: varchar('description', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  expenseDate: date('expenseDate').notNull(),
  splitType: mysqlEnum('splitType', ['Equal', 'Percentage', 'Custom']).notNull(),
  category: mysqlEnum('category', ['Rent', 'Utilities', 'Groceries', 'Subscriptions', 'Other']).notNull(),
  householdId: varchar('householdId', { length: 36 }).references(() => Household.householdId),
});

export const ExpenseShare = mysqlTable('ExpenseShare', {
  shareId: varchar('shareId', { length: 36 }).primaryKey().notNull(),
  amountOwed: decimal('amountOwed', { precision: 10, scale: 2 }).notNull(),
  userId: varchar('userId', { length: 36 }).references(() => User.userId),
  expenseId: varchar('expenseId', { length: 36 }).references(() => Expense.expenseId),
});