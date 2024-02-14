import React, { useState, useEffect } from 'react';
import socket from '../components/socket.js';

const Home = () => {

  const token = document.cookie.split('=')[1];
  const [room, setRooms] = useState([]);
  const [groupRoom, setGroupRooms] = useState([]);
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
        setRooms(data.Room || []);
        setGroupRooms(data.groupRooms || []);
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
  
  const handleRoomClick= (room) => {
    const roomId = room._id
    window.location.href = `/${roomId}`;
  };
  
  function displayRooms(){
    if (room.lenght === 0 && groupRoom.lenght === 0 ){
      return <p> No chats available </p>
    }
    const renderedRooms = Object.keys(room).map((key) => (
    <div key={key} onClick={() => handleRoomClick(room[key])}>
      <p>{key}</p>
    </div>
    ));

    return renderedRooms;
  
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
        <h2>Home pageee</h2>
        {displayRooms()}

      </div>
    </div>
  );
};

export default Home;
  



/* 
  const handleUserClick = (user) => {
    console.log('Selected user:', user);
  };
  */

 //{room.length === 0 && groupRoom.length === 0 && (
          //<p>No chats available.</p>
        //)}

  //<div>
                ///*
        //<ul>
          //{foundUsers.map((user, index) => {
            //<li key={index} onClick={() => handleUserClick(user)}>
              //{user}
            //</li>


          //})}
        //</ul>
        //*/

      //</div>


