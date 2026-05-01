import express from 'express';
import { db } from '../db';
import { Expense, ExpenseShare, User } from '../schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET expenses for a household
router.get('/household/:householdId', async (req, res) => {
  try {
    const expenses = await db.select().from(Expense).where(eq(Expense.householdId, req.params.householdId));
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// GET single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await db.select().from(Expense).where(eq(Expense.expenseId, req.params.id));
    if (expense.length === 0) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// POST create expense
router.post('/', async (req, res) => {
  const { description, amount, expenseDate, splitType, category, householdId, userIds } = req.body;
  if (!amount || !category || !householdId || !splitType || !Array.isArray(userIds)) {
    return res.status(400).json({ error: 'amount, category, householdId, splitType and userIds are required' });
  }
  try {
    const expenseId = uuidv4();
    await db.insert(Expense).values({ expenseId, description, amount, expenseDate, splitType, category, householdId });

    const shareAmount = (parseFloat(amount) / userIds.length).toFixed(2);
    for (const userId of userIds) {
      await db.insert(ExpenseShare).values({ shareId: uuidv4(), amountOwed: shareAmount, userId, expenseId });
    }
    res.status(201).json({ expenseId, message: 'Expense created and shares generated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// PUT edit expense
router.put('/:id', async (req, res) => {
  const { description, amount, expenseDate, category } = req.body;
  try {
    await db.update(Expense).set({ description, amount, expenseDate, category }).where(eq(Expense.expenseId, req.params.id));
    res.json({ message: 'Expense updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE expense
router.delete('/:id', async (req, res) => {
  try {
    await db.delete(ExpenseShare).where(eq(ExpenseShare.expenseId, req.params.id));
    await db.delete(Expense).where(eq(Expense.expenseId, req.params.id));
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;