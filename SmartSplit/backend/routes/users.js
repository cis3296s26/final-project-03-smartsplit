const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// GET all users
router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute('SELECT * FROM "User"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// POST create a user
router.post('/', async (req, res) => {
  const { userId, name, email } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `INSERT INTO "User" (userId, name, email) VALUES (:1, :2, :3)`,
      [userId, name, email],
      { autoCommit: true }
    );
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;