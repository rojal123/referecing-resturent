const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Admin = require('../models/Admin');
const requireAuth = require('../middleware/auth');
const { isValidEmail, isStrongEnoughPassword } = require('../utils/validate');

const router = express.Router();

const SESSION_MINUTES = 30;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MINUTES * 60 * 1000
  };
}

function issueSession(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${SESSION_MINUTES}m`
  });
  res.cookie('tavola_session', token, cookieOptions());
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in a few minutes.' }
});

router.post('/signup', authLimiter, async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (!isStrongEnoughPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await User.create({ fullName, email, phone: phone || null, passwordHash });

    const user = { id: created._id.toString(), fullName, email, isAdmin: false };

    res.status(201).json({ message: 'Account created successfully. Please log in.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating account' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ adminUsername: email });
    if (admin) {
      const adminMatch = await bcrypt.compare(password, admin.adminPassword);
      if (!adminMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const adminPayload = {
        id: `admin-${admin._id}`,
        fullName: 'Admin',
        email: admin.adminUsername,
        isAdmin: true
      };
      issueSession(res, adminPayload);
      return res.json({ message: 'Logged in successfully', user: adminPayload });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userPayload = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      isAdmin: false
    };
    issueSession(res, userPayload);

    res.json({ message: 'Logged in successfully', user: userPayload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while logging in' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
  res.clearCookie('tavola_session', cookieOptions());
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;