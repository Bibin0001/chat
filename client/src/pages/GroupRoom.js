import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import socket from '../components/socket';
import '../styles/room.css'
import Message from '../components/Message'
import UserList from '../components/showUsers'
import AddUserForm from '../components/AddUsers'
import { Encrypt, Decrypt  } from '../context/Encryption.js'

const GroupRoom = () => {
  const token = document.cookie.split('=')[1];
  const { groupRoomId } = useParams();
  const [clientUser, setClientUsername] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);
  const [encryptedMessages, setEncryptedMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [key, setKey] = useState('');
  const [iv , setIv] = useState('');

  useEffect(() =>{
    const fetchData = async() => {
      

      const response = await fetch(`http://localhost:5000/group-room/${groupRoomId}`, {
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
      setParticipants(data.participants)
      setIsAdmin(data.isAdmin)
      const encryptedMessages = (data.messages)
      const decryptedMessages = []
      setEncryptedMessages(encryptedMessages)
      for (const messageIndex in encryptedMessages){
        const messageObject = encryptedMessages[messageIndex]
        const encryptedMessage = encryptedMessages[messageIndex].content
        const decryptedMessage = Decrypt (encryptedMessage, data.key, data.iv)
        const obj = {
          sender: messageObject.sender,
          content: decryptedMessage,
        }

        decryptedMessages.push(obj)

      }
      setRoomMessages(decryptedMessages)

      setKey(data.key)
      setIv(data.iv)



      if (!socket.connected) {
        socket.connect()
        socket.on('connect', () => {
          socket.emit('joinRoom', groupRoomId, data.clientUsername, true);

          socket.on('newMessage', (encryptedMessage) => {
            encryptedMessages.push(encryptedMessage)
            const decryptedMessage = {
              sender: encryptedMessage.sender,
              content: Decrypt (encryptedMessage.content , data.key, data.iv),
            }

            setRoomMessages(prevMessages => [...prevMessages, decryptedMessage]);
            });

          socket.on('editedMessage', (newMessage, oldMessageId) =>{
            const decryptedNewMessage = Decrypt (newMessage, data.key, data.iv)
            setRoomMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              updatedMessages[oldMessageId] = { ...updatedMessages[oldMessageId], content: decryptedNewMessage};
              return updatedMessages;
            })
          })
          socket.on('deletedMessage', (deletedMessageId) =>{
            setRoomMessages(prevMessages => {
                  return prevMessages.filter((message, index) => index !== deletedMessageId);
              });
          })

          socket.on('kickedUser', (username) => {
            setParticipants(prevParticipants => prevParticipants.filter(user => user !== username));
          })

          socket.on('addedUser', (newUsers) => {
            setParticipants(newUsers)
          })

        });
      }
      return () => {
        socket.disconnect();
      };
    };
    fetchData()
    
  },[]);

  
  function handleEditMessage(id, editedMessage)  {
    let oldMessage = ''
      if (encryptedMessages[id - 1] == undefined){
        oldMessage = encryptedMessages[id].content
      } else{
        oldMessage = encryptedMessages[id - 1].content
      }
    const encryptedNewMessage = Encrypt(editedMessage, key, iv) 

    socket.emit('editMessage', encryptedNewMessage, oldMessage, id)
  };

  function handleDeleteMessage(id, deletedMessage){
    console.log(deletedMessage)

    socket.emit('deleteMessage', deletedMessage, id)

  }

  
  

  function displayMessages() {
    if (roomMessages) {
      return roomMessages.map((msg, index) => (
        <Message
          id={index}
          text={msg.content}
          sender={msg.sender}
          isCurrentUser={msg.sender === clientUser} onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}

        />
      ));
    }
  }

  const handleSentMessage = (event) =>{
    const encryptedMessage = Encrypt(messageInput, key, iv)

    socket.emit('sendMessage', encryptedMessage)
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

  const handleKickedUser = (username) => {
    socket.emit('kickUser', username);

    if (username === clientUser){

      window.location.href = '/';
    }
  }

  const handleLeaving = () => {
    socket.emit('kickUser', clientUser);
    window.location.href = '/';
  }

  const handleAddUsers = (users) => {
    socket.emit('addUsers', users)
    //console.log(`Added users ${users}`)
  }


  return (
    <div>
      <div>
      <AddUserForm onAddUsers={handleAddUsers} token={token} />
      </div>

      <div className="users-container">
        <UserList
          users={participants}
          isAdmin={isAdmin}
          onKick={handleKickedUser} 
          onLeave={handleLeaving}
        />
      </div>

      <div>
        {displayMessages()}
      </div>
      <div className="input-container">
        {displayInput()}
      </div>
    </div>
  )

};


export default GroupRoom

