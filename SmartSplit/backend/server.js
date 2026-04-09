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


