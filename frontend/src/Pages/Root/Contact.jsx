import api from '../api.js';
import { useState } from 'react';

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
    <section className="section" style={{ borderBottom: 'none' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 60 }}>
        <div>
          <span className="eyebrow">Get In Touch</span>
          <h2>Contact us.</h2>
          <p style={{ maxWidth: 380 }}>
            Questions about a booking, a private event, or anything else —
            send us a note and we'll reply within one business day.
          </p>

          <div style={{ marginTop: 30, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-cream-dim)' }}>
            <p style={{ marginBottom: 8 }}>12 Lakeside Avenue, Kathmandu</p>
            <p style={{ marginBottom: 8 }}>+977 1 234 5678</p>
            <p>hello@tavola-restaurant.com</p>
          </div>
        </div>

        <div className="form-card" style={{ maxWidth: 'none' }}>
          {status.text && <div className={`form-msg ${status.type}`}>{status.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" value={form.subject} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required value={form.message} onChange={handleChange} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Sending...' : 'Send Message'}
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
