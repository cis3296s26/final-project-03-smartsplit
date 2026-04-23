require('dotenv').config();
const express = require("express");
const cors = require("cors");

const userRoutes = require('./routes/users');
const householdRoutes = require('./routes/household');
const expenseRoutes = require('./routes/expenses');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SmartSplit backend running");
});

app.use('/api/users', userRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/expenses', expenseRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});