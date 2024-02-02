const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupChatSchema = new Schema({
  admins : [{ type: String, ref: 'User', required: true }],
  participants: [{ type: String, ref: 'User', required: true }], 
  messages: [
    {
      sender: { type: String, ref: 'User', required: true }, 
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      likes: { type: Number, default: 0},
      likedBy: [{ type: String, ref: 'User' }],
    }
  ]
});


module.exports = mongoose.model('groupChat', groupChatSchema );

