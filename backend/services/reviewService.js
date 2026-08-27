const Review = require('../models/Review');
const { serializeReview } = require('../utils/serializers');

async function listReviews() {
  const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
  return reviews.map(serializeReview);
}

async function createReview({ fullName, rating, comment, userId }) {
  if (!fullName || !rating || !comment) {
    const err = new Error('Name, rating and comment are required');
    err.status = 400;
    throw err;
  }
  if (rating < 1 || rating > 5) {
    const err = new Error('Rating must be between 1 and 5');
    err.status = 400;
    throw err;
  }

  const review = await Review.create({ userId: userId || null, fullName, rating, comment });
  return review._id.toString();
}

module.exports = { listReviews, createReview };