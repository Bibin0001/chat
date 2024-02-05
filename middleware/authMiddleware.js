const User = require('../models/user');
const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {

  const token = req.cookies.token;
  

  if (token) {
    jwt.verify(token, 'verySecretKey', (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        req.user = decodedToken; 
        next();
      }
    });
  } else {
    return res.status(401).json({ error: 'Token not provided' });
  }
};

module.exports = requireAuth;
