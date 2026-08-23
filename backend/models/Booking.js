const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    partySize: { type: Number, required: true, min: 1 },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },
    specialRequest: { type: String, default: null },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);