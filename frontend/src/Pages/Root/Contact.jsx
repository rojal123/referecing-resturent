import api from '../../api.js';
import { useState } from 'react';
import kitchenImage from '../../assets/hero-kitchen.png';
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
      <div className="tavola-contact-grid">
        {/* Left column */}
        <div className="ct-form-col">
          <div className="ct-eyebrow">Get In Touch</div>
          <h1 className="ct-title">Contact us.</h1>
          <p className="ct-sub">
            Questions about a booking, a private event, or anything else — send us a note and we'll reply within one business day.
          </p>

          <div className="ct-info-row">
            <div>
              <div className="ct-info-label">Address</div>
              <div className="ct-info-value">
                12 Lakeside Avenue,<br />Kathmandu
              </div>
            </div>
            <div>
              <div className="ct-info-label">Contact</div>
              <div className="ct-info-value">
                +977 1 234 5678<br />hello@tavola-restaurant.com
              </div>
            </div>
          </div>

          {status.text && <div className={`ct-msg ${status.type}`}>{status.text}</div>}

          <form onSubmit={handleSubmit}>
            <FormField
              label="Full Name"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <FormField
              label="Subject"
              id="subject"
              name="subject"
              placeholder="What is this regarding?"
              value={form.subject}
              onChange={handleChange}
            />

            <div className="ct-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message here..."
                value={form.message}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <button type="submit" className="ct-submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Right column - image */}
        <div className="ct-image-col">
          <img src={kitchenImage} alt="Tavola kitchen" className="ct-image" />
        </div>
      </div>
    </div>
  );
}