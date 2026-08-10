import api from '../../api.js';
import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext.jsx';
import kitchenImage from '../../assets/hero-kitchen.png';
import './booking.css';

const TIME_SLOTS = [
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

const GUEST_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  partySize: '',
  bookingDate: '',
  bookingTime: ''
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
    <div className="book-page">
      <section className="book-hero">
        <div className="book-hero-inner">
          <div className="book-image-wrap">
            <img src={kitchenImage} alt="Tavola kitchen" className="book-image" />
          </div>

          <div className="book-form-col">
            <span className="book-eyebrow">Reservations</span>
            <h1 className="book-title">Secure Your Place</h1>
            <p className="book-sub">
              Join us for an evening of culinary heritage. Please provide your details to request a table.
            </p>

            {status.text && <div className={`book-msg ${status.type}`}>{status.text}</div>}

            <form onSubmit={handleSubmit} className="book-form">
              <div className="book-row">
                <div className="book-field">
                  <label htmlFor="bookingDate">Date</label>
                  <input
                    id="bookingDate"
                    name="bookingDate"
                    type="date"
                    min={today}
                    required
                    value={form.bookingDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="book-field">
                  <label htmlFor="bookingTime">Time</label>
                  <select
                    id="bookingTime"
                    name="bookingTime"
                    required
                    value={form.bookingTime}
                    onChange={handleChange}
                  >
                    <option value="">Select Time</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="book-field">
                <label htmlFor="partySize">Party Size</label>
                <select
                  id="partySize"
                  name="partySize"
                  required
                  value={form.partySize}
                  onChange={handleChange}
                >
                  <option value="">Select Guests</option>
                  {GUEST_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div className="book-row">
                <div className="book-field">
                  <label htmlFor="fullName">Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    placeholder="Full Name"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="book-field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="book-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="book-submit" disabled={loading}>
                {loading ? 'Requesting...' : 'Request Reservation'} <span aria-hidden="true">&rarr;</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="book-info">
        <div className="book-info-inner">
          <div>
            <h3>Opening Hours</h3>
            <ul className="book-hours">
              <li><span>Tuesday &ndash; Thursday</span><span>17:00 &ndash; 22:00</span></li>
              <li><span>Friday &ndash; Saturday</span><span>17:00 &ndash; 23:00</span></li>
              <li><span>Sunday</span><span>16:00 &ndash; 21:00</span></li>
              <li className="closed"><span>Monday</span><span>Closed</span></li>
            </ul>
          </div>

          <div>
            <h3>Dining Policies</h3>
            <p>We kindly ask for a 24-hour notice for any cancellations or changes to your reservation. A fee may apply for late cancellations.</p>
            <p>Our dress code is smart casual. We welcome children above the age of 7.</p>
          </div>

          <div>
            <h3>Contact</h3>
            <p>123 Heritage Row, Culinary District</p>
            <p>+1 (555) 123-4567</p>
            <p>reservations@tavola.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}