const express = require('express');

const Booking = require('../models/Booking');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Review = require('../models/Review');
const ContactMessage = require('../models/ContactMessage');

const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');

const {
  serializeMenuItem,
  serializeBooking,
  serializeOrder,
  serializeReview,
  serializeContactMessage,
  serializeCustomer
} = require('../utils/serializers');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();

    const [totalBookings, totalOrders, totalMessages, revenueAgg, upcomingBookingsDocs, activeBookings] =
      await Promise.all([
        Booking.countDocuments(),
        Order.countDocuments(),
        ContactMessage.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
        Booking.find({ bookingDate: { $gte: now }, status: { $in: ['pending', 'confirmed'] } })
          .sort({ bookingDate: 1 })
          .limit(5),
        Booking.countDocuments({ bookingDate: { $gte: now }, status: { $in: ['pending', 'confirmed'] } })
      ]);

    const latestMessageDoc = await ContactMessage.findOne().sort({ createdAt: -1 });

    const topDishAgg = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.menuItem', total_ordered: { $sum: '$items.quantity' } } },
      { $sort: { total_ordered: -1 } },
      { $limit: 1 }
    ]);

    let topDish = null;
    if (topDishAgg.length > 0) {
      const dish = await MenuItem.findById(topDishAgg[0]._id);
      if (dish) {
        topDish = {
          name: dish.name,
          image_url: dish.imageUrl,
          total_ordered: topDishAgg[0].total_ordered
        };
      }
    }

    res.json({
      totalBookings,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      activeBookings,
      totalMessages,
      latestMessage: latestMessageDoc ? serializeContactMessage(latestMessageDoc) : null,
      upcomingBookings: upcomingBookingsDocs.map(serializeBooking),
      topDish
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load dashboard data' });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json(bookings.map(serializeBooking));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load bookings' });
  }
});

router.patch('/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    await Booking.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Booking updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update booking' });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete booking' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(serializeOrder));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load orders' });
  }
});

router.patch('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Order updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update order' });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete order' });
  }
});

router.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items.map(serializeMenuItem));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load menu' });
  }
});

router.post('/menu', async (req, res) => {
  try {
    const { name, description, category, price, isAvailable, imageUrl } = req.body;
    if (!name || !category || price === undefined || price === null) {
      return res.status(400).json({ message: 'Name, category and price are required' });
    }
    const created = await MenuItem.create({
      name,
      description: description || '',
      category,
      price,
      isAvailable: isAvailable !== false,
      imageUrl: imageUrl || ''
    });
    res.status(201).json(serializeMenuItem(created));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save this item' });
  }
});

router.put('/menu/:id', async (req, res) => {
  try {
    const { name, description, category, price, isAvailable, imageUrl } = req.body;
    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, category, price, isAvailable, imageUrl },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Menu item not found' });
    res.json(serializeMenuItem(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save this item' });
  }
});

router.delete('/menu/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete this item' });
  }
});



router.get('/customers', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(serializeCustomer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load customers' });
  }
});

router.delete('/customers/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await Promise.all([
      Booking.updateMany({ userId }, { userId: null }),
      Order.updateMany({ userId }, { userId: null }),
      Review.updateMany({ userId }, { userId: null }),
      User.findByIdAndDelete(userId)
    ]);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete this customer' });
  }
});

router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews.map(serializeReview));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load reviews' });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete this review' });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages.map(serializeContactMessage));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load messages' });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete this message' });
  }
});

router.get('/report', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [revenueByMonthAgg, bookingsByStatusAgg, ordersByStatusAgg, ratingAgg, topDishesAgg] =
      await Promise.all([
        Order.aggregate([
          { $match: { createdAt: { $gte: sixMonthsAgo } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
              orderCount: { $sum: 1 },
              totalRevenue: { $sum: '$totalAmount' }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }]),
        Order.aggregate([
          { $unwind: '$items' },
          { $group: { _id: '$items.name', totalOrdered: { $sum: '$items.quantity' } } },
          { $sort: { totalOrdered: -1 } },
          { $limit: 5 }
        ])
      ]);

    res.json({
      revenueByMonth: revenueByMonthAgg.map((m) => ({
        month: m._id,
        orderCount: m.orderCount,
        totalRevenue: m.totalRevenue
      })),
      bookingsByStatus: bookingsByStatusAgg.map((s) => ({ status: s._id, count: s.count })),
      ordersByStatus: ordersByStatusAgg.map((s) => ({ status: s._id, count: s.count })),
      averageRating: ratingAgg[0]?.avg || 0,
      reviewCount: ratingAgg[0]?.count || 0,
      topDishes: topDishesAgg.map((d) => ({ name: d._id, totalOrdered: d.totalOrdered }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load the report' });
  }
});

module.exports = router;