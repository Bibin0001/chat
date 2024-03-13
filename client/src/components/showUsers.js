import React, { useState } from 'react';
import '../styles/showUsers.css'

const UserList = ({ users, isAdmin, onKick, onLeave }) => {
  const [showUsers, setShowUsers] = useState(false);

  const handleButtonClick = () => {
    setShowUsers(!showUsers);
  };


  return (
    <div>
      <button className="leave-button"onClick={handleButtonClick}>Show Users</button>
      {showUsers && (
        <div> 
          <ul className="user-list">
            {users.map((user, index) => (
              <li key={index}>
                <span>{user}</span>
                {isAdmin && (
                  <div className="admin-functionalities">
                    <button onClick={() => onKick(user)}>Kick</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          <div>
            <button className="leave-button" onClick={() => onLeave()}>Leave</button>
          </div>
        </div> 
      )}
    </div>
  );


};

export default UserList;
