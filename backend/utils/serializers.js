function dateOnly(d) {
  if (!d) return null;
  return new Date(d).toISOString().split('T')[0];
}

function serializeMenuItem(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    category: doc.category,
    price: doc.price,
    is_available: doc.isAvailable,
    image_url: doc.imageUrl
  };
}

function serializeBooking(doc) {
  return {
    id: doc._id.toString(),
    full_name: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    party_size: doc.partySize,
    booking_date: dateOnly(doc.bookingDate),
    booking_time: doc.bookingTime,
    special_request: doc.specialRequest,
    status: doc.status,
    created_at: doc.createdAt
  };
}

function serializeOrder(doc) {
  const items_summary = doc.items.map((i) => `${i.quantity}x ${i.name}`).join(', ');
  return {
    id: doc._id.toString(),
    full_name: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    pickup_date: dateOnly(doc.pickupDate),
    pickup_time: doc.pickupTime,
    total_amount: doc.totalAmount,
    status: doc.status,
    items_summary,
    created_at: doc.createdAt
  };
}

function serializeReview(doc) {
  return {
    id: doc._id.toString(),
    full_name: doc.fullName,
    rating: doc.rating,
    comment: doc.comment,
    created_at: doc.createdAt
  };
}

function serializeContactMessage(doc) {
  return {
    id: doc._id.toString(),
    full_name: doc.fullName,
    email: doc.email,
    subject: doc.subject,
    message: doc.message,
    created_at: doc.createdAt
  };
}

function serializeCustomer(doc) {
  return {
    id: doc._id.toString(),
    full_name: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    created_at: doc.createdAt
  };
}

module.exports = {
  dateOnly,
  serializeMenuItem,
  serializeBooking,
  serializeOrder,
  serializeReview,
  serializeContactMessage,
  serializeCustomer
};