import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import socket from '../components/socket.js';
import './room.css'

const Room = () => {
  const token = document.cookie.split('=')[1];
  const { roomId } = useParams();
  let clientUser = ''

  const [roomMessages, setRoomMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  useEffect(() =>{
    const fetchData = async() => {
      const response = await fetch(`http://localhost:5000/room/${roomId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          })

      const data = await response.json()
      console.log(data)
      console.log(clientUser)
      clientUser = data.username

      if (!socket.connected) {
          socket.connect();
        }
      if (!socket.hasListeners('joinRoom')) {
        socket.on('connect', () => {
          socket.emit('joinRoom', roomId, clientUser);
        });
      }
      socket.on('newMessage', (message) => {
        setRoomMessages(prevMessages => [...prevMessages, message]);
      });
    }

    fetchData()
    return () => {
      socket.disconnect();
    };

  }, []);

  function displayMessages(){
    if (roomMessages){
      console.log('messages')
    };
  }
  const handleSentMessage = (event) =>{
    socket.emit('sendMessage', messageInput)
    setMessageInput('')
  }

  function displayInput(){
    const input = 
      <>
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button className="send-button" onClick={handleSentMessage}>
          Send
        </button>
      </>

    return input
  }

  return (
    <div>
      <div>
        {displayMessages()}
      </div>

      <div className="input-container">
        {displayInput()}
      </div>
    </div>
  )

};


export default Room

