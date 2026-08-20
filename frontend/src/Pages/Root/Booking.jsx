import { useState } from 'react';
import api from '../../api.js';
import { useAuth } from '../../Context/AuthContext.jsx';
import useReveal from '../../hooks/useReveal.js';
import kitchenImage from '../../assets/hero-kitchen.png';
import './booking.css';

const TIME_SLOTS = [
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
];

const GUEST_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  partySize: '',
  bookingDate: '',
  bookingTime: '',
  specialRequests: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;

function Reveal({ as: Tag = 'div', className = '', style, children, delay = 0 }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}

function validateField(name, value, form) {
  const trimmed = typeof value === 'string' ? value.trim() : value;

  switch (name) {
    case 'bookingDate': {
      if (!trimmed) return 'Please select a date.';
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(trimmed + 'T00:00:00');
      if (Number.isNaN(selected.getTime())) return 'Invalid date.';
      if (selected < today) return 'Date cannot be in the past.';
      if (selected.getDay() === 1) return 'We are closed on Mondays.';
      return '';
    }
    case 'bookingTime':
      if (!trimmed) return 'Please select a time.';
      if (!TIME_SLOTS.includes(trimmed)) return 'Please choose a valid time slot.';
      return '';
    case 'partySize': {
      if (!trimmed) return 'Please select party size.';
      const n = Number(trimmed);
      if (!Number.isInteger(n) || n < 1 || n > 12) {
        return 'Party size must be between 1 and 12.';
      }
      return '';
    }
    case 'fullName':
      if (!trimmed) return 'Full name is required.';
      if (trimmed.length < 2) return 'Name must be at least 2 characters.';
      if (trimmed.length > 80) return 'Name is too long.';
      return '';
    case 'phone':
      if (!trimmed) return 'Phone number is required.';
      if (!PHONE_RE.test(trimmed)) return 'Enter a valid phone number.';
      return '';
    case 'email':
      if (!trimmed) return 'Email is required.';
      if (!EMAIL_RE.test(trimmed)) return 'Enter a valid email address.';
      return '';
    case 'specialRequests':
      if (trimmed && trimmed.length > 500) {
        return 'Special requests must be under 500 characters.';
      }
      return '';
    default:
      return '';
  }
}

function validateForm(form) {
  const fields = [
    'bookingDate',
    'bookingTime',
    'partySize',
    'fullName',
    'phone',
    'email',
    'specialRequests',
  ];
  const next = {};
  let valid = true;
  for (const name of fields) {
    const msg = validateField(name, form[name], form);
    if (msg) {
      next[name] = msg;
      valid = false;
    }
  }
  return { valid, errors: next };
}

