const express = require('express');
const requireAuth = require('../middleware/auth');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.post('/', requireAuth, orderController.createOrder);
router.get('/:email', orderController.getOrdersByEmail);

module.exports = router;