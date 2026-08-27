const authService = require('../services/authService');

async function signup(req, res) {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ message: 'Account created successfully. Please log in.', user });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: 'Server error while creating account' });
  }
}

async function login(req, res) {
  try {
    const { user, token } = await authService.login(req.body);
    res.cookie('tavola_session', token, authService.cookieOptions());
    res.json({ message: 'Logged in successfully', user });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: 'Server error while logging in' });
  }
}

function me(req, res) {
  res.json({ user: req.user });
}

function logout(req, res) {
  res.clearCookie('tavola_session', authService.cookieOptions());
  res.json({ message: 'Logged out successfully' });
}

module.exports = { signup, login, me, logout };