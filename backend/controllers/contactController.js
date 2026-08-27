const contactService = require('../services/contactService');

async function createMessage(req, res) {
  try {
    const messageId = await contactService.createMessage(req.body);
    res.status(201).json({ message: 'Your message has been sent, thank you', messageId });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: 'Server error while sending your message' });
  }
}

module.exports = { createMessage };