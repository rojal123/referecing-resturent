const express = require('express');
const Booking = require('../models/Booking');
const { serializeBooking } = require('../utils/serializers');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, partySize, bookingDate, bookingTime, specialRequest, userId } = req.body;

    if (!fullName || !email || !phone || !partySize || !bookingDate || !bookingTime) {
      return res.status(400).json({ message: 'Please fill in all required booking fields' });
    }

    const booking = await Booking.create({
      userId: userId || null,
      fullName,
      email,
      phone,
      partySize,
      bookingDate,
      bookingTime,
      specialRequest: specialRequest || null
    });

    res.status(201).json({ message: 'Table reserved successfully', bookingId: booking._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.params.email }).sort({ bookingDate: -1 });
    res.json(bookings.map(serializeBooking));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

module.exports = router;