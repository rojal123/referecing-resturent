import api from '../api.js';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const location = useLocation();
  const [status, setStatus] = useState(() =>
    location.state?.signupMessage
      ? { type: 'success', text: location.state.signupMessage }
      : { type: '', text: '' }
  );
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user);
      setStatus({ type: 'success', text: res.data.message });
      navigate(res.data.user.isAdmin ? '/admin' : '/');
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
          <span className="eyebrow">Welcome Back</span>
          <h2>Log In</h2>

          {status.text && <div className={`form-msg ${status.type}`}>{status.text}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--color-gold)' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </section>
  );
}