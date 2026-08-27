const bookingService = require('../services/bookingService');

async function createBooking(req, res) {
  try {
    const bookingId = await bookingService.createBooking(req.user.id, req.body);
    res.status(201).json({ message: 'Table reserved successfully', bookingId });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
}

async function getBookingsByEmail(req, res) {
  try {
    const bookings = await bookingService.getBookingsByEmail(req.params.email);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
}

module.exports = { createBooking, getBookingsByEmail };