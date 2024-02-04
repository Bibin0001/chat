
const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if an user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this username already exists.' });
    }

    // Hashing the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
