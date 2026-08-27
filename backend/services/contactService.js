const ContactMessage = require('../models/ContactMessage');

async function createMessage({ fullName, email, subject, message, userId }) {
  if (!fullName || !email || !message) {
    const err = new Error('Name, email and message are required');
    err.status = 400;
    throw err;
  }

  const created = await ContactMessage.create({
    userId: userId || null,
    fullName,
    email,
    subject: subject || null,
    message
  });

  return created._id.toString();
}

module.exports = { createMessage };