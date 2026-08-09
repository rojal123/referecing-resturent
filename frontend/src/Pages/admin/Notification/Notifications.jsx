import api from '../../../api.js';
import { useAdminList, formatDate } from '../helpers.js';

export default function Notifications() {
  const { items, error, reload } = useAdminList('/admin/messages');

  async function remove(id) {
    if (!window.confirm('Delete this message?')) return;
    await api.delete(`/admin/messages/${id}`);
    reload();
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Contact Messages</h3>
      </div>
      {error && <div className="form-msg error">{error}</div>}
      {!items && !error && <p className="admin-empty">Loading...</p>}
      {items && items.length === 0 && <p className="admin-empty">No messages yet.</p>}
      {items && items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Sent</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>{m.full_name}<br />{m.email}</td>
                  <td>{m.subject || '—'}</td>
                  <td className="wrap-cell">{m.message}</td>
                  <td>{formatDate(m.created_at)}</td>
                  <td>
                    <button className="admin-btn-sm admin-btn-danger" onClick={() => remove(m.id)}>
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