const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { serializeOrder } = require('../utils/serializers');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, pickupDate, pickupTime, userId, items } = req.body;

    if (!fullName || !email || !phone || !pickupDate || !pickupTime || !items || items.length === 0) {
      return res.status(400).json({ message: 'Please complete all order details and add at least one item' });
    }

    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });
    const menuItemById = new Map(menuItems.map((m) => [m._id.toString(), m]));

    const orderItems = items.map((i) => {
      const dish = menuItemById.get(i.menuItemId);
      return {
        menuItem: i.menuItemId,
        name: dish ? dish.name : 'Unknown item',
        quantity: i.quantity,
        unitPrice: i.unitPrice
      };
    });

    const totalAmount = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    const order = await Order.create({
      userId: userId || null,
      fullName,
      email,
      phone,
      pickupDate,
      pickupTime,
      totalAmount,
      items: orderItems
    });

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id.toString(), totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while placing order' });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(orders.map(serializeOrder));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

module.exports = router;