const adminService = require('../services/adminService');

function handleError(res, err, fallbackMessage) {
  if (err.status) return res.status(err.status).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: fallbackMessage });
}

async function getDashboard(req, res) {
  try { res.json(await adminService.getDashboard()); }
  catch (err) { handleError(res, err, 'Could not load dashboard data'); }
}

async function getBookings(req, res) {
  try { res.json(await adminService.getBookings()); }
  catch (err) { handleError(res, err, 'Could not load bookings'); }
}

async function updateBooking(req, res) {
  try {
    await adminService.updateBookingStatus(req.params.id, req.body.status);
    res.json({ message: 'Booking updated' });
  } catch (err) { handleError(res, err, 'Could not update booking'); }
}

async function deleteBooking(req, res) {
  try {
    await adminService.deleteBooking(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) { handleError(res, err, 'Could not delete booking'); }
}

async function getOrders(req, res) {
  try { res.json(await adminService.getOrders()); }
  catch (err) { handleError(res, err, 'Could not load orders'); }
}

async function updateOrder(req, res) {
  try {
    await adminService.updateOrderStatus(req.params.id, req.body.status);
    res.json({ message: 'Order updated' });
  } catch (err) { handleError(res, err, 'Could not update order'); }
}

async function deleteOrder(req, res) {
  try {
    await adminService.deleteOrder(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) { handleError(res, err, 'Could not delete order'); }
}

async function getMenu(req, res) {
  try { res.json(await adminService.getMenu()); }
  catch (err) { handleError(res, err, 'Could not load menu'); }
}

async function createMenuItem(req, res) {
  try {
    const item = await adminService.createMenuItem(req.body);
    res.status(201).json(item);
  } catch (err) { handleError(res, err, 'Could not save this item'); }
}

async function updateMenuItem(req, res) {
  try {
    const item = await adminService.updateMenuItem(req.params.id, req.body);
    res.json(item);
  } catch (err) { handleError(res, err, 'Could not save this item'); }
}

async function deleteMenuItem(req, res) {
  try {
    await adminService.deleteMenuItem(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) { handleError(res, err, 'Could not delete this item'); }
}

async function getCustomers(req, res) {
  try { res.json(await adminService.getCustomers()); }
  catch (err) { handleError(res, err, 'Could not load customers'); }
}

async function deleteCustomer(req, res) {
  try {
    await adminService.deleteCustomer(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) { handleError(res, err, 'Could not delete this customer'); }
}

async function getReviews(req, res) {
  try { res.json(await adminService.getReviews()); }
  catch (err) { handleError(res, err, 'Could not load reviews'); }
}

async function deleteReview(req, res) {
  try {
    await adminService.deleteReview(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) { handleError(res, err, 'Could not delete this review'); }
}

async function getMessages(req, res) {
  try { res.json(await adminService.getMessages()); }
  catch (err) { handleError(res, err, 'Could not load messages'); }
}

async function deleteMessage(req, res) {
  try {
    await adminService.deleteMessage(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) { handleError(res, err, 'Could not delete this message'); }
}

async function getReport(req, res) {
  try { res.json(await adminService.getReport()); }
  catch (err) { handleError(res, err, 'Could not load the report'); }
}

async function sendNotification(req, res) {
  try {
    const { recipientId, title, message } = req.body;
    res.json(await adminService.sendNotification({ recipientId, title, message }));
  } catch (err) { handleError(res, err, 'Could not send notification'); }
}

module.exports = {
  getDashboard, getBookings, updateBooking, deleteBooking,
  getOrders, updateOrder, deleteOrder,
  getMenu, createMenuItem, updateMenuItem, deleteMenuItem,
  getCustomers, deleteCustomer,
  getReviews, deleteReview,
  getMessages, deleteMessage,
  getReport,
  sendNotification
};