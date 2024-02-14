import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import socket from '../components/socket.js';

const Room = () => {
  const [roomMessages, setRoomMessages] = useState([]);

  const token = document.cookie.split('=')[1];
  const { roomId } = useParams();
  const url = `localhost:3001/${roomId}`

  useEffect(() => {

    
    // Connect to the room
    socket.emit('joinRoom', roomId);

    // Listen for incoming messages in the room
    socket.on('message', (message) => {
      setRoomMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off('message');
    };
  }, [roomId]); // Re-run effect when roomId changes

  const sendMessage = (message) => {
    // Emit message to the server
    socket.emit('sendMessage', { roomId, message });
  };

  return (
    <div>
      <h1>Room: {roomId}</h1>
      <div>
        {roomMessages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const message = e.target.elements.message.value;
        sendMessage(message);
        e.target.elements.message.value = ''; 
      }}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Room;
