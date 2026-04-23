const express = require("express");
const router = express.Router();
const { getConnection } = require("../db");
const { v4: uuidv4 } = require("uuid");

router.get("/household/:householdId", async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT expenseId, description, amount, date, splitType, category, householdId
       FROM Expense
       WHERE householdId = :1
       ORDER BY date DESC`,
      [req.params.householdId]
    );

    const expenses = result.rows.map((row) => ({
      expenseId: row[0],
      description: row[1],
      amount: row[2],
      date: row[3],
      splitType: row[4],
      category: row[5],
      householdId: row[6],
    }));

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

router.post("/", async (req, res) => {
  const { description, amount, category, householdId } = req.body;

  if (!description || !amount || !category || !householdId) {
    return res.status(400).json({
      error: "description, amount, category, and householdId are required"
    });
  }

  let conn;

  try {
    conn = await getConnection();

    const expenseId = uuidv4();

    await conn.execute(
      `INSERT INTO Expense (expenseId, description, amount, date, splitType, category, householdId)
       VALUES (:1, :2, :3, SYSDATE, :4, :5, :6)`,
      [expenseId, description, amount, "Equal", category, householdId]
    );

    const members = await conn.execute(
      `SELECT userId FROM HouseholdMember WHERE householdId = :1`,
      [householdId]
    );

    if (members.rows.length > 0) {
      const shareAmount = Number(amount) / members.rows.length;

      for (const row of members.rows) {
        const userId = row[0];
        const shareId = uuidv4();

        await conn.execute(
          `INSERT INTO ExpenseShare (shareId, amountOwed, userId, expenseId)
           VALUES (:1, :2, :3, :4)`,
          [shareId, shareAmount, userId, expenseId]
        );
      }
    }

    await conn.commit();

    res.status(201).json({
      expenseId,
      description,
      amount,
      category,
      householdId,
      message: "Expense added"
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

router.delete("/:id", async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    await conn.execute(
      `DELETE FROM ExpenseShare WHERE expenseId = :1`,
      [req.params.id]
    );

    await conn.execute(
      `DELETE FROM Expense WHERE expenseId = :1`,
      [req.params.id]
    );

    await conn.commit();

    res.json({ message: "Expense deleted" });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;