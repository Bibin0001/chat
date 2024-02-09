const express = require("express");
const router = express.Router();
const User = require('../models/user');
const { BaseUser } = require('../controllers/userClass')
const { RoomClass } = require('../controllers/roomClass')
const bcrypt = require('bcryptjs');
const requireAuth = require('../middleware/authMiddleware');
const Room = require('../models/room')

router.post('/check-or-create-room', requireAuth, async(req, res) => {

  const user = req.user.username
  const recipientUser = req.body.recipient

  const chatRoom = await Room.findOne({
    participants: { $all: [user, recipientUser] }
    });
  
  // If there is no room its created and send to the front end
  if (chatRoom === null){
    const newRoom = new RoomClass(user, recipientUser);
    const newRoomId = await newRoom.createRoom();
    if (newRoomId){
      res.status(201).json({ message: 'Chat created.', roomId: newRoomId  });
    }
  }
  else{
    res.status(200).json({ roomId: chatRoom.id });
  }

});

router.get('/:roomId', async(req, res) => {
  console.log('INSIDE THE ROOM');

})


module.exports = router;
