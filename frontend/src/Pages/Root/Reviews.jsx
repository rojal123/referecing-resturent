import api from '../../api.js';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

function Stars({ value }) {
  return (
    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold)' }}>
      {'\u2605'.repeat(value)}{'\u2606'.repeat(5 - value)}
    </span>
  );
}

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ fullName: user?.fullName || '', rating: 5, comment: '' });

  useEffect(() => {
    loadReviews();
  }, []);

  function loadReviews() {
    setLoading(true);
    api.get('/reviews')
      .then((res) => setReviews(res.data))
      .catch(() => setStatus({ type: 'error', text: 'Could not load reviews right now.' }))
      .finally(() => setLoading(false));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setSubmitting(true);
    try {
      const res = await api.post('/reviews', { ...form, rating: Number(form.rating), userId: user?.id });
      setStatus({ type: 'success', text: res.data.message });
      setForm({ fullName: user?.fullName || '', rating: 5, comment: '' });
      loadReviews();
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not submit review.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section" style={{ borderBottom: 'none' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'start' }}>
        <div>
          <span className="eyebrow">Guest Reviews</span>
          <h2>What people are saying.</h2>

          {loading && <p>Loading reviews...</p>}
          {!loading && reviews.length === 0 && <p>No reviews yet — be the first to share your experience.</p>}

          <div style={{ marginTop: 24 }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ borderBottom: '1px solid var(--color-line)', padding: '20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <strong>{r.full_name}</strong>
                  <Stars value={r.rating} />
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-card" style={{ maxWidth: 'none' }}>
          <h3>Leave a Review</h3>
          {status.text && <div className={`form-msg ${status.type}`}>{status.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fullName">Your Name</label>
              <input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="rating">Rating</label>
              <select id="rating" name="rating" value={form.rating} onChange={handleChange}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="comment">Your Review</label>
              <textarea id="comment" name="comment" required value={form.comment} onChange={handleChange} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .wrap > div[style*="grid-template-columns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
