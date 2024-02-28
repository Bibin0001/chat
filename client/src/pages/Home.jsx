import React, { useState, useEffect } from 'react';
import socket from '../components/socket.js';
import CreateGroupRoom from '../components/CreateGroupRoom'

const Home = () => {

  const token = document.cookie.split('=')[1];
  const [rooms, setRooms] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {

    console.log('Connecting to socket')

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

    window.location.href = `/${roomId}`;
    
  };
  
  const handleRoomClick= (roomId) => {
    window.location.href = `/${roomId}`;
  };
  
  function displayRooms(){
    console.log(rooms)
    if (rooms.lenght === 0){
      return <p> No chats available </p>
    }
    const renderedRooms = rooms.map((room) => (
    <div key={room.roomId} onClick={() => handleRoomClick(room.roomId)}>
      <p>{room.recipient}</p>
    </div>
    ));

    return renderedRooms;
  
  };

  const handleCreateRoom = (selectedUsers, roomName) => {
    console.log('Creating room with selected users:', selectedUsers);
    console.log('Room name:', roomName);
    // Here you can implement logic to create the room
  };


  return (
    <div>
      <div>
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
          <CreateGroupRoom onCreateRoom={handleCreateRoom} />

        
      </div>

      <div>
        <h2>Home pageee</h2>
        {displayRooms()}

      </div>
    </div>
  );
};

export default Home;
  
        /*<CreateGroupRoom onCreateRoom={handleCreateRoom} />*/

/*
 *
        </button>
 * */
