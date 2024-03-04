const express = require("express");
const router = express.Router();
const User = require('../models/user');
const requireAuth = require('../middleware/authMiddleware');
const Room = require('../models/room');
const GroupRoom = require('../models/groupRoom');
const sortRooms = require('./sortRooms.js');
const { RoomClass } = require('../controllers/roomClass.js')
const { GroupRoomClass } = require('../controllers/roomClass.js')

router.get('/', requireAuth, async (req, res) => {
  
  const user = req.user.username
  const rooms = await Room.find({ participants: { "$in" : [user]} }) 

  const roomController= new RoomClass(user)
  const sortedRooms = roomController.sortRoomsByLatestMessage(rooms)

  const groupRooms = await GroupRoom.find({ participants: { "$in": [user]}})

  const groupRoomController = new GroupRoomClass(user)
  const sortedGroupRooms = groupRoomController.sortRoomsByLatestMessage(groupRooms)
  console.log(sortedGroupRooms)

  res.status(200).json({ rooms : sortedRooms, groupRooms : sortedGroupRooms }); 

});

router.post('/search-users',  requireAuth, async (req, res) =>{

  const searchUser = req.body.searchUser
  users = await User.find({ username: { $regex: `^${searchUser}` }})
  
  const usersUsernames = []

  for (const currentUser in users){
    usersUsernames.push(users[currentUser].username)
    }
  
  res.status(200).json({users: usersUsernames})

});


module.exports = router;

