const Notification = require('../models/Notification');
const { serializeNotification } = require('../utils/serializers');

async function listForUser(userId) {
  const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
  return notifications.map(serializeNotification);
}

async function getUnreadCount(userId) {
  const count = await Notification.countDocuments({ recipient: userId, isRead: false });
  return { unread_count: count };
}

async function markAsRead(userId, notificationId) {
  const updated = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );
  if (!updated) {
    const err = new Error('Notification not found');
    err.status = 404;
    throw err;
  }
  return serializeNotification(updated);
}

async function markAllAsRead(userId) {
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
  return { message: 'All notifications marked as read' };
}

module.exports = { listForUser, getUnreadCount, markAsRead, markAllAsRead };