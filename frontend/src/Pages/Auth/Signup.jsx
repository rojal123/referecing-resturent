import api from "../../api.js";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import signup from "../../assets/signup.jpg";

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
const COUNTRIES = ['Nepal', 'India', 'United States', 'United Kingdom', 'Australia', 'Other'];

const emptyForm = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  country: '',
  username: '',
  password: '',
  confirmPassword: '',
  referralCode: ''
};

export default function Signup() {
  const [form, setForm] = useState(emptyForm);
  const [photoName, setPhotoName] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    setPhotoName(file ? file.name : '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      // Only these four are actually stored today -- the rest of the form
      // (photo, DOB, gender, address, country, username, referral code)
      // is UI-only for now until the backend/database support them.
      const payload = {
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        password: form.password
      };
      const res = await api.post('/auth/signup', payload);
      // Account is created but the person is NOT logged in automatically --
      // send them to the login page to sign in with their new credentials.
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
    <div className="signup-page">
      <img src={signup} alt="" className="signup-bg-image" />
      <div className="signup-bg-overlay" />

      <div className="wrap" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="signup-card">
          <div className="signup-head">
            <div>
              <span className="eyebrow">Join Tavola</span>
              <h2 style={{ marginBottom: 4 }}>Create Account</h2>
              <p style={{ margin: 0 }}>Fill in the details below to get started</p>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-btn" disabled title="Coming soon">
                <span className="social-btn-badge social-btn-badge-google">
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1C3.26 21.3 7.31 24 12 24z" />
                    <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.28a12 12 0 0 0 0 10.78l4.01-3.1z" />
                    <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.61l4.01 3.1c.94-2.83 3.59-4.96 6.71-4.96z" />
                  </svg>
                </span>
                Google
              </button>
              <button type="button" className="social-btn" disabled title="Coming soon">
                <span className="social-btn-badge social-btn-badge-facebook">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
                    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
                  </svg>
                </span>
                Facebook
              </button>
            </div>
          </div>

          {status.text && <div className={`form-msg ${status.type}`}>{status.text}</div>}

          <form onSubmit={handleSubmit}>
            <div className="signup-grid">
              {/* ---- Personal Information ---- */}
              <div>
                <h4 className="signup-col-title">Personal Information</h4>

                <div className="field">
                  <label htmlFor="photo">Profile Photo</label>
                  <label className="field-file" htmlFor="photo">
                    <span className="field-file-text">
                      {photoName || 'Choose file — no file chosen'}
                    </span>
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="dob">Date of Birth</label>
                  <input id="dob" name="dob" type="date" value={form.dob} onChange={handleChange} />
                </div>

                <div className="field">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ---- Contact Details ---- */}
              <div>
                <h4 className="signup-col-title">Contact Details</h4>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+977 9800000000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    placeholder="Street, City"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="country">Country</label>
                  <select id="country" name="country" value={form.country} onChange={handleChange}>
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ---- Security ---- */}
              <div>
                <h4 className="signup-col-title">Security</h4>

                <div className="field">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    minLength={6}
                    required
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    minLength={6}
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="referralCode">Referral Code (optional)</label>
                  <input
                    id="referralCode"
                    name="referralCode"
                    value={form.referralCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginTop: 10 }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--color-gold)' }}>Sign in</Link>
              </p>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}