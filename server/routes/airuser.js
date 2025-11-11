const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // make sure this file exists and path is correct
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Check JWT_SECRET existence
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET not defined in environment');
  process.exit(1);
}

// ✅ Register route
router.post('/register', async (req, res) => {
  console.log('🟡 Register request received:', req.body);

  try {
    const { username, name, email, password, phoneNumber } = req.body;

    // Validate input
    if (!username || !name || !email || !password || !phoneNumber) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();
    console.log('✅ New user registered:', newUser.email);

    // Create JWT
    const payload = { user: { id: newUser.id } };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, isLoggedIn: true });
  } catch (err) {
    console.error('❌ Error in /register route:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  console.log('🟡 Login attempt:', req.body.email);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('⚠️ User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Login successful:', email);
    res.status(200).json({ token, isLoggedIn: true });
  } catch (err) {
    console.error('❌ Error in /login route:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ✅ Check authentication route
router.get('/check-auth', (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('🔍 Checking auth token:', token ? 'Provided' : 'Missing');

  if (!token) {
    return res.json({ isLoggedIn: false });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ isLoggedIn: true });
  } catch (error) {
    console.log('❌ Invalid token');
    res.json({ isLoggedIn: false });
  }
});

module.exports = router;
