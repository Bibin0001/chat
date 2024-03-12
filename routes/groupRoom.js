const express = require("express");
const router = express.Router();
const User = require('../models/user');
const { BaseUser } = require('../controllers/userClass')
const { GroupRoomClass } = require('../controllers/roomClass')
const requireAuth = require('../middleware/authMiddleware');
const GroupRoom = require('../models/groupRoom')
const { getKey } = require('../middleware/getKey')

router.post('/create-group-room', requireAuth, async(req, res) => {
  const user = req.user.username

  const participants = req.body.participants
  const roomName = req.body.roomName
  const groupRoom = new GroupRoomClass(user) 

  const newGroupRoomId = await groupRoom.createGroupRoom(roomName, participants)
  console.log(newGroupRoomId)


  res.status(200).json({ roomId: newGroupRoomId });

});



router.get('/:groupRoomId', requireAuth,async(req, res) => {
  const user = req.user.username
  const groupRoomId = req.params.groupRoomId

  const groupRoomObject = await GroupRoom.findOne({ _id: groupRoomId })
  const groupRoom = new GroupRoomClass(user);
  let lastMessages = groupRoom.getMessages(groupRoomObject)
  const isAdmin = groupRoomObject.admins.includes(user);

  const keyAndIv = await getKey(groupRoomId)

  const key = keyAndIv[0];
  const iv = keyAndIv[1];


  res.status(200).json({ clientUsername: user, messages: lastMessages, participants: groupRoomObject.participants, isAdmin: isAdmin, key: key, iv: iv})

})



module.exports = router;
