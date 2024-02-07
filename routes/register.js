const express = require("express");
const router = express.Router();
const User = require('../models/user');
const { BaseUser } = require('../controllers/userClass')
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = new BaseUser(username, password);
  userRegistration = await user.register()

  // Checks if an user with that username exists if not he is registered to DB, with a hashed password
  if (userRegistration === true){
    res.status(201).json({ message: 'User registered successfully.' });

  } else {

    res.status(400).json({ message: 'User with this username already exists.' });
  }
  
});

module.exports = router;
