import { useEffect, useState } from 'react';
import api from '../../../api.js';

export default function Report() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.get('/admin/report')
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load the report');
      });
    return () => { cancelled = true; };
  }, []);

  if (error) return <div className="form-msg error">{error}</div>;
  if (!data) return <p className="admin-empty">Loading report...</p>;

  return (
    <div className="admin-panel">
      <h3>Revenue -- Last 6 Months</h3>
      {data.revenueByMonth.length === 0 && <p className="admin-empty">No order revenue yet.</p>}
      {data.revenueByMonth.length > 0 && (
        <div className="admin-table-wrap" style={{ marginBottom: 28 }}>
          <table className="admin-table">
            <thead>
              <tr><th>Month</th><th>Orders</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {data.revenueByMonth.map((m) => (
                <tr key={m.month}>
                  <td>{m.month}</td>
                  <td>{m.orderCount}</td>
                  <td>${Number(m.totalRevenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-dashboard-grid" style={{ marginBottom: 28 }}>
        <div>
          <h3>Bookings by Status</h3>
          <table className="admin-table">
            <thead><tr><th>Status</th><th>Count</th></tr></thead>
            <tbody>
              {data.bookingsByStatus.map((s) => (
                <tr key={s.status}><td style={{ textTransform: 'capitalize' }}>{s.status}</td><td>{s.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Orders by Status</h3>
          <table className="admin-table">
            <thead><tr><th>Status</th><th>Count</th></tr></thead>
            <tbody>
              {data.ordersByStatus.map((s) => (
                <tr key={s.status}><td style={{ textTransform: 'capitalize' }}>{s.status}</td><td>{s.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3>Reviews</h3>
      <p className="admin-empty" style={{ marginBottom: 20 }}>
        Average rating: {data.averageRating.toFixed(1)} / 5 across {data.reviewCount} review{data.reviewCount === 1 ? '' : 's'}
      </p>

      <h3>Top 5 Dishes</h3>
      {data.topDishes.length === 0 && <p className="admin-empty">No orders placed yet.</p>}
      {data.topDishes.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Dish</th><th>Total Ordered</th></tr></thead>
            <tbody>
              {data.topDishes.map((d) => (
                <tr key={d.name}><td>{d.name}</td><td>{d.totalOrdered}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}