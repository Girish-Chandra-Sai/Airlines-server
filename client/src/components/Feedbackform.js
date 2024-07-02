import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackForm.css';
import Navbar from './Navbar.jsx';

const FeedbackForm = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hover, setHover] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/feedback/submit', {
        flightNumber,
        rating,
        review,
      });
      alert('Feedback submitted successfully');
      setFlightNumber('');
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="feedback-form">
        <h2 style={{ color: 'white' }}>Submit Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="flightNumber" style={{ color: 'white' }}>
              Flight Number:
            </label>
            <input
              type="text"
              id="flightNumber"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              required
              placeholder="Enter flight number"
              style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'white' }}>Rating:</label>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={index <= (hover || rating)? "on" : "off"}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <span className="star" style={{ fontSize: 24, cursor: 'pointer' }}>
                      {index <= (hover || rating)? '\u2605' : '\u2606'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="review" style={{ color: 'white' }}>
              Review:
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              placeholder="Enter your review"
              style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#007bff', color: 'white' }}>
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;