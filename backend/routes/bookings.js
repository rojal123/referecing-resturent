const express = require('express');
const requireAuth = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.post('/', requireAuth, bookingController.createBooking);
router.get('/:email', bookingController.getBookingsByEmail);

module.exports = router;