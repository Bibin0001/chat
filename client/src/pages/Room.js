import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import socket from '../components/socket.js';
import './room.css'

const Room = () => {
  const token = document.cookie.split('=')[1];
  const { roomId } = useParams();
  const [clientUser, setClientUsername] = useState('')
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
      setClientUsername(data.clientUsername)
      setRoomMessages(data.messages)

      if (!socket.connected) {
        socket.connect()
        socket.on('connect', () => {
          socket.emit('joinRoom', roomId, data.clientUsername);
          socket.on('newMessage', (message) => {
            setRoomMessages(prevMessages => [...prevMessages, message]);
            });
        });
      }
      return () => {
        socket.disconnect();
      };
    };
    fetchData()
    
  },[]);


  function displayMessages() {
    console.log(roomMessages)
    if (roomMessages) {

// Posle za laik4eta :P
      return roomMessages.map((msg, index ) => (
        

        <div
          key={index}
          className={msg.sender === clientUser ? "my-message" : "other-user-message" }
        >
          <span>{msg.sender}: </span>
          {msg.content}
        </div>
      ));
        
          }
  }
  const handleSentMessage = (event) =>{
    console.log(messageInput)
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

