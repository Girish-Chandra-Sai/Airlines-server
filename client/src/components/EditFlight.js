// components/EditFlight.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFlightById, updateFlight } from '../services/flightService';

const EditFlight = () => {
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

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlight();
  }, []);

  const fetchFlight = async () => {
    try {
      const data = await getFlightById(id);
      setFlightData(data);
    } catch (error) {
      console.error('Error fetching flight:', error);
    }
  };

  const handleChange = (e) => {
    setFlightData({ ...flightData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFlight(id, flightData);
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error updating flight:', error);
    }
  };

  return (
    <div>
      <h1>Edit Flight</h1>
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
        <button type="submit">Update Flight</button>
      </form>
    </div>
  );
};

export default EditFlight;