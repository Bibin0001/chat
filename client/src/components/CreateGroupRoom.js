import React, { useState } from 'react';
import styles from '../styles/styles.module.css'
import '../styles/createGroupRoom.css'

const CreateGroupRoom = ({ onCreateRoom, token }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [error, setError] = useState('');

  const handleCreateRoom = () => {
    // Check if room name is empty
    if (!roomName.trim()) {
      setError('Please enter a room name');
      return;
    }

    // Pass the selected users and room name to the parent component
    onCreateRoom(selectedUsers, roomName);
    // Reset state for next use
    setSelectedUsers([]);
    setRoomName('');
    setShowModal(false);
    setError('');
  };

  const handleAddUserToRoom = (user) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleRemoveUserFromRoom = (userToRemove) => {
    const updatedUsers = selectedUsers.filter(user => user !== userToRemove);
    setSelectedUsers(updatedUsers);
  };

  const handleInputChange = (e) => {
    setRoomName(e.target.value);
    setError(''); // Clear error when the user types in the room name field
  };

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

  const users = ['User1', 'User2', 'User3', 'User4']; // List of available users

  return (
    <div>
      <button className={styles.button} onClick={() => setShowModal(true)}>Create Group Room</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Create Room</h2>
            <input type="text" placeholder="Room Name" value={roomName} onChange={handleInputChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if room name is empty */}
            <h3>Selected Users:</h3>
            <ul>
              {selectedUsers.map(user => (
                <li key={user}>
                  {user}
                  <button onClick={() => handleRemoveUserFromRoom(user)}>Remove</button>
                </li>
              ))}
            </ul>
            <h3>Select Users:</h3>
            <input type='text' placeholder='Search for other users' value={searchUser} onChange={handleSearch} />
            <ul>
              {foundUsers.map(user => (
                <li key={user}>
                  <input type="checkbox" onChange={() => handleAddUserToRoom(user)} checked={selectedUsers.includes(user)} />
                  {user}
                </li>
              ))}
            </ul>
            <button onClick={handleCreateRoom}>Create Room</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroupRoom;

