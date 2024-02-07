const express = require("express");
const router = express.Router();
const User = require('../models/user');
const { BaseUser } = require('../controllers/userClass')
const { RoomClass } = require('../controllers/roomClass')
const bcrypt = require('bcryptjs');
const requireAuth = require('../middleware/authMiddleware');

router.post('/create-room', requireAuth, async (req, res) => {
  
  const user = await User.findOne({ 'username': req.user.username} );

}

