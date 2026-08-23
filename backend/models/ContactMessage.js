const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: null },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);