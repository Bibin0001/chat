// Register.js

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../styles/register.css';

const Register = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [navigate, setNavigate] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Form validation
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    };
    if (!confirmPassword){
      setError('You need to confirm your password!')
      return;
    };
    if (password !== confirmPassword){
      setError('Your passwords need to match!')
      return;
    };
    if (password.length < 8) {
      setError('Password must be at least 8 characters long!');
      return;
    };
    
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (!response.ok) {
        setError('There is already an user with that username!');
        return;
      }

      console.log('Registration successful!');
      setNavigate(true);

    } catch (error) {
      console.error('Error during registration:', error);
    }
    console.log('Registering with:', username, password, confirmPassword);
  };

  if (navigate) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="register-container">
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
          id="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}
        <input type="submit" name="button" value="Register" className="register-button" />
      </form>
      <a href='/login' className='login-link'> Already have an account?</a>
    </div>
  );
};

export default Register;

