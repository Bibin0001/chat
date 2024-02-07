const User = require('../models/user');
const Room = require('../models/room')
const bcrypt = require('bcryptjs');

class RoomClass{
  constructor(clientUser, recipient){
    this.clientUser = clientUser;
    this.recipient= recipient;

  }

  async createRoom(){
    const newRoom = new Room({ participants: [this.clientUser, this.recipient] });
    await newRoom.save();

    return true

  }

}
  
module.exports = {
  RoomClass,
};
