const express = require("express")
const router = express.Router();
exports.router = router;
const User = require('../models/user');
const { compare } = require("bcryptjs");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { BaseUser }= require('../controllers/userClass')

router.post('/', async (req, res) => {
  username = req.body.username
  password = req.body.password
  const user = new BaseUser(username, password);

  // Checks for the user if the credentials are right it gives out the user token
  loginUser = await user.login();
  if (loginUser){
    res.cookie("token", loginUser, { httpOnly: true });
    res.status(200).json({ success: true, message: 'Login successful', loginUser });
    }

  else{
      res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

});


module.exports = router;


