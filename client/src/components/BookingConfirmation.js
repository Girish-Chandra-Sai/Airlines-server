import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import './BookingConfirmation.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const BookingConfirmation = () => {
  const location = useLocation();
  console.log("BookingConfirmation: Location state", location.state);
  const { flight, seat, fromCity, toCity, email } = location.state || {};

  useEffect(() => {
    if (flight && seat && email) {
      sendConfirmationEmail();
    }
  }, [flight, seat, email]);

  const sendConfirmationEmail = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          flight, 
          seat, 
          fromCity, 
          toCity,
          reminderType: 'booking'
        }),
      });
      if (response.ok) {
        console.log('Confirmation email sent successfully');
        // Schedule reminder email
        await fetch('/api/schedule-reminder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            flight, 
            seat, 
            fromCity, 
            toCity 
          }),
        });
        console.log('Reminder email scheduled successfully');
      } else {
        console.error('Failed to send confirmation email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  if (!flight || !seat || !email) {
    return (
      <>
        <Navbar />
        <div className="booking-confirmation-container">
          <div className="booking-confirmation-box">
            <h2>Error: Booking information not available</h2>
            <Link to="/">Return to Home</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="booking-confirmation-container">
        <div className="booking-confirmation-box">
          <h2>Booking Confirmed</h2>
          <p>Email: {email}</p>
          <p>Flight: {flight.flightNumber}</p>
          <p>Seat: {seat.seatNumber}</p>
          <p>From: {fromCity || flight.startLocation}</p>
          <p>To: {toCity || flight.destinationLocation}</p>
          <p>Date: {formatDate(flight.date)}</p>
          <p>Departure: {flight.startTime}</p>
          <p>Arrival: {flight.destinationTime}</p>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmation;