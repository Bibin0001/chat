import React, { useState } from 'react';

const AddUserForm = ( {onAddUsers, token} ) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [error, setError] = useState('');

  const handleAddUserToRoom = (user) => {
    if ( !(selectedUsers.includes(user))){

      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUserFromRoom = (userToRemove) => {
    const updatedUsers = selectedUsers.filter(user => user !== userToRemove);
    setSelectedUsers(updatedUsers);
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

  const handleAddUsers = () => {
    onAddUsers(selectedUsers);
    setShowModal(false);
    setSelectedUsers([]);
    setSearchUser('');
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Add Users</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Add Users</h2>
            <h3>Selected Users:</h3>
            <ul>
              {selectedUsers.map(user => (
                <li key={user}>
                  {user}
                  <button onClick={() => handleRemoveUserFromRoom(user)}>Remove</button>
                </li>
              ))}
            </ul>
            <h3>Search and Select Users:</h3>
            <input type='text' placeholder='Search for users' value={searchUser} onChange={handleSearch} />
            <ul>
              {foundUsers.map(user => (
                <li key={user}>
                  <input type="checkbox" onChange={() => handleAddUserToRoom(user)} checked={selectedUsers.includes(user)} />
                  {user}
                </li>
              ))}
            </ul>
            <button onClick={handleAddUsers}>Add Selected Users</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUserForm;

