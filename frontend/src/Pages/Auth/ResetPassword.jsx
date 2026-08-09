import api from "../../api.js";
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const linkLooksValid = Boolean(email && token);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    if (password !== confirmPassword) {
      setStatus({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, token, password });
      navigate('/login', { state: { signupMessage: res.data.message } });
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
          <h2>Set a New Password</h2>

          {!linkLooksValid && (
            <div className="form-msg error">
              This reset link is missing information. Request a new one from the{' '}
              <Link to="/forgot-password" style={{ color: 'inherit', textDecoration: 'underline' }}>
                forgot password page
              </Link>.
            </div>
          )}

          {status.text && <div className={`form-msg ${status.type}`}>{status.text}</div>}

          {linkLooksValid && (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  type="password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  minLength={6}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Saving...' : 'Set New Password'}
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