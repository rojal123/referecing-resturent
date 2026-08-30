const notificationService = require('../services/Notificationservice');

function handleError(res, err, fallbackMessage) {
  if (err.status) return res.status(err.status).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: fallbackMessage });
}

async function getMine(req, res) {
  try { res.json(await notificationService.listForUser(req.user.id)); }
  catch (err) { handleError(res, err, 'Could not load notifications'); }
}

async function getUnreadCount(req, res) {
  try { res.json(await notificationService.getUnreadCount(req.user.id)); }
  catch (err) { handleError(res, err, 'Could not load unread count'); }
}

async function markRead(req, res) {
  try { res.json(await notificationService.markAsRead(req.user.id, req.params.id)); }
  catch (err) { handleError(res, err, 'Could not update this notification'); }
}

async function markAllRead(req, res) {
  try { res.json(await notificationService.markAllAsRead(req.user.id)); }
  catch (err) { handleError(res, err, 'Could not update notifications'); }
}

module.exports = { getMine, getUnreadCount, markRead, markAllRead };