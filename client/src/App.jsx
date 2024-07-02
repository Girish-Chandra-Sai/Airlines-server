import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Layout from './components/Layout';
import Home from './components/Home';
import FlightResults from './components/FlightResults.jsx';
import BookingConfirmation from './components/BookingConfirmation.js';
import Bookings from './components/Bookings.js'
import SeatSelection from './components/SeatSelection.js';
import { checkLoginStatus } from './services/auService';
import ErrorPage from './components/ErrorPage';
import FeedbackForm from './components/Feedbackform';
import './App.css';
import './styles/AuthPages.css';
import './styles/MainPages.css';
import ReviewsAndRatings from './components/Reviews&Rating.js';
import { UserProvider } from './UserContext';

// Conditionally import components
const Profile = React.lazy(() => import('./components/Profile'));
const Reviews = React.lazy(() => import('./components/Reviews'));
const Feedback = React.lazy(() => import('./components/Feedback'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const status = await checkLoginStatus();
        setIsLoggedIn(status);
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/signup"
              element={isLoggedIn ? <Navigate to="/" /> : <Signup setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path='/booking-confirmation' element={<BookingConfirmation/>}/>
            <Route path='/seat-selection' element={<SeatSelection/>}/>
            <Route path="/flight-results" element={<FlightResults />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/reviews" element={<ReviewsAndRatings />} />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/error" element={<ErrorPage />} />
            <Route element={<Layout setIsLoggedIn={setIsLoggedIn} />}>
              <Route
                path="/"
                element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={
                  isLoggedIn ? (
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <Profile />
                    </React.Suspense>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/reviews"
                element={
                  isLoggedIn ? (
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <Reviews />
                    </React.Suspense>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/feedback"
                element={
                  isLoggedIn ? (
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <Feedback />
                    </React.Suspense>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/flight-results"
                element={<FlightResults />}
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;