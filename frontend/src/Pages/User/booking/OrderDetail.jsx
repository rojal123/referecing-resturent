import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api.js';
import { useAuth } from '../../../Context/AuthContext.jsx';
import './myorder.css';

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'status-pending' },
  confirmed: { label: 'Confirmed', className: 'status-confirmed' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' },
};

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-bookings' } });
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/bookings/${encodeURIComponent(user.email)}`);
        if (!cancelled) setBookings(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Could not load your bookings.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user, navigate]);

  return (
    <div className="account-page">
      <div className="account-page__header">
        <p className="account-page__eyebrow">Your reservations</p>
        <h1 className="account-page__title">My Bookings</h1>
      </div>

      {loading && <p className="account-page__note">Loading your bookings…</p>}
      {!loading && error && <p className="account-page__error">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="account-empty">
          <p>You haven&apos;t reserved a table yet.</p>
          <button className="account-empty__cta" onClick={() => navigate('/booking')}>
            Book a table
          </button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="account-list">
          {bookings.map((b) => {
            const status = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
            return (
              <div className="account-card" key={b.id}>
                <div className="account-card__top">
                  <div>
                    <h3>Table for {b.party_size}</h3>
                    <p className="account-card__meta">
                      {b.booking_date} · {b.booking_time}
                    </p>
                  </div>
                  <span className={`account-status ${status.className}`}>{status.label}</span>
                </div>
                {b.special_request && (
                  <p className="account-card__note">"{b.special_request}"</p>
                )}
                <p className="account-card__ref">Ref #{b.id.slice(-6).toUpperCase()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}