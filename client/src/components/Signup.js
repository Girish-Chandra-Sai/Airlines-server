import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auService';
import './Signup.css';

const Signup = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();

  const { username, name, email, password, phoneNumber } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      localStorage.setItem('token', response.token);
      setIsLoggedIn(true);
      navigate('/'); // Redirect to home page
    } catch (err) {
      alert('Error registering user');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1 className="company-name">Skypath Airlines</h1>
        <p className="tagline">Elevating your travel experience</p>
        <h2 className="form-title">Sign Up</h2>
        <form onSubmit={onSubmit}>
          <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
          <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
          <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
          <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
          <input type="text" name="phoneNumber" value={phoneNumber} onChange={onChange} placeholder="Phone Number" required />
          <button type="submit">Sign Up</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;