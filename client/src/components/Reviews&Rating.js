import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reviews&Rating.css';
import Navbar from './Navbar.jsx';

const ReviewsAndRatings = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('https://airlines-server.onrender.com/api/feedback');
      setFeedbacks(response.data.feedbacks);
      setOverallRating(response.data.overallStats.overallRating);
      setTotalReviews(response.data.overallStats.totalReviews);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  return (
    <div>
        <Navbar/>
        <div className="reviews-and-ratings">
      <h2>Reviews & Ratings</h2>
      <div className="overall-stats">
        <p>Overall Rating: {overallRating} / 5</p>
        <p>Total Reviews: {totalReviews}</p>
      </div>
      <div className="feedback-list">
        {feedbacks.map((feedback, index) => (
          <div key={index} className="feedback-box">
            <h3>Flight ID: {feedback.flightNumber}</h3>
            <p className="stars">{renderStars(feedback.rating)}</p>
            <p className="review">{feedback.review}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
    
  );
};

export default ReviewsAndRatings;
