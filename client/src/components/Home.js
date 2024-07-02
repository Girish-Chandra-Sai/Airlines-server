import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css'; 
import './Home.css';

const Home = () => {
  const [tripType, setTripType] = useState('one-way');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState(null);
  const [travelDate, setTravelDate] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  useEffect(() => {
    const email = location.state?.email;
    setDate(getToday());
    console.log(email)
    if (email) {
      setUserEmail(email);
    }
  }, [location]);

  const handleDateChange = (selectedDate) => {
    const today = getToday();
    if (selectedDate >= today) {
      setDate(selectedDate);
      setTravelDate(selectedDate.toISOString().split('T')[0]);
    } else {
      setDate(today);
      setTravelDate(today.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date < getToday()) {
      alert("Please select today's date or a future date.");
      return;
    }
    navigate('/flights', { state: { fromCity, toCity, date } });
  };

  const handleFlightSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/flights`, {
        params: { fromCity, toCity, travelDate }
      });
      console.log('Flight data:', response.data);
      navigate('/flight-results', { 
        state: { 
          flightData: response.data, 
          fromCity, 
          toCity, 
          email: userEmail
        } 
      });
    } catch (error) {
      console.error('Error fetching flights:', error);
      navigate('/error');
    }
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1>Welcome to SkyPath{userEmail ? `, ${userEmail}` : ''}</h1>
        
        <div className="flight-booking-box">
          <h2 className="booking-title">Book Your Flight</h2>
          <form onSubmit={handleFlightSearch}>
            <div className="form-group">
              <label htmlFor="tripType">Trip Type:</label>
              <select
                id="tripType"
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                required
              >
                <option value="one-way">One Way</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="fromCity">From:</label>
              <select
                id="fromCity"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                required
              >
                <option value="">Select city</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Amaravathi">Amaravathi</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="toCity">To:</label>
              <select
                id="toCity"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                required
              >
                <option value="">Select city</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Amaravathi">Amaravathi</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="travelDate">Travel Date:</label>
              <input
                type="date"
                id="travelDate"
                value={travelDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                required
              />
            </div>
            
            <button type="submit" className="find-flights-btn">Find Flights</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;