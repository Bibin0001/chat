import React, { useState } from 'react';

const CreateGroupRoom = ({ onCreateRoom }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = () => {
    // Pass the selected users and room name to the parent component
    onCreateRoom(selectedUsers, roomName);
    // Reset state for next use
    setSelectedUsers([]);
    setRoomName('');
    setShowModal(false);
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
  };

  const users = ['User1', 'User2', 'User3', 'User4']; // List of available users

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Create Group Room</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Create Room</h2>
            <input type="text" placeholder="Room Name" value={roomName} onChange={handleInputChange} />
            <h3>Select Users:</h3>
            <ul>
              {users.map(user => (
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

