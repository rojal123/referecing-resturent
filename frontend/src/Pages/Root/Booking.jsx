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

const OCCASION_OPTIONS = [
  'Birthday',
  'Anniversary',
  'Date night',
  'Business dinner',
  'Celebration',
  'Other',
];

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  partySize: '',
  bookingDate: '',
  bookingTime: '',
  occasion: '',
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

/* ---------- inline icons (no external icon dependency) ---------- */
const Icon = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20c1.6-3.6 4.6-5.4 7.5-5.4s5.9 1.8 7.5 5.4" strokeLinecap="round" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
      <path d="M4.5 6.5l7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 3.5h2.6l1.4 4-2 1.6a11.5 11.5 0 0 0 5.9 5.9l1.6-2 4 1.4V17c0 1.4-1.2 2.6-2.7 2.4C9.7 18.6 5.4 14.3 4.6 7.2 4.4 5.7 4.6 3.5 6 3.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="9" cy="8" r="3" />
      <path d="M2.8 19c1.3-3 3.4-4.5 6.2-4.5s4.9 1.5 6.2 4.5" strokeLinecap="round" />
      <circle cx="16.8" cy="8.6" r="2.4" />
      <path d="M15 14.7c2.1.2 3.7 1.7 4.8 4.3" strokeLinecap="round" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="5" width="17" height="15" rx="1.6" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3.5l1.6 4.9 4.9 1.6-4.9 1.6L12 16.5l-1.6-4.9-4.9-1.6 4.9-1.6L12 3.5z" strokeLinejoin="round" />
    </svg>
  ),
  note: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 4.5h11l3 3V19.5H5z" strokeLinejoin="round" />
      <path d="M9 10h6M9 13.5h6M9 17h3.5" strokeLinecap="round" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

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

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
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
        occasion: form.occasion || undefined,
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

  const requestCount = form.specialRequests.length;

  return (
    <div className="book-page">
      {/* ---------- HERO ---------- */}
      <section className="book-hero" style={{ backgroundImage: `url(${kitchenImage})` }}>
        <div className="book-hero-overlay" />
        <Reveal className="book-hero-content" as="div">
          <span className="book-eyebrow">Reservations</span>
          <h1 className="book-hero-title">
            Reserve your <em>place at the table.</em>
          </h1>
          <p className="book-hero-sub">
            Tell us when you'd like to come in and we'll have the table set, the
            candles lit, and the kitchen ready.
          </p>
        </Reveal>
      </section>

      {/* ---------- FORM + SUMMARY ---------- */}
      <section className="book-section">
        <div className="wrap book-layout">
          <Reveal className="book-form-col" delay={40}>
            <h2 className="book-form-heading">Book a table</h2>
            {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
              <p className="book-form-note">
                Fields marked with an error must be corrected before sending.
              </p>
            )}

            {status.text && (
              <div className={`book-msg ${status.type}`} role="alert">
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="book-form" noValidate>
              <div className="book-row">
                <div className={fieldClass('fullName')}>
                  <label htmlFor="fullName">Full name</label>
                  <div className="book-input-wrap">
                    <span className="book-input-icon">{Icon.user}</span>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Your full name"
                      required
                      autoComplete="name"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'err-fullName' : undefined}
                      value={form.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.fullName && (
                    <span id="err-fullName" className="book-error">{errors.fullName}</span>
                  )}
                </div>
                <div className={fieldClass('email')}>
                  <label htmlFor="email">Email address</label>
                  <div className="book-input-wrap">
                    <span className="book-input-icon">{Icon.mail}</span>
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
                  </div>
                  {errors.email && (
                    <span id="err-email" className="book-error">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="book-row">
                <div className={fieldClass('phone')}>
                  <label htmlFor="phone">Phone number</label>
                  <div className="book-input-wrap">
                    <span className="book-input-icon">{Icon.phone}</span>
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
                  </div>
                  {errors.phone && (
                    <span id="err-phone" className="book-error">{errors.phone}</span>
                  )}
                </div>
                <div className={fieldClass('partySize')}>
                  <label htmlFor="partySize">Party size</label>
                  <div className="book-input-wrap">
                    <span className="book-input-icon">{Icon.users}</span>
                    <select
                      id="partySize"
                      name="partySize"
                      required
                      aria-invalid={!!errors.partySize}
                      aria-describedby={errors.partySize ? 'err-partySize' : undefined}
                      value={form.partySize}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select guests</option>
                      {GUEST_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.partySize && (
                    <span id="err-partySize" className="book-error">{errors.partySize}</span>
                  )}
                </div>
              </div>

              <div className="book-row">
                <div className={fieldClass('bookingDate')}>
                  <label htmlFor="bookingDate">Date</label>
                  <div className="book-input-wrap">
                    <span className="book-input-icon">{Icon.calendar}</span>
                    <input
                      id="bookingDate"
                      name="bookingDate"
                      type="date"
                      min={today}
                      required
                      aria-invalid={!!errors.bookingDate}
                      aria-describedby={errors.bookingDate ? 'err-bookingDate' : undefined}
                      value={form.bookingDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.bookingDate && (
                    <span id="err-bookingDate" className="book-error">{errors.bookingDate}</span>
                  )}
                </div>
                <div className={fieldClass('bookingTime')}>
                  <label htmlFor="bookingTime">Time</label>
                  <div className="book-input-wrap">
                    <span className="book-input-icon">{Icon.clock}</span>
                    <select
                      id="bookingTime"
                      name="bookingTime"
                      required
                      aria-invalid={!!errors.bookingTime}
                      aria-describedby={errors.bookingTime ? 'err-bookingTime' : undefined}
                      value={form.bookingTime}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select a time</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  {errors.bookingTime && (
                    <span id="err-bookingTime" className="book-error">{errors.bookingTime}</span>
                  )}
                </div>
              </div>

              <div className="book-field">
                <label htmlFor="occasion">
                  Occasion <span className="optional">(optional)</span>
                </label>
                <div className="book-input-wrap">
                  <span className="book-input-icon">{Icon.sparkle}</span>
                  <select
                    id="occasion"
                    name="occasion"
                    value={form.occasion}
                    onChange={handleChange}
                  >
                    <option value="">No occasion</option>
                    {OCCASION_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={fieldClass('specialRequests')}>
                <label htmlFor="specialRequests">
                  Special requests <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={4}
                  placeholder="Dietary needs, seating preferences, accessibility..."
                  maxLength={500}
                  aria-invalid={!!errors.specialRequests}
                  aria-describedby={errors.specialRequests ? 'err-specialRequests' : undefined}
                  value={form.specialRequests}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="book-field-footer">
                  {errors.specialRequests ? (
                    <span id="err-specialRequests" className="book-error">{errors.specialRequests}</span>
                  ) : <span />}
                  <span className="book-count">{requestCount}/500</span>
                </div>
              </div>

              <button type="submit" className="book-submit" disabled={loading}>
                {loading ? 'Sending request...' : 'Request booking'}
                {!loading && <span className="book-submit-arrow" aria-hidden="true">{Icon.arrow}</span>}
              </button>
            </form>
          </Reveal>

          <Reveal className="book-summary-col" delay={80}>
            <div className="book-summary">
              <h3>Your booking</h3>
              <p className="book-summary-sub">A summary appears here as you fill in the form.</p>

              <ul className="book-summary-list">
                <li>
                  <span className="book-summary-label">{Icon.users}Guests</span>
                  <span className="book-summary-value">
                    {form.partySize ? `${form.partySize} ${form.partySize === '1' ? 'guest' : 'guests'}` : '—'}
                  </span>
                </li>
                <li>
                  <span className="book-summary-label">{Icon.calendar}Date</span>
                  <span className="book-summary-value">{formatDate(form.bookingDate)}</span>
                </li>
                <li>
                  <span className="book-summary-label">{Icon.clock}Time</span>
                  <span className="book-summary-value">{form.bookingTime || '—'}</span>
                </li>
                <li>
                  <span className="book-summary-label">{Icon.sparkle}Occasion</span>
                  <span className="book-summary-value">{form.occasion || '—'}</span>
                </li>
              </ul>

              <div className="book-summary-notice">
                <span className="book-summary-notice-icon">{Icon.note}</span>
                <p>
                  Bookings are requests, not confirmations. Our team will reply by
                  email within a few hours to confirm your table. For parties larger
                  than 8, please call us directly at <strong>+977 12345678</strong>.
                </p>
              </div>
            </div>

            <div className="book-info-grid">
              <Reveal className="book-info-block" delay={120}>
                <h3>Opening hours</h3>
                <ul className="book-hours">
                  <li><span>Tue – Thu</span><span>17:00 – 22:00</span></li>
                  <li><span>Fri – Sat</span><span>17:00 – 23:00</span></li>
                  <li><span>Sunday</span><span>16:00 – 21:00</span></li>
                  <li className="closed"><span>Monday</span><span>Closed</span></li>
                </ul>
              </Reveal>

              <Reveal className="book-info-block" delay={160}>
                <h3>Policies</h3>
                <p>24-hour notice for cancellations. Smart casual dress. Children above 7 welcome.</p>
              </Reveal>

              <Reveal className="book-info-block" delay={200}>
                <h3>Contact</h3>
                <p>12 Lakeside Avenue, Kathmandu</p>
                <p>+977 12345678</p>
                <p><a href="mailto:reservations@tavola-restaurant.com">reservations@tavola-restaurant.com</a></p>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}