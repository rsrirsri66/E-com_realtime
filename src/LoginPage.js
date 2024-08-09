import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const token = data.token;
        if (token) {
          localStorage.setItem('token', token);
          navigate('/home');
        } else {
          setError('Login failed: Token not received.');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className='login'>
      <div className="login-container">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
