const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const requireAuth = async (req, res, next) => {

  const token = req.cookies.token;
  

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
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
