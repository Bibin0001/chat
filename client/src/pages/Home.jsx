import React, { useState, useEffect } from 'react';
import socket from '../components/socket.js';
import CreateGroupRoom from '../components/CreateGroupRoom'
import styles from '../styles/styles.module.css'
import userSearchStyles from '../styles/userSearch.module.css'
import '../styles/home.css'

const Home = () => {

  const token = document.cookie.split('=')[1];
  const [rooms, setRooms] = useState([]);
  const [groupRooms, setGroupRooms] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {


    socket.connect();

    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {


    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        setRooms(data.rooms)
        setGroupRooms(data.groupRooms)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]); // Run the effect whenever token changes

  const handleSearch = async (event) => {
    const searchValue = event.target.value;
    setSearchUser(searchValue);

    try {
      const response = await fetch('http://localhost:5000/search-users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchUser: searchValue,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      setFoundUsers(data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleUserClick = async (user) => {
    console.log('Selected user:', user);
    const response = await fetch('http://localhost:5000/room/check-or-create-room', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: user,
      }),
      credentials: 'include',
    });


    const data = await response.json();
    const roomId = data.roomId;

    window.location.href = `room/${roomId}`;
    
  };
  
  const handleRoomClick= (roomId) => {
    window.location.href = `room/${roomId}`;
  };
  
  function displayRooms(){
    if (rooms.lenght === 0){
      return <p> No chats available </p>
    }
    const renderedRooms = rooms.map((room) => (
    <div  className="chat-box" key={room.roomId} onClick={() => handleRoomClick(room.roomId)}>
      <p >{room.recipient}</p>
    </div>
    ));

    return renderedRooms;
  
  };

  const handleGroupRoomClick = (groupRoomId) => {
    window.location.href = `group-room/${groupRoomId}`
  };

  function displayGroupRooms(){
    if (groupRooms.lenght === 0 ){
      return <p> No group chats available </p>
    }

    const renderedRooms = groupRooms.map((groupRoom) => (
      <div className='chat-box' key={groupRoom.roomId} onClick={() => handleGroupRoomClick(groupRoom.roomId)}>
        <p>{groupRoom.roomName}</p>

      </div>
    ));

    return renderedRooms

  }

  const handleCreateGroupRoom = async (selectedUsers, roomName) => {
    const response = await fetch('http://localhost:5000/group-room/create-group-room', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participants: selectedUsers,
        roomName: roomName,
      }),
        credentials: 'include',
      });

    const data = await response.json();
    const groupRoomId = data.roomId
    window.location.href = `group-room/${groupRoomId}`

  };


  return (
    <div className="container">

      <div className="user-search-container">
        <input
          type='text'
          placeholder='Search for other users'
          value={searchUser}
          onChange={handleSearch}
        />
        <ul>
          {foundUsers.map((user, index) => (
            <li key={index} onClick={() => handleUserClick(user)}>
              <p>{user}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <CreateGroupRoom  className="create-group-room" onCreateRoom={handleCreateGroupRoom} />
        
      </div>

      <div className="section">
        <h2 className="section-heading">Group Chats</h2>
        {displayGroupRooms()}

      </div>

      <div>
        <h2 className="section-heading">Direct Messages</h2>
        {displayRooms()}

      </div>
    </div>
  );
};

export default Home;
  

