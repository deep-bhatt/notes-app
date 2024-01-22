const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {
  const token = req.headers['authorization'];

  // console.log(`verifyJwt:token:${token}`);

  if (!token) {
    return res.status(401).json({ error: 'User not logged in.' });
  }

  const jwtPart = token.split(' ')[1];

  try {
    const payload = jwt.verify(jwtPart, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid token.' });
  }
}

module.exports = verifyJwt;
