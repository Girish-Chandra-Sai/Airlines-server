// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { flightNumber, seatNumber } = req.body;

    // Book for the logged-in user from the token, never an email sent in the body.
    // Look them up first, so a missing user never leaves a seat reserved
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Book the seat atomically: the "is it free?" check and the write happen in one
    // MongoDB operation, so two simultaneous requests can't both book the same seat
    const flight = await Flight.findOneAndUpdate(
      { flightNumber, seats: { $elemMatch: { seatNumber, isBooked: false } } },
      { $set: { 'seats.$.isBooked': true, 'seats.$.userId': user._id } },
      { new: true }
    );

    if (!flight) {
      // Nothing matched: work out why, to return the right error
      const existing = await Flight.findOne({ flightNumber });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Flight not found' });
      }
      if (!existing.seats.some(s => s.seatNumber === seatNumber)) {
        return res.status(404).json({ success: false, message: 'Seat not found' });
      }
      return res.status(409).json({ success: false, message: 'Seat is already booked' });
    }

    // Update user's bookings; if that fails, release the seat we just reserved
    try {
      await User.updateOne(
        { _id: user._id },
        {
          $push: {
            bookings: {
              flightNumber: flight.flightNumber,
              seatNumber: seatNumber,
              bookingDate: new Date()
            }
          }
        }
      );
    } catch (error) {
      await Flight.updateOne(
        { _id: flight._id, seats: { $elemMatch: { seatNumber, userId: user._id } } },
        { $set: { 'seats.$.isBooked': false, 'seats.$.userId': null } }
      );
      throw error;
    }

    res.json({ 
      success: true, 
      message: 'Booking successful', 
      booking: { 
        flightNumber, 
        seatNumber, 
        email: user.email,
        userId: user._id
      } 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
});

module.exports = router;