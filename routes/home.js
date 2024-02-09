const express = require("express");
const router = express.Router();
const User = require('../models/user');
const requireAuth = require('../middleware/authMiddleware');
const Room = require('../models/room');
const GroupRoom = require('../models/groupRoom');
const sortRooms = require('./sortRooms.js');

router.get('/', requireAuth, async (req, res) => {
  
  const user = await User.findOne({ 'username': req.user.username} );

  const room = await Room.find({participants: user.username})

  //console.log(room);
  const formattedRooms = room.map(item => ({
    room: item.room,
    participants: item.participants.filter(participant => participant !== user.username) // Exclude the current user
  }));

  const groupRoom = await GroupRoom.find({ participants: user.username })

  const rooms = sortRooms(user, room, groupRoom)


  res.status(200).json({ Room : rooms, groupRooms : groupRoom }); //users: usersUsernames

});

router.post('/search-users',  requireAuth, async (req, res) =>{
  console.log('IN');
  //console.log(req)
  const searchUser = req.body.searchUser
  console.log(searchUser);
  users = await User.find({ username: { $regex: `^${searchUser}` }})
  
  const usersUsernames = []

  for (const currentUser in users){
    usersUsernames.push(users[currentUser].username)
    }
  
  res.status(200).json({users: usersUsernames})


});


module.exports = router;

