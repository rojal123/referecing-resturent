const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    adminUsername: { type: String, required: true, unique: true, trim: true },
    adminPassword: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);