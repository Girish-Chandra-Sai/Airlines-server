import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Make sure to import your CSS file

function Profile() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [showBookings, setShowBookings] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://airlines-server-ux71.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response ? err.response.data.error : 'An error occurred');
      }
    };

    fetchProfile();
  }, []);

  const toggleBookings = async () => {
    if (showBookings) {
      setShowBookings(false);
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://airlines-server-ux71.onrender.com/api/profile/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
        setShowBookings(true);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.response ? err.response.data.error : 'An error occurred fetching bookings');
      }
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Hi, {profile.username}</h1>
      <p>Email: {profile.email}</p>
      
      <button onClick={toggleBookings} className="button">View Bookings</button>

      {showBookings && (
        <div className="bookings-container">
          <h2>Your Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking, index) => (
                <div key={index} className="booking-box">
                  <p>Seat Number: {booking.seatNumber}</p>
                  <p>Travelling Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
