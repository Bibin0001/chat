
const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user with the provided username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this username already exists.' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword
    });

    // Save the new user to the database
    await newUser.save();

    // Redirect to the login page or send a success message
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
/*
router.get('/', (req, res) => {
  res.render('register.pug')
});

router.post('/', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = await User.create({
        username: username,
        password: hashedPassword
      });
  
  await newUser.save()

  return res.redirect('/login');
 
});

module.exports = router;
*/
