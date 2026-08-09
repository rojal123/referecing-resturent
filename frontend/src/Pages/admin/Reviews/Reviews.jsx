import api from '../../api.js';
import { useAdminList, formatDate } from '../helpers.js';

export default function AdminReviews() {
  const { items, error, reload } = useAdminList('/admin/reviews');

  async function remove(id) {
    if (!window.confirm('Delete this review?')) return;
    await api.delete(`/admin/reviews/${id}`);
    reload();
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Customer Reviews</h3>
      </div>
      {error && <div className="form-msg error">{error}</div>}
      {!items && !error && <p className="admin-empty">Loading...</p>}
      {items && items.length === 0 && <p className="admin-empty">No reviews yet.</p>}
      {items && items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Posted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.full_name}</td>
                  <td>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td className="wrap-cell">{r.comment}</td>
                  <td>{formatDate(r.created_at)}</td>
                  <td>
                    <button className="admin-btn-sm admin-btn-danger" onClick={() => remove(r.id)}>
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