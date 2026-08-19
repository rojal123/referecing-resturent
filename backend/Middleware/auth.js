const jwt = require('jsonwebtoken');

// Reads the "tavola_session" cookie (or an Authorization: Bearer header,
// as a fallback), verifies it, and attaches the decoded payload to
// req.user. Rejects the request outright if there's no valid session.
function requireAuth(req, res, next) {
  let token = req.cookies && req.cookies.tavola_session;

  if (!token) {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Please log in to continue' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}

module.exports = requireAuth;