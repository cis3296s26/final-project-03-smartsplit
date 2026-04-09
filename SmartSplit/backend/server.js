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