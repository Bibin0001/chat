import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
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
          setError('Wrong username or password!');
          return;
        }
      
      const data = await response.json()

      if (data.success) {
        document.cookie = `token=${data.loginUser}; `;
        window.location.href = '/';

      }


    } catch (error) {
      console.error('Error during logging:', error);
      };

  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="button" onClick={handleSubmit}>
          Login
        </button>
      </form>
      <a href='register/'> Don't have an account?</a>
    </div>
  );
};

export default Login;

