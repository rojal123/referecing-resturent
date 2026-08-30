const Booking = require('../models/Booking');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Review = require('../models/Review');
const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');

const {
  serializeMenuItem,
  serializeBooking,
  serializeOrder,
  serializeReview,
  serializeContactMessage,
  serializeCustomer
} = require('../utils/serializers');

async function getDashboard() {
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

  return {
    totalBookings,
    totalOrders,
    totalRevenue: revenueAgg[0]?.total || 0,
    activeBookings,
    totalMessages,
    latestMessage: latestMessageDoc ? serializeContactMessage(latestMessageDoc) : null,
    upcomingBookings: upcomingBookingsDocs.map(serializeBooking),
    topDish
  };
}

async function getBookings() {
  const bookings = await Booking.find().sort({ bookingDate: -1 });
  return bookings.map(serializeBooking);
}

async function updateBookingStatus(id, status) {
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    const err = new Error('Invalid status');
    err.status = 400;
    throw err;
  }
  await Booking.findByIdAndUpdate(id, { status });
}

async function deleteBooking(id) {
  await Booking.findByIdAndDelete(id);
}

async function getOrders() {
  const orders = await Order.find().sort({ createdAt: -1 });
  return orders.map(serializeOrder);
}

async function updateOrderStatus(id, status) {
  if (!['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
    const err = new Error('Invalid status');
    err.status = 400;
    throw err;
  }
  await Order.findByIdAndUpdate(id, { status });
}

async function deleteOrder(id) {
  await Order.findByIdAndDelete(id);
}

async function getMenu() {
  const items = await MenuItem.find().sort({ category: 1, name: 1 });
  return items.map(serializeMenuItem);
}

async function createMenuItem({ name, description, category, price, isAvailable, imageUrl }) {
  if (!name || !category || price === undefined || price === null) {
    const err = new Error('Name, category and price are required');
    err.status = 400;
    throw err;
  }
  const created = await MenuItem.create({
    name,
    description: description || '',
    category,
    price,
    isAvailable: isAvailable !== false,
    imageUrl: imageUrl || ''
  });
  return serializeMenuItem(created);
}

async function updateMenuItem(id, { name, description, category, price, isAvailable, imageUrl }) {
  const updated = await MenuItem.findByIdAndUpdate(
    id,
    { name, description, category, price, isAvailable, imageUrl },
    { new: true, runValidators: true }
  );
  if (!updated) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }
  return serializeMenuItem(updated);
}

async function deleteMenuItem(id) {
  await MenuItem.findByIdAndDelete(id);
}

async function getCustomers() {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(serializeCustomer);
}

async function deleteCustomer(userId) {
  await Promise.all([
    Booking.updateMany({ userId }, { userId: null }),
    Order.updateMany({ userId }, { userId: null }),
    Review.updateMany({ userId }, { userId: null }),
    User.findByIdAndDelete(userId)
  ]);
}

async function getReviews() {
  const reviews = await Review.find().sort({ createdAt: -1 });
  return reviews.map(serializeReview);
}

async function deleteReview(id) {
  await Review.findByIdAndDelete(id);
}

async function getMessages() {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  return messages.map(serializeContactMessage);
}

async function deleteMessage(id) {
  await ContactMessage.findByIdAndDelete(id);
}

async function getReport() {
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

  return {
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
  };
}

async function sendNotification({ recipientId, title, message }) {
  if (!title || !message) {
    const err = new Error('Title and message are required');
    err.status = 400;
    throw err;
  }

  // "all" broadcasts to every registered user. We store one row per
  // recipient (rather than a single "broadcast" row) so each user's
  // read/unread state can be tracked independently, and so the
  // existing per-user query pattern (Notification.find({ recipient }))
  // used everywhere else in this codebase keeps working unchanged.
  if (recipientId === 'all') {
    const users = await User.find({}, '_id');
    if (users.length === 0) {
      const err = new Error('There are no registered users to notify');
      err.status = 404;
      throw err;
    }
    const docs = users.map((u) => ({ recipient: u._id, title, message }));
    await Notification.insertMany(docs);
    return { message: `Notification sent to ${docs.length} user(s)` };
  }

  const user = await User.findById(recipientId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  await Notification.create({ recipient: recipientId, title, message });
  return { message: `Notification sent to ${user.fullName}` };
}

module.exports = {
  getDashboard, getBookings, updateBookingStatus, deleteBooking,
  getOrders, updateOrderStatus, deleteOrder,
  getMenu, createMenuItem, updateMenuItem, deleteMenuItem,
  getCustomers, deleteCustomer,
  getReviews, deleteReview,
  getMessages, deleteMessage,
  getReport,
  sendNotification
};