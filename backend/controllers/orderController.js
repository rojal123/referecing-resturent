const orderService = require('../services/orderService');

async function createOrder(req, res) {
  try {
    const { orderId, totalAmount } = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ message: 'Order placed successfully', orderId, totalAmount });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: 'Server error while placing order' });
  }
}

async function getOrdersByEmail(req, res) {
  try {
    const orders = await orderService.getOrdersByEmail(req.params.email);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
}

module.exports = { createOrder, getOrdersByEmail };