export default function Booking() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...initialForm,
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: '', text: '' });

    if (touched[name] || errors[name]) {
      const msg = validateField(name, value, { ...form, [name]: value });
      setErrors((prev) => {
        const next = { ...prev };
        if (msg) next[name] = msg;
        else delete next[name];
        return next;
      });
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, value, form);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[name] = msg;
      else delete next[name];
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    const allTouched = {
      bookingDate: true,
      bookingTime: true,
      partySize: true,
      fullName: true,
      phone: true,
      email: true,
      specialRequests: true,
    };
    setTouched(allTouched);

    const { valid, errors: nextErrors } = validateForm(form);
    setErrors(nextErrors);

    if (!valid) {
      setStatus({
        type: 'error',
        text: 'Please fix the highlighted fields and try again.',
      });
      const firstKey = Object.keys(nextErrors)[0];
      if (firstKey) {
        const el = document.getElementById(firstKey);
        if (el) el.focus();
      }
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        partySize: Number(form.partySize),
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
        specialRequest: form.specialRequests.trim() || undefined,
        userId: user?.id,
      };
      const res = await api.post('/bookings', payload);
      setStatus({
        type: 'success',
        text:
          res.data.message ||
          'Your table request has been received. We will confirm shortly.',
      });
      setForm({
        ...initialForm,
        fullName: user?.fullName || '',
        email: user?.email || '',
      });
      setErrors({});
      setTouched({});
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && typeof data.errors === 'object') {
        const mapped = { ...data.errors };
        if (mapped.specialRequest && !mapped.specialRequests) {
          mapped.specialRequests = mapped.specialRequest;
          delete mapped.specialRequest;
        }
        setErrors((prev) => ({ ...prev, ...mapped }));
        const firstKey = Object.keys(mapped)[0];
        if (firstKey) {
          const el = document.getElementById(firstKey);
          if (el) el.focus();
        }
      }
      setStatus({
        type: 'error',
        text:
          data?.message ||
          'Could not create your booking. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  function fieldClass(name) {
    return errors[name] ? 'book-field has-error' : 'book-field';
  }

  return (
    <div className="book-page">
      <section className="book-section">
        <div className="wrap book-layout">
          <div className="book-left">
            <Reveal className="book-image-wrap">
              <img
                src={kitchenImage}
                alt="Tavola dining room"
                className="book-image"
              />
            </Reveal>

            <Reveal className="book-info-block" delay={80}>
              <h3>Opening Hours</h3>
              <ul className="book-hours">
                <li>
                  <span>Tue – Thu</span>
                  <span>17:00 – 22:00</span>
                </li>
                <li>
                  <span>Fri – Sat</span>
                  <span>17:00 – 23:00</span>
                </li>
                <li>
                  <span>Sunday</span>
                  <span>16:00 – 21:00</span>
                </li>
                <li className="closed">
                  <span>Monday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </Reveal>

            <Reveal className="book-info-block" delay={120}>
              <h3>Policies</h3>
              <p>
                24-hour notice for cancellations. Smart casual dress. Children
                above 7 welcome.
              </p>
            </Reveal>

            <Reveal className="book-info-block" delay={160}>
              <h3>Contact</h3>
              <p>12 Lakeside Avenue, Kathmandu</p>
              <p>+977 12345678</p>
              <p>
                <a href="mailto:reservations@tavola-restaurant.com">
                  reservations@tavola-restaurant.com
                </a>
              </p>
            </Reveal>
          </div>

          <Reveal className="book-form-col" delay={40}>
            <span className="book-eyebrow">Reservations</span>
            <h1 className="book-title">Secure Your Place</h1>
            <p className="book-sub">
              Choose a date, time, and party size. We will hold the table for
              you.
            </p>

            {status.text && (
              <div className={`book-msg ${status.type}`} role="alert">
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="book-form" noValidate>
              <div className="book-row">
                <div className={fieldClass('bookingDate')}>
                  <label htmlFor="bookingDate">Date</label>
                  <input
                    id="bookingDate"
                    name="bookingDate"
                    type="date"
                    min={today}
                    required
                    aria-invalid={!!errors.bookingDate}
                    aria-describedby={
                      errors.bookingDate ? 'err-bookingDate' : undefined
                    }
                    value={form.bookingDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.bookingDate && (
                    <span id="err-bookingDate" className="book-error">
                      {errors.bookingDate}
                    </span>
                  )}
                </div>
                <div className={fieldClass('bookingTime')}>
                  <label htmlFor="bookingTime">Time</label>
                  <select
                    id="bookingTime"
                    name="bookingTime"
                    required
                    aria-invalid={!!errors.bookingTime}
                    aria-describedby={
                      errors.bookingTime ? 'err-bookingTime' : undefined
                    }
                    value={form.bookingTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.bookingTime && (
                    <span id="err-bookingTime" className="book-error">
                      {errors.bookingTime}
                    </span>
                  )}
                </div>
              </div>

              <div className={fieldClass('partySize')}>
                <label htmlFor="partySize">Party Size</label>
                <select
                  id="partySize"
                  name="partySize"
                  required
                  aria-invalid={!!errors.partySize}
                  aria-describedby={
                    errors.partySize ? 'err-partySize' : undefined
                  }
                  value={form.partySize}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select guests</option>
                  {GUEST_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
                {errors.partySize && (
                  <span id="err-partySize" className="book-error">
                    {errors.partySize}
                  </span>
                )}
              </div>

              <div className="book-row">
                <div className={fieldClass('fullName')}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={
                      errors.fullName ? 'err-fullName' : undefined
                    }
                    value={form.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.fullName && (
                    <span id="err-fullName" className="book-error">
                      {errors.fullName}
                    </span>
                  )}
                </div>
                <div className={fieldClass('phone')}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+977 98XXXXXXXX"
                    required
                    autoComplete="tel"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'err-phone' : undefined}
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.phone && (
                    <span id="err-phone" className="book-error">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className={fieldClass('email')}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'err-email' : undefined}
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && (
                  <span id="err-email" className="book-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={fieldClass('specialRequests')}>
                <label htmlFor="specialRequests">
                  Special Requests <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={3}
                  placeholder="Allergies, celebration, seating preference..."
                  maxLength={500}
                  aria-invalid={!!errors.specialRequests}
                  aria-describedby={
                    errors.specialRequests ? 'err-specialRequests' : undefined
                  }
                  value={form.specialRequests}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.specialRequests && (
                  <span id="err-specialRequests" className="book-error">
                    {errors.specialRequests}
                  </span>
                )}
              </div>

              <button type="submit" className="book-submit" disabled={loading}>
                {loading ? 'Sending request...' : 'Request Reservation'}
                {!loading && (
                  <span className="book-submit-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}