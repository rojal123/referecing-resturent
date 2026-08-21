const rateLimit = require('express-rate-limit');

function limitHandler(req, res) {
  res.status(429).json({
    message: 'Too many requests. Please wait a moment and try again.',
  });
}

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many authentication attempts. Please try again in 15 minutes.',
    });
  },
});

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many booking requests. Please wait before trying again.',
    });
  },
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many order requests. Please wait before trying again.',
    });
  },
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many submissions. Please wait before sending another message.',
    });
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  bookingLimiter,
  orderLimiter,
  formLimiter,
};