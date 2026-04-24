import express from 'express';
import { db } from '../db';
import { Household, HouseholdMember, User } from '../schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

function generateKey() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// GET all households
router.get('/', async (req, res) => {
  try {
    const households = await db.select().from(Household);
    res.json(households);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch households' });
  }
});

// GET single household
router.get('/:id', async (req, res) => {
  try {
    const household = await db.select().from(Household).where(eq(Household.householdId, req.params.id));
    if (household.length === 0) return res.status(404).json({ error: 'Household not found' });
    res.json(household[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch household' });
  }
});

// POST create household
router.post('/', async (req, res) => {
  const { name, address } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const householdId = uuidv4();
    const household_key = generateKey();
    await db.insert(Household).values({ householdId, name, address, household_key });
    res.status(201).json({ householdId, household_key });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create household' });
  }
});

// POST join household with key
router.post('/join', async (req, res) => {
  const { userId, household_key } = req.body;
  if (!userId || !household_key) {
    return res.status(400).json({ error: 'userId and household_key are required' });
  }
  try {
    const household = await db.select().from(Household).where(eq(Household.household_key, household_key));
    if (household.length === 0) return res.status(404).json({ error: 'Invalid key' });
    await db.insert(HouseholdMember).values({ userId, householdId: household[0].householdId });
    res.status(201).json({ message: 'Joined household', householdId: household[0].householdId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join household' });
  }
});

// GET household members
router.get('/:id/members', async (req, res) => {
  try {
    const members = await db
      .select({ userId: User.userId, name: User.name, email: User.email })
      .from(HouseholdMember)
      .innerJoin(User, eq(HouseholdMember.userId, User.userId))
      .where(eq(HouseholdMember.householdId, req.params.id));
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

export default router;