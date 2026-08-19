const express = require('express');
const MenuItem = require('../models/MenuItem');
const { serializeMenuItem } = require('../utils/serializers');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { isAvailable: true };

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { category: regex }, { description: regex }];
    }

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items.map(serializeMenuItem));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching menu' });
  }
});

module.exports = router;