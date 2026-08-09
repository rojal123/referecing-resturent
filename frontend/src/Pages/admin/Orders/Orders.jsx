import api from '../../api.js';
import { useAdminList, formatDate } from '../helpers.js';

export default function Orders() {
  const { items, error, reload } = useAdminList('/admin/orders');

  async function updateStatus(id, status) {
    await api.patch(`/admin/orders/${id}`, { status });
    reload();
  }

  async function remove(id) {
    if (!window.confirm('Delete this order?')) return;
    await api.delete(`/admin/orders/${id}`);
    reload();
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Advance Orders</h3>
      </div>
      {error && <div className="form-msg error">{error}</div>}
      {!items && !error && <p className="admin-empty">Loading...</p>}
      {items && items.length === 0 && <p className="admin-empty">No orders yet.</p>}
      {items && items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Items</th>
                <th>Pickup</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id}>
                  <td>{o.full_name}<br />{o.email}</td>
                  <td className="wrap-cell">{o.items_summary || '—'}</td>
                  <td>{formatDate(o.pickup_date)} {o.pickup_time}</td>
                  <td>${Number(o.total_amount).toFixed(2)}</td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="admin-btn-sm admin-btn-danger" onClick={() => remove(o.id)}>
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