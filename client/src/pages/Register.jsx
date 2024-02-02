// Register.js

import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle register logic here
    console.log('Registering with:', username, password, confirmPassword);
  };

  return (
    <div id="container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="username-field">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password-field">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirm-password-field">Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirm"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <input type="submit" name="button" value="Register" id="input" />
      </form>
    </div>
  );
};

export default Register;

