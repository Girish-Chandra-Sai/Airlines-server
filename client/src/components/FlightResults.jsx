import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FlightResults.css';
import Navbar from './Navbar.jsx';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightData, fromCity, toCity, email } = location.state;

  const handleFlightSelect = (flight) => {
    navigate('/seat-selection', {
      state: {
        flight,
        email,
        fromCity,
        toCity
      }
    });
  };

  return (
    <div>
      <Navbar/>
      <div className="flight-results-container">
        <div className="flight-results">
          <h2 className="flight-route-header">Flights from {fromCity} to {toCity}</h2>
          {flightData.map((flight) => (
            <div key={flight.flightNumber} className="flight-card">
              <h3>Flight {flight.flightNumber}</h3>
              <p>Departure: {flight.startTime}</p>
              <p>Arrival: {flight.destinationTime}</p>
              <p>Duration: {flight.duration}</p>
              <p>Price: &#8377; {flight.price}</p>
              <p>Date: {new Date(flight.date).toLocaleDateString()}</p>
              <button onClick={() => handleFlightSelect(flight)}>Select Seats</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightResults;