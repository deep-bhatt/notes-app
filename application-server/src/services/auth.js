const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateJWT = (userId, username) => {
  return jwt.sign({ userId, username }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

function isValidPassword(password) {
  if (password.length <= 6) {
      return false;
  }
  const regex = /[!@#$%^&*(),.?":{}|<>_]/;
  if (!regex.test(password)) {
      return false;
  }
  return true;
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateJWT,
  hashPassword,
  comparePassword,
  isValidPassword
};
