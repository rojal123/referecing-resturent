import api from '../../api.js';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

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
      .then((res) => setMenu(res.data))
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

  return (
    <section className="section" style={{ borderBottom: 'none' }}>
      <div className="wrap">
        <span className="eyebrow">Order Ahead</span>
        <h2 style={{ marginBottom: 36 }}>Build your order.</h2>

        <div className="order-layout">
          <div>
            {loadingMenu && <p>Loading menu...</p>}
            {!loadingMenu && menu.map((item) => (
              <div key={item.id} className="order-row">
                <div>
                  <h3 style={{ marginBottom: 2 }}>{item.name}</h3>
                  <span className="eyebrow" style={{ marginBottom: 0 }}>{item.category}</span>
                </div>
                <div className="order-row-right">
                  <span className="menu-price">${Number(item.price).toFixed(2)}</span>
                  <div className="qty-control">
                    <button type="button" onClick={() => updateQty(item.id, -1)}>&minus;</button>
                    <span>{cart[item.id] || 0}</span>
                    <button type="button" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="form-card order-summary">
            <h3>Your Order</h3>

            {cartLines.length === 0 && <p style={{ fontSize: '0.88rem' }}>No items added yet.</p>}

            {cartLines.map((l) => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 6 }}>
                <span>{l.quantity} &times; {l.name}</span>
                <span>${(l.price * l.quantity).toFixed(2)}</span>
              </div>
            ))}

            {cartLines.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', color: 'var(--color-gold)', borderTop: '1px solid var(--color-line)', paddingTop: 10, marginTop: 10 }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            )}

            {status.text && <div className={`form-msg ${status.type}`} style={{ marginTop: 16 }}>{status.text}</div>}

            <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
              <div className="field">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" required value={form.fullName} onChange={handleFormChange} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleFormChange} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleFormChange} />
              </div>
              <div className="field">
                <label htmlFor="pickupDate">Pickup Date</label>
                <input id="pickupDate" name="pickupDate" type="date" min={today} required value={form.pickupDate} onChange={handleFormChange} />
              </div>
              <div className="field">
                <label htmlFor="pickupTime">Pickup Time</label>
                <input id="pickupTime" name="pickupTime" type="time" required value={form.pickupTime} onChange={handleFormChange} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </aside>
        </div>
      </div>

      <style>{`
        .order-layout {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--color-line);
        }
        .order-row-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .menu-price {
          font-family: var(--font-mono);
          color: var(--color-gold);
        }
        .qty-control {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
        }
        .qty-control button {
          width: 28px;
          height: 28px;
          border-radius: 3px;
          border: 1px solid var(--color-line);
          background: var(--color-bg-alt);
          color: var(--color-cream);
        }
        .qty-control button:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }
        .order-summary {
          position: sticky;
          top: 96px;
          max-width: none;
        }
        @media (max-width: 900px) {
          .order-layout { grid-template-columns: 1fr; }
          .order-summary { position: static; }
        }
      `}</style>
    </section>
  );
}
