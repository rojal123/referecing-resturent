import './adminLayout.css';
import { useAuth } from '../Context/AuthContext.jsx';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/menu', label: 'Menu' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/notifications', label: 'Notifications' },
  { to: '/admin/report', label: 'Report' }
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Tavola</div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        {/* Each nav item above corresponds to a nested <Route> in App.jsx,
            rendered here as its own page. */}
        <Outlet />
      </main>
    </div>
  );
}