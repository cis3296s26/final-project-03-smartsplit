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