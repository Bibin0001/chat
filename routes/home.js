const express = require("express");
const router = express.Router();
const User = require('../models/user');
const requireAuth = require('../middleware/authMiddleware');
const Room = require('../models/room')
const GroupRoom = require('../models/groupRoom')

router.get('/', requireAuth, async (req, res) => {
  
  const user = await User.findOne({ 'username': req.user.username} );

  const room = await Room.find({ participants: user.username })

  const groupRoom = await GroupRoom.find({ participants: user.username })
  res.status(200).json({ Room : room, groupRooms : groupRoom });

});


module.exports = router;

