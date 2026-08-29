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