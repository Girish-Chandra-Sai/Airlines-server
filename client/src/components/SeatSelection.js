import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SeatSelection.css';
import Navbar from './Navbar.jsx';

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const { flight, fromCity, toCity } = location.state || {};

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://airlines-server.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(response.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setErrorMessage(err.response ? err.response.data.error : 'An error occurred while fetching user profile');
    }
  }, []);

  const fetchSeats = useCallback(async (flightNumber) => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://airlines-server.onrender.com/api/flights/${flightNumber}/seats`);
      console.log('Fetched seats:', response.data);
      setSeats(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching seats:', error);
      setErrorMessage(`Failed to fetch seats: ${error.message}`);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    if (flight && flight.flightNumber) {
      fetchSeats(flight.flightNumber);
    } else {
      setErrorMessage('Flight information is missing. Please go back and select a flight.');
      setIsLoading(false);
    }
  }, [flight, fetchSeats, fetchUserProfile]);

  const handleSeatSelect = (seat) => {
    if (!seat.isBooked) {
      setSelectedSeat(seat);
    }
  };

  const handleConfirmSeat = async () => {
    if (selectedSeat && userProfile) {
      try {
        const response = await axios.post('https://airlines-server.onrender.com/api/bookings', {
          flightNumber: flight.flightNumber,
          seatNumber: selectedSeat.seatNumber,
          email: userProfile.email
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data && response.data.success) {
          navigate('/booking-confirmation', {
            state: {
              flight: flight,
              seat: selectedSeat,
              bookingDetails: response.data.booking,
              email: userProfile.email,
              fromCity,
              toCity
            }
          });
        } else {
          throw new Error(response.data.message || 'Booking failed. Please try again.');
        }
      } catch (error) {
        console.error('Error booking seat:', error);
        setErrorMessage(`Failed to book seat: ${error.message}`);
      }
    } else if (!userProfile) {
      setErrorMessage('User information not available. Please try logging in again.');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading seats...</div>;
  }

  if (errorMessage) {
    return (
      <div className="error-message">
        <p>{errorMessage}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div className="seat-selection-container">
      <h2>Select a Seat for Flight {flight?.flightNumber}</h2>
      <div className="seat-grid">
        {seats.map((seat) => (
          <button
            key={seat.seatNumber}
            className={`seat ${seat.isBooked ? 'booked' : ''} ${selectedSeat?.seatNumber === seat.seatNumber ? 'selected' : ''}`}
            onClick={() => handleSeatSelect(seat)}
            disabled={seat.isBooked}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
      {selectedSeat && !selectedSeat.isBooked && (
        <div className="booking-controls">
          <p>Selected Seat: {selectedSeat.seatNumber}</p>
          <button onClick={handleConfirmSeat}>Confirm Booking</button>
        </div>
      )}
    </div>
    </div>
   
  );
};

export default SeatSelection;
