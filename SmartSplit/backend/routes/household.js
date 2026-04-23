const express = require("express");
const router = express.Router();
const { getConnection } = require("../db");
const { v4: uuidv4 } = require("uuid");

router.get("/", async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(`
      SELECT 
        h.householdId,
        h.name,
        h.address,
        h.householdKey,
        COUNT(hm.userId) AS memberCount
      FROM Household h
      LEFT JOIN HouseholdMember hm ON h.householdId = hm.householdId
      GROUP BY h.householdId, h.name, h.address, h.householdKey
    `);

    const households = result.rows.map((row) => ({
      householdId: row[0],
      name: row[1],
      address: row[2],
      householdKey: row[3],
      memberCount: row[4],
    }));

    res.json(households);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

router.post("/", async (req, res) => {
  const { householdName, householdKey, roommateNames } = req.body;

  if (!householdName || !householdKey || !Array.isArray(roommateNames)) {
    return res.status(400).json({
      error: "householdName, householdKey, and roommateNames are required"
    });
  }

  let conn;

  try {
    conn = await getConnection();

    const householdId = uuidv4();

    await conn.execute(
      `INSERT INTO Household (householdId, name, address, householdKey)
       VALUES (:1, :2, :3, :4)`,
      [householdId, householdName, null, householdKey]
    );

    for (const name of roommateNames) {
      const userId = uuidv4();
      const email = `${userId}@smartsplit.local`;

      await conn.execute(
        `INSERT INTO "User" (userId, name, email)
         VALUES (:1, :2, :3)`,
        [userId, name, email]
      );

      await conn.execute(
        `INSERT INTO HouseholdMember (userId, householdId)
         VALUES (:1, :2)`,
        [userId, householdId]
      );
    }

    await conn.commit();

    res.status(201).json({
      householdId,
      householdKey,
      message: "Household created"
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

router.post("/join", async (req, res) => {
  const { householdKey, memberName } = req.body;

  if (!householdKey || !memberName) {
    return res.status(400).json({
      error: "householdKey and memberName are required"
    });
  }

  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT householdId FROM Household WHERE householdKey = :1`,
      [householdKey]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Household not found" });
    }

    const householdId = result.rows[0][0];
    const userId = uuidv4();
    const email = `${userId}@smartsplit.local`;

    await conn.execute(
      `INSERT INTO "User" (userId, name, email)
       VALUES (:1, :2, :3)`,
      [userId, memberName, email]
    );

    await conn.execute(
      `INSERT INTO HouseholdMember (userId, householdId)
       VALUES (:1, :2)`,
      [userId, householdId]
    );

    await conn.commit();

    res.status(201).json({
      message: "Joined household",
      householdId,
      userId
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;