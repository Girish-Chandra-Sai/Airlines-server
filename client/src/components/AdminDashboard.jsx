// components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFlights, deleteFlight } from '../services/flightService';

const AdminDashboard = () => {
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const data = await getFlights();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFlight(id);
      fetchFlights();
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Link to="/insert-flight">Insert New Flight</Link>
      <button onClick={handleLogout}>Logout</button>
      <table>
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Start Location</th>
            <th>Destination</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight._id}>
              <td>{flight.flightNumber}</td>
              <td>{flight.startLocation}</td>
              <td>{flight.destinationLocation}</td>
              <td>
                <Link to={`/edit-flight/${flight._id}`}>Edit</Link>
                <button onClick={() => handleDelete(flight._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;