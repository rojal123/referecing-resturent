const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const connectDB = require('./Config/db');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const bookingRoutes = require('./routes/bookings');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// Fail loudly at boot if required env vars are missing, instead of
// silently 500-ing on the first request that needs them.
const REQUIRED_ENV_VARS = ['JWT_SECRET', 'MONGODB_URI'];
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`FATAL: Missing required environment variable(s): ${missing.join(', ')}`);
  console.error('Set these in your hosting platform\'s environment variable settings.');
  process.exit(1);
}

const app = express();

// Vercel sits in front of your app as a proxy and sets X-Forwarded-For.
// Without this, express-rate-limit can't reliably determine the real
// client IP and throws a ValidationError on every rate-limited route.
app.set('trust proxy', 1);

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tavola API is running (MongoDB)' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error('Startup failed: could not connect to MongoDB. Server not started.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Tavola backend listening on http://localhost:${PORT}`);
  });
}

start();