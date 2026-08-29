import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api.js';
import { useAuth } from '../../../Context/AuthContext.jsx';
import './dashboard.css';

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'status-pending' },
  preparing: { label: 'Preparing', className: 'status-pending' },
  ready: { label: 'Ready for pickup', className: 'status-confirmed' },
  completed: { label: 'Completed', className: 'status-confirmed' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/dashboard' } });
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [ordersRes, bookingsRes] = await Promise.all([
          api.get(`/orders/${encodeURIComponent(user.email)}`),
          api.get(`/bookings/${encodeURIComponent(user.email)}`),
        ]);
        if (!cancelled) {
          setOrders(ordersRes.data);
          setBookings(bookingsRes.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Could not load your dashboard.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user, navigate]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="dash">
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Hello, {user?.fullName?.split(' ')[0]}</h1>
          <p className="dash-header__subtitle">Ready for your next reservation?</p>
        </div>
      </div>

      {loading && <p className="dash-note">Loading your dashboard…</p>}
      {!loading && error && <p className="dash-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="dash-stats">
            <div className="dash-stat">
              <span className="dash-stat__label">Active Bookings</span>
              <span className="dash-stat__value dash-stat__value--accent">{activeBookings}</span>
            </div>
            <div className="dash-stat">
              <span className="dash-stat__label">Completed Orders</span>
              <span className="dash-stat__value">{completedOrders}</span>
            </div>
            <div className="dash-stat">
              <span className="dash-stat__label">Total Spent</span>
              <span className="dash-stat__value dash-stat__value--money">Rs. {totalSpent.toFixed(2)}</span>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel__head">
              <h3>Recent Orders</h3>
              <Link to="/my-orders" className="dash-panel__link">View All</Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="dash-empty">
                <p>You haven&apos;t placed any orders yet.</p>
                <button className="dash-empty__cta" onClick={() => navigate('/order')}>
                  Order ahead
                </button>
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Pickup</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => {
                      const status = STATUS_STYLES[o.status] || STATUS_STYLES.pending;
                      return (
                        <tr key={o.id}>
                          <td className="dash-table__wrap">{o.items_summary}</td>
                          <td>{o.pickup_date} · {o.pickup_time}</td>
                          <td>Rs. {o.total_amount}</td>
                          <td>
                            <span className={`dash-status ${status.className}`}>
                              <i className="dash-status__dot" />{status.label}
                            </span>
                          </td>
                          <td>
                            <Link to="/my-orders" className="dash-btn-sm">Details</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}