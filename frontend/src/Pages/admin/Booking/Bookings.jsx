import api from '../../../api.js';
import { useAdminList, formatDate } from '../helpers.js';

export default function Bookings() {
  const { items, error, reload } = useAdminList('/admin/bookings');

  async function updateStatus(id, status) {
    await api.patch(`/admin/bookings/${id}`, { status });
    reload();
  }

  async function remove(id) {
    if (!window.confirm('Delete this booking?')) return;
    await api.delete(`/admin/bookings/${id}`);
    reload();
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Table Bookings</h3>
      </div>
      {error && <div className="form-msg error">{error}</div>}
      {!items && !error && <p className="admin-empty">Loading...</p>}
      {items && items.length === 0 && <p className="admin-empty">No bookings yet.</p>}
      {items && items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Contact</th>
                <th>Party</th>
                <th>Date</th>
                <th>Time</th>
                <th>Request</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.full_name}</td>
                  <td>{b.email}<br />{b.phone}</td>
                  <td>{b.party_size}</td>
                  <td>{formatDate(b.booking_date)}</td>
                  <td>{b.booking_time}</td>
                  <td className="wrap-cell">{b.special_request || '—'}</td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="admin-btn-sm admin-btn-danger" onClick={() => remove(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}