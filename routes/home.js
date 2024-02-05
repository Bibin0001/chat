const express = require("express");
const router = express.Router();
const User = require('../models/user');
const requireAuth = require('../middleware/authMiddleware');
const Chat = require('../models/chat.js')
const GroupChat = require('../models/groupChat.js')

router.get('/', requireAuth, async (req, res) => {
  
  const user = await User.findOne({ 'username': req.user.username} );

  const regularChats = await Chat.find({ participants: user.username })

  const groupChats = await GroupChat.find({ participants: user.username })
  res.status(200).json({ regular_chats: regularChats, group_chats: groupChats });

});


module.exports = router;

