import api from '../../api.js';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext.jsx';
import './order.css';

export default function Order() {
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({}); // { menuItemId: quantity }
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    pickupDate: '',
    pickupTime: ''
  });

  useEffect(() => {
    api.get('/menu')
      .then((res) => {
        // Handle whichever shape the backend returns: a bare array,
        // { items: [...] }, or { data: [...] }. Falls back to [] so
        // .map() never crashes even if the response shape changes.
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.items || res.data?.data || []);
        setMenu(data);
      })
      .catch(() => setStatus({ type: 'error', text: 'Could not load the menu. Is the backend running?' }))
      .finally(() => setLoadingMenu(false));
  }, []);

  function updateQty(itemId, delta) {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[itemId] || 0) + delta;
      if (qty <= 0) {
        delete next[itemId];
      } else {
        next[itemId] = qty;
      }
      return next;
    });
  }

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const cartLines = Object.entries(cart).map(([id, qty]) => {
    const item = menu.find((m) => m.id === Number(id));
    return item ? { ...item, quantity: qty } : null;
  }).filter(Boolean);

  const total = cartLines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (cartLines.length === 0) {
      setStatus({ type: 'error', text: 'Add at least one item to your order first.' });
      return;
    }
    setStatus({ type: '', text: '' });
    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        ...form,
        userId: user?.id,
        items: cartLines.map((l) => ({
          menuItemId: l.id,
          quantity: l.quantity,
          unitPrice: l.price
        }))
      });
      setStatus({ type: 'success', text: `${res.data.message}. Total: $${Number(res.data.totalAmount).toFixed(2)}` });
      setCart({});
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not place your order. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  // Group menu items by category, preserving first-seen order.
  const categories = [];
  const grouped = {};
  menu.forEach((item) => {
    const cat = item.category || 'Menu';
    if (!grouped[cat]) {
      grouped[cat] = [];
      categories.push(cat);
    }
    grouped[cat].push(item);
  });

  return (
    <div className="ord-page">
      <div className="ord-inner">
        <span className="ord-eyebrow">Order Ahead</span>
        <h1 className="ord-title">Build your order.</h1>
        <div className="ord-hr" />

        <div className="ord-layout">
          <div className="ord-menu">
            {loadingMenu && <p className="ord-loading">Loading menu...</p>}

            {!loadingMenu && categories.map((cat) => (
              <div key={cat} className="ord-category">
                <h2 className="ord-category-title">{cat}</h2>
                {grouped[cat].map((item) => (
                  <div key={item.id} className="ord-item">
                    <div className="ord-item-info">
                      <h3>{item.name}</h3>
                      {item.description && <p>{item.description}</p>}
                    </div>
                    <div className="ord-item-right">
                      <span className="ord-item-price">${Number(item.price).toFixed(2)}</span>
                      {cart[item.id] ? (
                        <div className="ord-qty">
                          <button type="button" onClick={() => updateQty(item.id, -1)}>&minus;</button>
                          <span>{cart[item.id]}</span>
                          <button type="button" onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                      ) : (
                        <button type="button" className="ord-add-btn" onClick={() => updateQty(item.id, 1)}>
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="ord-policies">
              <h3>Order Policies</h3>
              <ul>
                <li>Pickup windows are strictly enforced to ensure food quality.</li>
                <li>Orders must be placed at least 45 minutes in advance.</li>
                <li>Cancellations require a 2-hour notice for a full refund.</li>
              </ul>
            </div>
          </div>

          <aside className="ord-summary">
            <h3>Your Order</h3>

            {cartLines.length === 0 && <p className="ord-empty">No items added yet.</p>}

            {cartLines.map((l) => (
              <div key={l.id} className="ord-cart-line">
                <span>{l.quantity} &times; {l.name}</span>
                <span>${(l.price * l.quantity).toFixed(2)}</span>
              </div>
            ))}

            {cartLines.length > 0 && (
              <div className="ord-cart-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            )}

            {status.text && <div className={`ord-msg ${status.type}`}>{status.text}</div>}

            <form onSubmit={handleSubmit} className="ord-form">
              <div className="ord-field">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" required value={form.fullName} onChange={handleFormChange} />
              </div>
              <div className="ord-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleFormChange} />
              </div>
              <div className="ord-field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleFormChange} />
              </div>
              <div className="ord-row">
                <div className="ord-field">
                  <label htmlFor="pickupDate">Pickup Date</label>
                  <input id="pickupDate" name="pickupDate" type="date" min={today} required value={form.pickupDate} onChange={handleFormChange} />
                </div>
                <div className="ord-field">
                  <label htmlFor="pickupTime">Pickup Time</label>
                  <input id="pickupTime" name="pickupTime" type="time" required value={form.pickupTime} onChange={handleFormChange} />
                </div>
              </div>
              <button className="ord-submit" type="submit" disabled={submitting}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}