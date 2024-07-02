// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const defaultAdmins = [
    { username: 'Girish', password: '123' },
    { username: 'Siva Rao', password: '987' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const admin = defaultAdmins.find(
      (admin) => admin.username === username && admin.password === password
    );

    if (admin) {
      // Admin login successful
      localStorage.setItem('adminToken', 'admin_logged_in');
      navigate('/admin-dashboard'); // Redirect to admin dashboard
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-btn">Login</button>
      </form>
      <button onClick={() => navigate('/login')} className="switch-btn">
        Switch to User Login
      </button>
    </div>
  );
};

export default AdminLogin;