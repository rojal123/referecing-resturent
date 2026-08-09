import api from '../../api.js';
import { useAdminList, formatDate } from '../helpers.js';

export default function Customers() {
  const { items, error, reload } = useAdminList('/admin/customers');

  async function remove(id) {
    if (!window.confirm('Delete this customer account? Their past bookings/orders/reviews stay on record but will no longer be linked to an account.')) return;
    await api.delete(`/admin/customers/${id}`);
    reload();
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Manage Customers</h3>
      </div>
      {error && <div className="form-msg error">{error}</div>}
      {!items && !error && <p className="admin-empty">Loading...</p>}
      {items && items.length === 0 && <p className="admin-empty">No customer accounts yet.</p>}
      {items && items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>{c.full_name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{formatDate(c.created_at)}</td>
                  <td>
                    <button className="admin-btn-sm admin-btn-danger" onClick={() => remove(c.id)}>
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