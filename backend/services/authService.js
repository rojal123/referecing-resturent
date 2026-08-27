const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { isValidEmail, isStrongEnoughPassword } = require('../utils/validate');

const SESSION_MINUTES = 30;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MINUTES * 60 * 1000
  };
}

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${SESSION_MINUTES}m`
  });
}

async function signup({ fullName, email, phone, password }) {
  if (!fullName || !email || !password) {
    const err = new Error('Full name, email and password are required');
    err.status = 400;
    throw err;
  }
  if (!isValidEmail(email)) {
    const err = new Error('Please provide a valid email address');
    err.status = 400;
    throw err;
  }
  if (!isStrongEnoughPassword(password)) {
    const err = new Error('Password must be at least 6 characters');
    err.status = 400;
    throw err;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await User.create({ fullName, email, phone: phone || null, passwordHash });

  return { id: created._id.toString(), fullName, email, isAdmin: false };
}

async function login({ email, password }) {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }

  const admin = await Admin.findOne({ adminUsername: email });
  if (admin) {
    const adminMatch = await bcrypt.compare(password, admin.adminPassword);
    if (!adminMatch) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const adminPayload = {
      id: `admin-${admin._id}`,
      fullName: 'Admin',
      email: admin.adminUsername,
      isAdmin: true
    };
    return { user: adminPayload, token: signToken(adminPayload) };
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const userPayload = {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    isAdmin: false
  };

  return { user: userPayload, token: signToken(userPayload) };
}

module.exports = { cookieOptions, signup, login };