const express = require('express');
const router = express.Router();
const {
  generateJWT,
  hashPassword,
  comparePassword,
  isValidPassword,
} = require('../services/auth');
const { checkUserExists, createUser, findUserByUsername } = require('../services/user');

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
    const token = generateJWT(userId);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
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

    const token = generateJWT(user.id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
