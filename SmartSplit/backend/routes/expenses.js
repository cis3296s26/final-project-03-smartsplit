const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

// GET all expenses for a household
router.get('/household/:householdId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM Expense WHERE householdId = ? ORDER BY expenseDate DESC',
      [req.params.householdId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// GET single expense by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM Expense WHERE expenseId = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// POST log a new expense and generate shares
router.post('/', async (req, res) => {
  const { description, amount, expenseDate, splitType, category, householdId, userIds } = req.body;
  if (!amount || !category || !householdId || !splitType || !Array.isArray(userIds)) {
    return res.status(400).json({ error: 'amount, category, householdId, splitType and userIds are required' });
  }
  try {
    const expenseId = uuidv4();

    // insert the expense
    await pool.execute(
      `INSERT INTO Expense (expenseId, description, amount, expenseDate, splitType, category, householdId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [expenseId, description, amount, expenseDate || new Date(), splitType, category, householdId]
    );

    // generate equal shares for each user
    const shareAmount = (amount / userIds.length).toFixed(2);
    for (const userId of userIds) {
      const shareId = uuidv4();
      await pool.execute(
        `INSERT INTO ExpenseShare (shareId, amountOwed, userId, expenseId)
         VALUES (?, ?, ?, ?)`,
        [shareId, shareAmount, userId, expenseId]
      );
    }

    res.status(201).json({ expenseId, message: 'Expense logged and shares created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log expense' });
  }
});

// PUT edit an expense
router.put('/:id', async (req, res) => {
  const { description, amount, expenseDate, category } = req.body;
  if (!amount || !category) {
    return res.status(400).json({ error: 'amount and category are required' });
  }
  try {
    const [result] = await pool.execute(
      `UPDATE Expense SET description = ?, amount = ?, expenseDate = ?, category = ?
       WHERE expenseId = ?`,
      [description, amount, expenseDate, category, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE an expense
router.delete('/:id', async (req, res) => {
  try {
    // delete shares first due to foreign key
    await pool.execute('DELETE FROM ExpenseShare WHERE expenseId = ?', [req.params.id]);

    const [result] = await pool.execute(
      'DELETE FROM Expense WHERE expenseId = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;