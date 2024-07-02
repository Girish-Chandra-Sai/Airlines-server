// src/components/FlightList.js
import React from 'react';

const FlightList = ({ flights, onDeleteFlight, onSelectFlight }) => {
  return (
    <div>
      <h2>Flight List</h2>
      <ul>
        {flights.map((flight) => (
          <li key={flight._id}>
            {flight.flightNumber} - {flight.startLocation} to {flight.destinationLocation}
            <button onClick={() => onDeleteFlight(flight._id)}>Delete</button>
            <button onClick={() => onSelectFlight(flight)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightList;