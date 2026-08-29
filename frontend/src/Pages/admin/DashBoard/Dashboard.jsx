import api from '../../../api.js';
import { formatDate } from '../helpers.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    api.get('/admin/dashboard')
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load dashboard data');
      });
    return () => { cancelled = true; };
  }, []);

  if (error) return <div className="form-msg error">{error}</div>;
  if (!data) return <p className="admin-empty">Loading dashboard...</p>;

  const stats = [
    { label: 'Total Bookings', value: data.totalBookings },
    { label: 'Total Orders', value: data.totalOrders },
    { label: 'Total Revenue', value: `Rs. ${Number(data.totalRevenue).toFixed(2)}` },
    { label: 'Upcoming Bookings', value: data.activeBookings },
    { label: 'Total Messages', value: data.totalMessages }
  ];

  return (
    <>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>

      <div className="admin-stat-grid">
        {stats.map((s) => (
          <div className="admin-stat-card" key={s.label}>
            <span className="admin-stat-label">{s.label}</span>
            <span className="admin-stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h3>Latest Message</h3>
            <button className="admin-btn-sm" onClick={() => navigate('/admin/notifications')}>View all</button>
          </div>
          {data.latestMessage ? (
            <div>
              <strong>{data.latestMessage.full_name}</strong>: {data.latestMessage.subject || data.latestMessage.message}
              <div className="admin-empty" style={{ padding: '6px 0 0' }}>
                Posted on: {new Date(data.latestMessage.created_at).toLocaleString()}
              </div>
            </div>
          ) : (
            <p className="admin-empty">No messages yet.</p>
          )}

          <h3 style={{ marginTop: 28 }}>Upcoming Bookings</h3>
          {data.upcomingBookings.length === 0 && <p className="admin-empty">Nothing coming up.</p>}
          {data.upcomingBookings.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Party</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.upcomingBookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.full_name}</td>
                      <td>{b.party_size}</td>
                      <td>{formatDate(b.booking_date)}</td>
                      <td className="admin-status-ok">{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-panel">
          <h3>Most Ordered Dish</h3>
          {data.topDish ? (
            <>
              {data.topDish.image_url && (
                <img src={data.topDish.image_url} alt={data.topDish.name} className="admin-dish-img" />
              )}
              <p className="admin-tag">Most Requested</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{data.topDish.name}</p>
              <p className="admin-empty">
                Ordered {data.topDish.total_ordered} times so far -- your top seller based on order history.
              </p>
            </>
          ) : (
            <p className="admin-empty">No orders placed yet.</p>
          )}
        </div>
      </div>
    </>
  );
}