require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2/promise');

const userRoutes = require('./routes/users');
//const householdRoutes = require('./routes/households');
//const expenseRoutes = require('./routes/expenses');

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

app.use('/api/users', userRoutes);
//app.use('/api/households', householdRoutes);
//app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});


