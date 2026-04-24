import express from 'express';
import { db } from '../db';
import { User } from '../schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await db.select().from(User);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET single user
router.get('/:id', async (req, res) => {
  try {
    const user = await db.select().from(User).where(eq(User.userId, req.params.id));
    if (user.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(user[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create user
router.post('/', async (req, res) => {
  const { userId, name, email } = req.body;
  if (!userId || !name || !email) {
    return res.status(400).json({ error: 'userId, name and email are required' });
  }
  try {
    await db.insert(User).values({ userId, name, email });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  const { name, email } = req.body;
  try {
    await db.update(User).set({ name, email }).where(eq(User.userId, req.params.id));
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await db.delete(User).where(eq(User.userId, req.params.id));
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;