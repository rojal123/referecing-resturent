const express = require('express');
const Review = require('../models/Review');
const { serializeReview } = require('../utils/serializers');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
    res.json(reviews.map(serializeReview));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { fullName, rating, comment, userId } = req.body;

    if (!fullName || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating and comment are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({ userId: userId || null, fullName, rating, comment });
    res.status(201).json({ message: 'Review submitted, thank you', reviewId: review._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while submitting review' });
  }
});

module.exports = router;