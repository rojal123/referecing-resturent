const reviewService = require('../services/reviewService');

async function listReviews(req, res) {
  try {
    const reviews = await reviewService.listReviews();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
}

async function createReview(req, res) {
  try {
    const reviewId = await reviewService.createReview(req.body);
    res.status(201).json({ message: 'Review submitted, thank you', reviewId });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: 'Server error while submitting review' });
  }
}

module.exports = { listReviews, createReview };