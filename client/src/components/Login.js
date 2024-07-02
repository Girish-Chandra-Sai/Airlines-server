import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/auService';
import { useUser } from '../UserContext';
import './Login.css';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Attempting login with:', { email, password });

    try {
      const response = await loginUser({ email, password });
      console.log('Login response:', response);
      if (response.isLoggedIn) {
        setIsLoggedIn(true);
        localStorage.setItem('token', response.token);
        setUser({ email });
        navigate('/');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.msg || 'An error occurred during login');
    }
  };

  return (
    <div className="auth-container">
      <div className="login-content">
        <h1>Skypath Airlines</h1>
        <p className="tagline">Elevating your travel experience</p>
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
          </form>
          <div className="signup-option">
            <p>New to Skypath?</p>
            <Link to="/signup" className="signup-link">Sign up here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;