const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const feedbackRoutes = require("./routes/feedback");
const flights = require("./routes/flights");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profile");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
require("dotenv").config();

const app = express();

// ✅ CORS setup — allow your Render frontend domain
app.use(
  cors({
    origin: ["https://skypath-airlines.onrender.com"], // your frontend Render URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Log every incoming request for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ JWT check
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

// ✅ Routes
app.use("/api/feedback", feedbackRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/flights", flights);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/airlineUser", require("./routes/airuser.js"));

// ✅ Email setup (for reminders)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Reminder route
app.post("/api/schedule-reminder", async (req, res) => {
  const { email, flight, seat, fromCity, toCity } = req.body;
  const reminderDate = new Date(flight.date);
  reminderDate.setHours(reminderDate.getHours() - 6);

  schedule.scheduleJob(reminderDate, async function () {
    const mailOptions = {
      from: "skypathairlines@gmail.com",
      to: email,
      subject: "Flight Reminder",
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
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Reminder email sent successfully");
    } catch (error) {
      console.error("Error sending reminder email:", error);
    }
  });

  res.status(200).json({ message: "Reminder scheduled successfully" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Something broke!", details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
