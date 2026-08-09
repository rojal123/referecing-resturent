import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, CalendarCheck, Star, Info, Mail } from 'lucide-react';
import { useAuth } from '../Context/AuthContext.jsx';
import './navbar.css';

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/menu', label: 'Menu', icon: ShoppingBag },
  { to: '/booking', label: 'Book Table', icon: CalendarCheck },
  { to: '/order', label: 'Order Ahead', icon: ShoppingBag },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const initial = user?.fullName?.charAt(0).toUpperCase() || '?';

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          Tavola
        </Link>

        <nav className="nav-links">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
              >
              <Icon size={20} strokeWidth={2} className="nav-pill-icon" />                
              <span>{l.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="nav-auth">
          {user ? (
            <div className="nav-account">
              <span className="nav-avatar" title={user.fullName}>{initial}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btnoutline">
                Log In
              </Link>
              <Link to="/signup" className="btnprimary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}