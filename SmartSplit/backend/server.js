<<<<<<< HEAD
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());

// Routes
const userRoutes = require('./routes/users');
const householdRoutes = require('./routes/households');
const expenseRoutes = require('./routes/expenses');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');

app.use('/api/users', userRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('SmartSplit API is running');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL env var');
  process.exit(1);
}
const pool = mysql.createPool(DATABASE_URL);

app.get("/", (req, res) => {
  res.send("SmartSplit backend running");
});

// Create household
app.post("/households", async (req, res) => {
  const { householdName, householdKey, numRoommates, roommateNames } = req.body;
  if (!householdName || !householdKey || !Array.isArray(roommateNames)) {
    return res.status(400).json({ error: 'householdName, householdKey and roommateNames are required' });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const roommatesJson = JSON.stringify(roommateNames);
      const [result] = await conn.execute(
        `INSERT INTO Household (name, household_key, num_roommates, roommates) VALUES (?, ?, ?, ?)`,
        [householdName, householdKey, numRoommates || roommateNames.length, roommatesJson]
      );
      conn.release();
      return res.status(201).json({ id: result.insertId });
    } catch (err) {
      conn.release();
      console.error(err);
      return res.status(500).json({ error: 'DB insert failed' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB connection failed' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});


>>>>>>> 130a0e7c43958948450fc30e25280d93dc17e264
