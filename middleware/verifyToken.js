const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
