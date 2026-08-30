const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { serializeOrder } = require('../utils/serializers');

async function createOrder(userId, data) {
  const { fullName, email, phone, pickupDate, pickupTime, items } = data;

  if (!fullName || !email || !phone || !pickupDate || !pickupTime || !items || items.length === 0) {
    const err = new Error('Please complete all order details and add at least one item');
    err.status = 400;
    throw err;
  }

  // pickupDate arrives as "YYYY-MM-DD" from a native <input type="date">.
  // Reject anything before today so a stale form, a manually edited
  // request, or a direct API call can't book a pickup in the past.
  const requestedDate = new Date(`${pickupDate}T00:00:00`);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  if (Number.isNaN(requestedDate.getTime()) || requestedDate < startOfToday) {
    const err = new Error("Pickup date can't be in the past");
    err.status = 400;
    throw err;
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
    userId,
    fullName,
    email,
    phone,
    pickupDate,
    pickupTime,
    totalAmount,
    items: orderItems
  });

  return { orderId: order._id.toString(), totalAmount };
}

async function getOrdersByEmail(email) {
  const orders = await Order.find({ email }).sort({ createdAt: -1 });
  return orders.map(serializeOrder);
}

module.exports = { createOrder, getOrdersByEmail };