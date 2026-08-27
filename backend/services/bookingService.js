const Booking = require('../models/Booking');
const { serializeBooking } = require('../utils/serializers');

async function createBooking(userId, data) {
  const { fullName, email, phone, partySize, bookingDate, bookingTime, specialRequest } = data;

  if (!fullName || !email || !phone || !partySize || !bookingDate || !bookingTime) {
    const err = new Error('Please fill in all required booking fields');
    err.status = 400;
    throw err;
  }

  const booking = await Booking.create({
    userId,
    fullName,
    email,
    phone,
    partySize,
    bookingDate,
    bookingTime,
    specialRequest: specialRequest || null
  });

  return booking._id.toString();
}

async function getBookingsByEmail(email) {
  const bookings = await Booking.find({ email }).sort({ bookingDate: -1 });
  return bookings.map(serializeBooking);
}

module.exports = { createBooking, getBookingsByEmail };