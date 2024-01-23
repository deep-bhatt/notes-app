const pool = require('../services/db');

async function checkUserExists(username) {
  const selectUser = await pool.query('SELECT count(id) FROM users WHERE username = $1', [username]);
  return parseInt(selectUser.rows[0].count) !== 0;
}

async function findUserByUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

async function createUser(username, hashedPassword) {
  const result = await pool.query('INSERT INTO users (username, hash) VALUES ($1, $2) RETURNING id', [username, hashedPassword]);
  return result.rows[0].id;
}

module.exports = {
  checkUserExists,
  createUser,
  findUserByUsername,
}