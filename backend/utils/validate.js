function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongEnoughPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

module.exports = { isValidEmail, isStrongEnoughPassword };