const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  generateJWT,
  hashPassword,
  comparePassword,
  isValidPassword,
} = require('../services/auth');
const { checkUserExists, createUser, findUserByUsername } = require('../services/user');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts, please try again after 10 minutes'
    })
  },
});

router.post('/register-user', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username or password is missing' });
    }

    // passwords should meet a certian checks
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'password should have min 6 characters and one special character' });
    }

    const userExists = await checkUserExists(username);
    if (userExists) {
      return res.status(400).json({ error: 'username already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = await createUser(username, hashedPassword);
    const token = generateJWT(userId, username);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await comparePassword(password, user.hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateJWT(user.id, user.username);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
