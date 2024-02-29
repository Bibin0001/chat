const server = require('../index');
const { Server }= require('socket.io'); 
const User = require('../models/user');
const { UserMessaging } = require('../controllers/userClass')
const Room = require('../models/room')
const cors = require('cors');


class Socket{

  constructor(server){
    this.server = server;
    this.user = null
    this.io = null
  };


  async setUser(user){
    this.user = user
  }

  startSocket(){
    this.initializeSocket();
    this.handleConnections();
  }

  initializeSocket(){
    const io = new Server(this.server, {
        cors: {
          origin: 'http://localhost:3000'
        }
      });
    this.io = io
  };

  handleConnections(){
    this.io.on('connection', (socket) =>{
      console.log('User connected')
      this.handleDisconnection(socket);
      this.handleRooms(socket);
    })

  }

  handleDisconnection(socket){
    this.io.on('disconnect', () =>{
      
      console.log('User disconnected')
    })
  }

  handleRooms(socket){
    socket.on('joinRoom', async (roomId, username, groupRoom = false) => {

      socket.join(roomId)
      const user = new UserMessaging(username)
      console.log('User connected to room')

      socket.on('sendMessage', async (msg) => {
        const messageObject = await user.sendMessage(msg, roomId, groupRoom)
        socket.to(roomId).emit('newMessage', messageObject)
        socket.emit('newMessage', messageObject)
      })

      socket.on('editMessage', async(editedMessage, oldMessage, messageIdInReact) => {
        console.log(editedMessage)
        console.log(oldMessage)
        const editMessage = await user.editMessage(editedMessage, oldMessage, roomId, groupRoom)
        socket.to(roomId).emit('editedMessage', editedMessage, messageIdInReact)
        socket.emit('editedMessage', editedMessage, messageIdInReact)
      })

      socket.on('deleteMessage', async(message , messageIdInReact) => {

        const deleteMessage = await user.deleteMessage(message, roomId, groupRoom)
        socket.to(roomId).emit('deletedMessage', messageIdInReact)
        socket.emit('deletedMessage', messageIdInReact)

      })

    });
    
  }

}
module.exports = Socket;

