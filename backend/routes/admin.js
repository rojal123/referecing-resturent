const express = require('express');
const requireAuth = require('../Middleware/auth');
const requireAdmin = require('../Middleware/admin');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/dashboard', adminController.getDashboard);

router.get('/bookings', adminController.getBookings);
router.patch('/bookings/:id', adminController.updateBooking);
router.delete('/bookings/:id', adminController.deleteBooking);

router.get('/orders', adminController.getOrders);
router.patch('/orders/:id', adminController.updateOrder);
router.delete('/orders/:id', adminController.deleteOrder);

router.get('/menu', adminController.getMenu);
router.post('/menu', adminController.createMenuItem);
router.put('/menu/:id', adminController.updateMenuItem);
router.delete('/menu/:id', adminController.deleteMenuItem);

router.get('/customers', adminController.getCustomers);
router.delete('/customers/:id', adminController.deleteCustomer);

router.get('/reviews', adminController.getReviews);
router.delete('/reviews/:id', adminController.deleteReview);

router.get('/messages', adminController.getMessages);
router.delete('/messages/:id', adminController.deleteMessage);

router.get('/report', adminController.getReport);

module.exports = router;