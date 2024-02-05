import React, { useState, useEffect } from 'react';

const Home = () => {

  const token = document.cookie.split('=')[1]
  const [regularChats, setRegularChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);

  const fetchData = async() => {
    //console.log(token);
    const response = await fetch('http://localhost:5000/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        credentials: 'include',
        });

    const data = await response.json()

    setRegularChats(data.regular_chats);
    setGroupChats(data.group_chats);


  }
  fetchData();
     
  

  return (
    <div>
      <h2>Home pageee</h2>

      {regularChats.length === 0 && groupChats.length === 0 && (
        <p>No chats available.</p>
      )}
    </div>
  );
};

export default Home;

/*
  return (
    <div>
      <h2>Home pageee</h2>
      
      {regularChats.length === 0 && groupChats.length === 0 ? (
        <p>No chats available.</p>
      )}
        
    </div>
  );
};
*/
