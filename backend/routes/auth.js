const express = require('express');
const rateLimit = require('express-rate-limit');
const requireAuth = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in a few minutes.' }
});

router.post('/signup', authLimiter, authController.signup);
router.post('/login', authLimiter, authController.login);
router.get('/me', requireAuth, authController.me);
router.post('/logout', authController.logout);

module.exports = router;