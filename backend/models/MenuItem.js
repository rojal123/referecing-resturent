const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
    imageUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema, 'menus');