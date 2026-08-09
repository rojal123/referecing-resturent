import api from '../api.js';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  fullName: '', email: '', phone: '', partySize: 2,
  bookingDate: '', bookingTime: '', specialRequest: ''
};

export default function Booking() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...initialForm,
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setLoading(true);
    try {
      const res = await api.post('/bookings', { ...form, userId: user?.id });
      setStatus({ type: 'success', text: res.data.message });
      setForm({ ...initialForm, fullName: user?.fullName || '', email: user?.email || '' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Could not create your booking. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="section" style={{ borderBottom: 'none' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 60 }}>
        <div>
          <span className="eyebrow">Reservations</span>
          <h2>Book a table.</h2>
          <p style={{ maxWidth: 400 }}>
            Tell us when you're coming and how many will join. We'll hold
            your table and confirm by email or phone.
          </p>
          <ul style={{ marginTop: 24, padding: 0, listStyle: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-cream-dim)' }}>
            <li style={{ marginBottom: 8 }}>Open Tue &ndash; Sun, 12:00 &ndash; 22:00</li>
            <li style={{ marginBottom: 8 }}>Large parties (8+) — call ahead</li>
            <li>Free cancellation up to 2 hours before</li>
          </ul>
        </div>

        <div className="form-card" style={{ maxWidth: 'none' }}>
          {status.text && <div className={`form-msg ${status.type}`}>{status.text}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="field">
                <label htmlFor="partySize">Party Size</label>
                <select id="partySize" name="partySize" value={form.partySize} onChange={handleChange}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="bookingDate">Date</label>
                <input id="bookingDate" name="bookingDate" type="date" min={today} required value={form.bookingDate} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="bookingTime">Time</label>
                <input id="bookingTime" name="bookingTime" type="time" required value={form.bookingTime} onChange={handleChange} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="specialRequest">Special Request (optional)</label>
              <textarea id="specialRequest" name="specialRequest" value={form.specialRequest} onChange={handleChange} />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Reserving...' : 'Reserve Table'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .wrap > div[style*="grid-template-columns: 1fr 1.1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
