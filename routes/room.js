const express = require("express");
const router = express.Router();
const User = require('../models/user');
const { BaseUser } = require('../controllers/userClass')
const { RoomClass } = require('../controllers/roomClass')
const bcrypt = require('bcryptjs');
const requireAuth = require('../middleware/authMiddleware');
const Room = require('../models/room')



router.get('/:roomId', requireAuth,async(req, res) => {
  
  const roomId = req.params.roomId

  const room = await Room.findOne({ _id: roomId  })
  // Get the client and the recipient
  let clientUser = ''
  let recipient = ''

  if (room.participants[0] === req.user.username){
    clientUser = room.participants[0]
    recipient = room.participants[1]
  } else{
    clientUser = room.participants[1]
    recipient = room.participants[0]
  }

  // Orders the messages by which user has sent them  
  const roomController = new RoomClass(clientUser, recipient);

  const orderedMessages = roomController.getMessages(room)
  console.log(orderedMessages)

  res.status(200).json({ username: req.user.username, messages: orderedMessages})

})


router.post('/check-or-create-room', requireAuth, async(req, res) => {
  const user = req.user.username
  const recipientUser = req.body.recipient
  const chatRoom = await Room.findOne({
    participants: { $all: [user, recipientUser] }
    });

  // If there is no room  its created and send to the front end
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

module.exports = router;
