const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Room = require('../models/room')
require('dotenv').config();

class BaseUser {

  constructor(username){
    this.username = username;
  }

  async register(password){
    const existingUser = await User.findOne({ username: this.username});

    if (existingUser) {
      return false 
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username: this.username,
      password: hashedPassword
    });


    await newUser.save();
    
    return true
  }

  async login(password){
    const currentUser = await User.findOne({username: this.username})
    const currentUnixTime = Math.floor(new Date().getTime() / 1000);

    if (currentUser && (bcrypt.compareSync(password, currentUser.password))) {
      const token = jwt.sign(
          {username: currentUser.username, time_created: currentUnixTime },
          process.env.SECRET_KEY,
          {
            expiresIn: "2h",
          })
      
      currentUser.token = token;
      return token
    } 

    else {
      return false
    }
    
  }
}


class UserMessaging extends BaseUser{
  constructor(username){
    super(username);
  }

  async sendMessage(message, roomId){
    const newMessage = {
      sender: this.username,
      content: message
    };

    const room = await Room.findById(roomId)
    room.messages.push(newMessage)
    room.save();

    return newMessage
  }

  async editMessage(newMessage, oldMessage, roomId){

    // There is updateOne in mongoose but for some reason doesnt work so i have to do this this way
    // I wasted 6 hours trying to make it using updateOne 
   
    const room = await Room.findById(roomId)
    const messageToUpdate = room.messages.find(messages => messages.content === oldMessage);
    messageToUpdate.content = newMessage

    await room.save()

  }

  async deleteMessage(deletedMessage, roomId){

    const room = await Room.findById(roomId)
    const indexToRemove = room.messages.findIndex(message => message.content === deletedMessage);
    room.messages.splice(indexToRemove, 1); // Remove the message from the array
    await room.save(); 

  }

}

  
module.exports = {
  BaseUser,
  UserMessaging,
};
