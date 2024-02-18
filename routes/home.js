const express = require("express");
const router = express.Router();
const User = require('../models/user');
const requireAuth = require('../middleware/authMiddleware');
const Room = require('../models/room');
const GroupRoom = require('../models/groupRoom');
const sortRooms = require('./sortRooms.js');
const { RoomClass } = require('../controllers/roomClass.js')

router.get('/', requireAuth, async (req, res) => {
  
  const user = req.user.username

  const rooms = await Room.find({ participants: { "$in" : [user]} }) 
  //console.log(room)

  const roomController= new RoomClass(user)
  const sortedRooms = roomController.sortRoomsByLatestMessage(rooms)
  console.log(sortedRooms)


  const groupRoom = await GroupRoom.find({ participants: user.username })

  //const rooms = sortRooms(user, room, groupRoom)

  //console.log(rooms)
  //console.log(groupRoom)



  res.status(200).json({ rooms : sortedRooms }); //users: usersUsernames


});

router.post('/search-users',  requireAuth, async (req, res) =>{
  //console.log(req)
  const searchUser = req.body.searchUser
  users = await User.find({ username: { $regex: `^${searchUser}` }})
  
  const usersUsernames = []

  for (const currentUser in users){
    usersUsernames.push(users[currentUser].username)
    }
  
  res.status(200).json({users: usersUsernames})


});


module.exports = router;

