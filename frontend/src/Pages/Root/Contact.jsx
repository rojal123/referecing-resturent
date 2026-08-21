import api from '../../api.js';
import { useState } from 'react';
import kit from '../../assets/3.png';



import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import './contact.css';

function FormField({ label, id, name, placeholder, value, onChange, type = 'text', required }) {
  return (
    <div className="ct-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

const HOURS = [
  { day: 'Monday', time: 'Closed' },
  { day: 'Tue – Thu', time: '5:00 PM – 10:30 PM' },
  { day: 'Fri – Sat', time: '12:00 PM – 11:30 PM' },
  { day: 'Sunday', time: '12:00 PM – 9:00 PM' },
];

export default function Contact() {
  const [form, setForm] = useState({ fullName: '', email: '', subject: '', message: '' });
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
      const res = await api.post('/contact', form);
      setStatus({ type: 'success', text: res.data.message });
      setForm({ fullName: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not send your message.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tavola-contact-page">
      {/* Hero */}
      <section className="ct-hero">
        <img src={kit} alt="Tavola kitchen" className="ct-hero__image" />
        <div className="ct-hero__overlay" />
        <div className="ct-hero__content">
          <span className="ct-hero__badge">Trattoria Since 1962</span>
          <h1 className="ct-hero__title">
            Let's talk over
            <br />
            <em>a good meal.</em>
          </h1>
          <p className="ct-hero__sub">
            Whether you're planning a reservation, a private celebration, or
            simply want to share a thought with our kitchen — we'd love to
            hear from you.
          </p>
          <div className="ct-hero__actions">
            <a href="#ct-form" className="ct-hero__btn ct-hero__btn--solid">
              Send a message
            </a>
            <a href="#ct-visit" className="ct-hero__btn ct-hero__btn--outline">
              Visit us
            </a>
          </div>
        </div>
      </section>

      {/* Panels */}
      <section className="ct-panels">
        <div className="ct-panels__grid">
          {/* Left panel: form */}
          <div className="ct-panel ct-panel--form" id="ct-form">
            <h2 className="ct-panel__title">Send us a message</h2>
            <p className="ct-panel__sub">
              We respond to every inquiry within one business day.
            </p>

            {status.text && (
              <div className={`ct-msg ${status.type}`}>{status.text}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="ct-field-row">
                <FormField
                  label="Full name"
                  id="fullName"
                  name="fullName"
                  placeholder="Maria Rossi"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Email address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="maria@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ct-field">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option value="">Select a topic</option>
                  <option value="reservation">Reservation</option>
                  <option value="private-event">Private Event</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="ct-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Share the details of your request..."
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  maxLength={5000}
                  required
                />
                <div className="ct-char-count">{form.message.length}/5000</div>
              </div>

              <button type="submit" className="ct-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </div>

          {/* Right panel: direct contact + hours */}
          <div className="ct-panel-col" id="ct-visit">
            <div className="ct-panel ct-panel--direct">
              <h2 className="ct-panel__title">Talk to us directly</h2>
              <p className="ct-panel__sub">
                Prefer a conversation? Reach the team through any of these
                channels.
              </p>

              <div className="ct-contact-list">
                <div className="ct-contact-item">
                  <span className="ct-contact-icon">
                    <MapPin size={20} strokeWidth={2} />
                  </span>
                  <div>
                    <div className="ct-contact-label">Visit us</div>
                    <div className="ct-contact-value">
                      12 Lakeside Avenue, Kathmandu
                    </div>
                    <div className="ct-contact-note">
                      Free valet parking after 5 PM
                    </div>
                  </div>
                </div>

                <div className="ct-contact-item">
                  <span className="ct-contact-icon">
                    <Phone size={20} strokeWidth={2} />
                  </span>
                  <div>
                    <div className="ct-contact-label">Call us</div>
                    <div className="ct-contact-value">+977 1 234 5678</div>
                    <div className="ct-contact-note">Reservations welcome</div>
                  </div>
                </div>

                <div className="ct-contact-item">
                  <span className="ct-contact-icon">
                    <Mail size={20} strokeWidth={2} />
                  </span>
                  <div>
                    <div className="ct-contact-label">Email us</div>
                    <div className="ct-contact-value">
                      hello@tavola-restaurant.com
                    </div>
                    <div className="ct-contact-note">
                      Replies within one business day
                    </div>
                  </div>
                </div>
              </div>

              <div className="ct-social">
                <a href="#" className="ct-social__icon" aria-label="Instagram">
                  <FaInstagram size={16} />
                </a>
                <a href="#" className="ct-social__icon" aria-label="Facebook">
                  <FaFacebookF size={16} />
                </a>
              </div>
            </div>

            <div className="ct-panel ct-panel--hours">
              <h3 className="ct-hours__title">
                <Clock size={18} strokeWidth={2} />
                Opening hours
              </h3>
              <div className="ct-hours-list">
                {HOURS.map((h) => (
                  <div className="ct-hours-row" key={h.day}>
                    <span>{h.day}</span>
                    <span className={h.time === 'Closed' ? 'ct-closed' : ''}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}