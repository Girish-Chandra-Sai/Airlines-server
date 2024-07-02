// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './Navbar.css';

const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/signup');
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <div className="nav-left">
          <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
          <li className="nav-item"><Link to="/profile" className="nav-link">My Profile</Link></li>
          <li className="nav-item"><Link to="/reviews" className="nav-link">Reviews & Ratings</Link></li>
          <li className="nav-item"><Link to="/feedback" className="nav-link">Submit Feedback</Link></li>
        </div>
      </ul>
      <div className="nav-right">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;