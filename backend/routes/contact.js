const express = require('express');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    await ContactMessage.create({ fullName, email, subject: subject || null, message });

    res.status(201).json({ message: 'Your message has been sent, we will get back to you soon' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

module.exports = router;