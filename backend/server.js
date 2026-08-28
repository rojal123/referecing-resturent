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

const app = express();

connectDB();

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
app.listen(PORT, () => {
  console.log(`Tavola backend listening on http://localhost:${PORT}`);
});