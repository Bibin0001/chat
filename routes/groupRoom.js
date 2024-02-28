const express = require("express");
const router = express.Router();
const User = require('../models/user');
const { BaseUser } = require('../controllers/userClass')
const { GroupRoom } = require('../controllers/roomClass')
const requireAuth = require('../middleware/authMiddleware');
const GroupRoom = require('../models/groupRoom.js')



router.post('/create-group-room', requireAuth, async(req, res) => {
  const user = req.user.username

  const groupRoom = new GroupRoom(user) 

  groupRoom.createGroupRoom()









  //res.status(200).json({ roomId: chatRoom.id });
  

});



router.get('/:groupRoomId', requireAuth,async(req, res) => {
  
  const roomId = req.params.groupRoomId

  const groupRoom = await Room.findOne({ _id: roomId  })
  // Get the client and the recipient
  const clientUser = req.user.username
  const clientUserIndex = room.participants.indexOf(clientUser)
  const recipient = clientUserIndex === 0 ? room.participants[1] : room.participants[0];


  // Orders the messages by which user has sent them  
  const roomController = new RoomClass(clientUser, recipient);

  let lastMessages = roomController.getMessages(room)
  lastMessages.sort((a, b) => (b.lastMessage) - (a.lastMessage));

  res.status(200).json({ clientUsername: clientUser, messages: lastMessages})

})



module.exports = router;
