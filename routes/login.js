const express = require("express")
const router = express.Router();
exports.router = router;
const User = require('../models/user');
const { compare } = require("bcryptjs");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/', (req, res) => {
  username = req.body.username
  password = req.body.password

  User.findOne({username: username}).then((currentUser) => {
    const currentUnixTime = Math.floor(new Date().getTime() / 1000);

    if (currentUser && (bcrypt.compareSync(password, currentUser.password))) {
     const token = jwt.sign(
      {username: currentUser.username, time_created: currentUnixTime },
      "verySecretKey",
      {
        expiresIn: "2h",
      }
    );

    currentUser.token = token;
    
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'Login successful', token });
    }

    else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    
  });
  

});


module.exports = router;


