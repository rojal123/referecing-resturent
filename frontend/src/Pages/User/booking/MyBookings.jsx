import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api.js';
import { useAuth } from '../../../Context/AuthContext.jsx';
import './userAccount.css';

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
    <div className="acct-page">
      <div className="acct-page__header">
        <p className="acct-page__eyebrow">Your reservations</p>
        <h1 className="acct-page__title">My Bookings</h1>
      </div>

      {loading && <p className="acct-note">Loading your bookings…</p>}
      {!loading && error && <p className="acct-error">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="acct-empty">
          <p>You haven&apos;t reserved a table yet.</p>
          <button className="acct-empty__cta" onClick={() => navigate('/booking')}>
            Book a table
          </button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="acct-list">
          {bookings.map((b) => {
            const status = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
            return (
              <div className="acct-card" key={b.id}>
                <div className="acct-card__top">
                  <div>
                    <h3>Table for {b.party_size}</h3>
                    <p className="acct-card__meta">
                      {b.booking_date} · {b.booking_time}
                    </p>
                  </div>
                  <span className={`acct-status ${status.className}`}>{status.label}</span>
                </div>
                {b.special_request && (
                  <p className="acct-card__note">"{b.special_request}"</p>
                )}
                <p className="acct-card__ref">Ref #{b.id.slice(-6).toUpperCase()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}