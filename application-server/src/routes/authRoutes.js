const express = require('express');
const router = express.Router();
const pool = require('../services/db');
const { generateJWT, hashPassword, comparePassword } = require('../services/auth');

router.post('/register-user', async (req, res) => {
  try {
    const { username, password } = req.body;

    const selectUser = await pool.query('SELECT count(id) FROM users WHERE username = $1', [username]);
    if (selectUser.rows[0].count !== 0) {
      res.status(400).json({
        error: 'username already exists'
      })
    }
    else {
      const hashedPassword = await hashPassword(password);
      const result = await pool.query('INSERT INTO users (username, hash) VALUES ($1, $2) RETURNING id', [username, hashedPassword]);
      const userId = result.rows[0].id;
      const token = generateJWT(userId);
      res.status(201).json({ token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isValid = await comparePassword(password, user.hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateJWT(user.id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
