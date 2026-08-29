import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api.js';
import { useAuth } from '../../../Context/AuthContext.jsx';
import './userAccount.css';

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'status-pending' },
  preparing: { label: 'Preparing', className: 'status-confirmed' },
  ready: { label: 'Ready for pickup', className: 'status-confirmed' },
  completed: { label: 'Completed', className: 'status-confirmed' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' },
};

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-orders' } });
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/orders/${encodeURIComponent(user.email)}`);
        if (!cancelled) setOrders(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Could not load your orders.');
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
        <p className="acct-page__eyebrow">Your orders</p>
        <h1 className="acct-page__title">My Orders</h1>
      </div>

      {loading && <p className="acct-note">Loading your orders…</p>}
      {!loading && error && <p className="acct-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="acct-empty">
          <p>You haven&apos;t placed any orders yet.</p>
          <button className="acct-empty__cta" onClick={() => navigate('/order')}>
            Order ahead
          </button>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="acct-list">
          {orders.map((o) => {
            const status = STATUS_STYLES[o.status] || STATUS_STYLES.pending;
            return (
              <div className="acct-card" key={o.id}>
                <div className="acct-card__top">
                  <div>
                    <h3>Rs. {o.total_amount} · {o.items_summary}</h3>
                    <p className="acct-card__meta">
                      Pickup {o.pickup_date} · {o.pickup_time}
                    </p>
                  </div>
                  <span className={`acct-status ${status.className}`}>{status.label}</span>
                </div>
                <p className="acct-card__ref">Ref #{o.id.slice(-6).toUpperCase()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}