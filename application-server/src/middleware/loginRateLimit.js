const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts, please try again after 10 minutes'
    })
  },
});

module.exports = loginLimiter;
