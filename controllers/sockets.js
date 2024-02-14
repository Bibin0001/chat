const server = require('../index');
const { Server }= require('socket.io'); 

function Socket(server){
  
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3001'
    }
  });


  io.on('connection', (socket) => {

    console.log('User connected')
  });

};

module.exports = Socket;

