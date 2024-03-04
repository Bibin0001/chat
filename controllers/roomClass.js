const User = require('../models/user');
const Room = require('../models/room')
const bcrypt = require('bcryptjs');
const GroupRoom = require('../models/groupRoom')


class RoomClass{
  constructor(clientUser, recipient = 'Meow'){
    this.clientUser = clientUser;

  }

  async createRoom(recipient){
    const newRoom = new Room({ participants: [this.clientUser, recipient] });
    await newRoom.save();

    return newRoom.id
  }

  getMessages(room){
    const orderedMessages = []

    for (const messageIndex in room.messages){
      const message = room.messages[messageIndex]

      orderedMessages.push({
        sender: message.sender,
        content: message.content,
        roomId: room._id.toString()
      })
    }



    return orderedMessages
    

  }

  sortRoomsByLatestMessage(rooms){

    const roomsData = []

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

        roomsData.push(roomData)
      }
    };

    const sortedRooms = roomsData.sort((a, b) => {
      const dateA = a.lastMessage
      const dateB = b.lastMessage

      return dateB - dateA
    });

    return sortedRooms

  }

}

class GroupRoomClass extends RoomClass{

  constructor(clientUser){
    super(clientUser);
  }

  async createGroupRoom(groupName, participants){
    participants.push(this.clientUser)


    const newGroupRoom = new GroupRoom({
      admins: [this.clientUser],
      participants: participants,
      name: groupName,
      messages: [] 
    });

    newGroupRoom.save()

    return newGroupRoom._id

  }

  getMessages(room){
    const orderedMessages = []

    for (const messageIndex in room.messages){
      const message = room.messages[messageIndex]

      orderedMessages.push({
        sender: message.sender,
        content: message.content,
        roomId: room._id.toString()
      })
    }

    return orderedMessages

  }

  sortRoomsByLatestMessage(rooms){

    const roomsData = []

    for (const roomIndex in rooms){
      const room = rooms[roomIndex]

      if (room.messages.length > 0) {
        const lastMessageIndex = room.messages.length - 1
        const lastMessage = room.messages[lastMessageIndex]

        const roomData = {
          lastMessage: lastMessage.timestamp,
          roomName: room.name,
          roomId: room._id.toString()
        }

        roomsData.push(roomData)
      } else{
        const roomData = {
          lastMessage: 0,
          roomName: room.name,
          roomId: room._id.toString()
        }
        roomsData.push(roomData)
      }

    };

    const sortedRooms = roomsData.sort((a, b) => {
      const dateA = a.lastMessage
      const dateB = b.lastMessage

      return dateB - dateA
    });

    return sortedRooms

  }

}
  
module.exports = {
  RoomClass,
  GroupRoomClass
};
