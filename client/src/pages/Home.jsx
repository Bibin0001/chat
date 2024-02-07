import React, { useState, useEffect } from 'react';

const Home = () => {
  const token = document.cookie.split('=')[1];
  const [room, setRooms] = useState([]);
  const [groupRoom, setGroupRooms] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);

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
        setRooms(data.room || []);
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
            <li key={index}>
              <p>{user}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Home pageee</h2>

        {room.length === 0 && groupRoom.length === 0 && (
          <p>No chats available.</p>
        )}
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


