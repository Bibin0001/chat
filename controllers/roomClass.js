const User = require('../models/user');
const Room = require('../models/room')
const bcrypt = require('bcryptjs');

class RoomClass{
  constructor(clientUser, recipient = 'Meow'){
    this.clientUser = clientUser;
    this.recipient= recipient;

  }

  async createRoom(){
    const newRoom = new Room({ participants: [this.clientUser, this.recipient] });
    await newRoom.save();

    return newRoom.id
  }

  getMessages(room){
    const orderedMessages = []

    for (const messageIndex in room.messages){
      const message = room.messages[messageIndex]

      orderedMessages.push({
        sender: message.sender,
        content: message.content
      })
    }

    return orderedMessages
    

  }

  sortRoomsByLatestMessage(rooms){

    const sortedRooms = []
    for (const roomIndex in rooms){

      const room = rooms[roomIndex]

      const clientUserIndex = room.participants.indexOf(this.clientUser)
      const recipient = clientUserIndex === 0 ? room.participants[1] : room.participants[0];
      if (room.messages.length > 0) {
        const lastMessageIndex = room.messages.length - 1
        const lastMessage = room.messages[lastMessageIndex]

        const roomData = {
          lastMessage: lastMessage.timestamp,
          recipient: recipient,
          roomId: room._id.toString()
        }

        sortedRooms.push(roomData)
      }
    };
    //console.log(sortedRooms)
    return sortedRooms


  }

}
  
module.exports = {
  RoomClass,
};
