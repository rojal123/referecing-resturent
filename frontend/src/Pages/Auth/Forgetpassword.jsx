import api from "../../api.js";
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatus({ type: 'success', text: res.data.message });
      setSubmitted(true);
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ borderBottom: 'none', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="form-card">
          <span className="eyebrow">Reset Access</span>
          <h2>Forgot Password</h2>
          <p style={{ marginBottom: 24 }}>
            Enter the email on your account and we'll send a link to reset your password.
          </p>

          {status.text && <div className={`form-msg ${status.type}`}>{status.text}</div>}

          {!submitted && (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <p style={{ marginTop: 20, fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: 'var(--color-gold)' }}>Back to Log In</Link>
          </p>
        </div>
      </div>
    </section>
  );
}