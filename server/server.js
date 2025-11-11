const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const feedbackRoutes = require('./routes/feedback');
const flights = require('./routes/flights');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profile.js');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
require('dotenv').config();

const app = express();

/* ✅ FIXED: CORS configuration for Render */
const allowedOrigins = [
  "https://skypath-airlines.onrender.com", // your frontend Render URL
  "http://localhost:3000"                  // for local development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use('/api/feedback', feedbackRoutes);

/* ✅ MongoDB connection */
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

/* ✅ Email setup */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ✅ Flight reminder email */
app.post('/api/schedule-reminder', async (req, res) => {
  const { email, flight, seat, fromCity, toCity } = req.body;
  const reminderDate = new Date(flight.date);
  reminderDate.setHours(reminderDate.getHours() - 6);

  schedule.scheduleJob(reminderDate, async function() {
    const mailOptions = {
      from: 'skypathairlines@gmail.com',
      to: email,
      subject: 'Flight Reminder',
      html: `
        <h2>Flight Reminder</h2>
        <p>Your flight is in 6 hours!</p>
        <p>Flight: ${flight.flightNumber}</p>
        <p>Seat: ${seat.seatNumber}</p>
        <p>From: ${fromCity || flight.startLocation}</p>
        <p>To: ${toCity || flight.destinationLocation}</p>
        <p>Date: ${new Date(flight.date).toLocaleDateString()}</p>
        <p>Departure: ${flight.startTime}</p>
        <p>Arrival: ${flight.destinationTime}</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Reminder email sent successfully');
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  });

  res.status(200).json({ message: 'Reminder scheduled successfully' });
});

/* ✅ Booking confirmation & reminder email */
app.post('/api/send-email', async (req, res) => {
  const { email, flight, seat, fromCity, toCity, reminderType } = req.body;

  const subject = reminderType === 'reminder' ? 'Flight Reminder' : 'Booking Confirmation';
  const heading = reminderType === 'reminder' ? 'Flight Reminder' : 'Booking Confirmed';
  const extraText = reminderType === 'reminder' ? '<p>Your flight is in 6 hours!</p>' : '';

  const mailOptions = {
    from: 'skypathairlines@gmail.com',
    to: email,
    subject: subject,
    html: `
      <h2>${heading}</h2>
      ${extraText}
      <p>Flight: ${flight.flightNumber}</p>
      <p>Seat: ${seat.seatNumber}</p>
      <p>From: ${fromCity || flight.startLocation}</p>
      <p>To: ${toCity || flight.destinationLocation}</p>
      <p>Date: ${new Date(flight.date).toLocaleDateString()}</p>
      <p>Departure: ${flight.startTime}</p>
      <p>Arrival: ${flight.destinationTime}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

/* ✅ Middleware & Routes */
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

app.use('/api/profile', profileRoutes);
app.use('/api/flights', flights);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use("/api/airlineUser", require("./routes/airuser.js"));

/* ✅ Error handler */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something broke!', details: err.message });
});

/* ✅ Start Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
