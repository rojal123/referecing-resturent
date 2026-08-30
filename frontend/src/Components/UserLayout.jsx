import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';
import './userLayout.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/my-orders', label: 'My Orders' },
];

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const initial = user?.fullName?.charAt(0).toUpperCase() || '?';

  return (
    <div className="user-shell">
      <aside className="user-sidebar">
        <div className="user-brand">Tavola</div>
        <nav className="user-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `user-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="user-logout" onClick={handleLogout}>Logout</button>
      </aside>

      <div className="user-content">
        <header className="user-topbar">
          <div />
          <div className="user-topbar-right">
            <NotificationBell />
            <Link to="/" className="user-btn-ghost">Return to Home</Link>
            <div className="user-topbar-account">
              <span className="user-avatar">{initial}</span>
              <span className="user-topbar-name">{user?.fullName?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        <main className="user-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}