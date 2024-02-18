const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Room = require('../models/room')

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
          "verySecretKey",
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

}

  
module.exports = {
  BaseUser,
  UserMessaging,
};
