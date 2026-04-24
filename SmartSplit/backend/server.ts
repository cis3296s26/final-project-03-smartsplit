import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/users';
import householdRoutes from './routes/households';
import expenseRoutes from './routes/expenses';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));