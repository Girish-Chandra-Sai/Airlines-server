// components/InsertFlight.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insertFlight } from '../services/flightService';

const InsertFlight = () => {
  const [flightData, setFlightData] = useState({
    flightNumber: '',
    startLocation: '',
    destinationLocation: '',
    startTime: '',
    destinationTime: '',
    duration: '',
    price: '',
    date: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFlightData({ ...flightData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await insertFlight(flightData);
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error inserting flight:', error);
    }
  };

  return (
    <div>
      <h1>Insert New Flight</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="flightNumber"
          value={flightData.flightNumber}
          onChange={handleChange}
          placeholder="Flight Number"
          required
        />
        <input
          type="text"
          name="startLocation"
          value={flightData.startLocation}
          onChange={handleChange}
          placeholder="Start Location"
          required
        />
        <input
          type="text"
          name="destinationLocation"
          value={flightData.destinationLocation}
          onChange={handleChange}
          placeholder="Destination Location"
          required
        />
        <input
          type="text"
          name="startTime"
          value={flightData.startTime}
          onChange={handleChange}
          placeholder="Start Time"
          required
        />
        <input
          type="text"
          name="destinationTime"
          value={flightData.destinationTime}
          onChange={handleChange}
          placeholder="Destination Time"
          required
        />
        <input
          type="text"
          name="duration"
          value={flightData.duration}
          onChange={handleChange}
          placeholder="Duration"
          required
        />
        <input
          type="number"
          name="price"
          value={flightData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="date"
          name="date"
          value={flightData.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Insert Flight</button>
      </form>
    </div>
  );
};

export default InsertFlight;