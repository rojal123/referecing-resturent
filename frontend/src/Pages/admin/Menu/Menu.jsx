import { Link } from 'react-router-dom';
import api from "../../api.js";
import { useAdminList } from '../helpers.js';

export default function AdminMenu() {
  const { items, error, reload } = useAdminList('/admin/menu');

  async function remove(id) {
    if (!window.confirm('Delete this menu item?')) return;
    await api.delete(`/admin/menu/${id}`);
    reload();
  }

  return (
    <>
      <div className="admin-panel-head">
        <h3>Menu</h3>
        <Link to="/admin/menu/new" className="btn btn-primary">
          Add a Dish
        </Link>
      </div>

      {error && <div className="form-msg error">{error}</div>}
      {!items && !error && <p className="admin-empty">Loading...</p>}
      {items && items.length === 0 && <p className="admin-empty">No menu items yet.</p>}
      {items && items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.category}</td>
                  <td>${Number(m.price).toFixed(2)}</td>
                  <td>{m.is_available ? 'Yes' : 'No'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link className="admin-btn-sm" to={`/admin/menu/${m.id}/edit`}>
                      Edit
                    </Link>
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
    </>
  );
}