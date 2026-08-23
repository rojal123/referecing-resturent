import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import logo from '../assets/2.png';
import './navbar.css';

const links = [
  { to: '/booking', label: 'Reserve' },
  { to: '/menu', label: 'Menu' },
  { to: '/order', label: 'Order' },
  { to: '/about', label: 'About'},
  { to: '/contact', label: 'Contact'}
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    setOpen(false);
    logout();
    navigate('/');
  }

  const initial = user?.fullName?.charAt(0).toUpperCase() || '?';

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <img src={logo} alt="Tavola" className="nav-logo" />
          Tavola
        </Link>

        <nav className="nav-links">
          {links.map((l) => {
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
              >              
              <span>{l.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="nav-auth">
          {user ? (
            <div className="nav-account" ref={menuRef}>
              <button
                type="button"
                className="nav-account-trigger"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                <span className="nav-avatar" title={user.fullName}>{initial}</span>
                <span className="nav-account-name">{user.fullName?.split(' ')[0]}</span>
                <svg
                  className={`nav-chevron ${open ? 'open' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {open && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <span className="nav-dropdown-name">{user.fullName}</span>
                    <span className="nav-dropdown-email">{user.email}</span>
                  </div>

                  <div className="nav-dropdown-divider" />

                  <Link to="/dashboard" className="nav-dropdown-item" onClick={() => setOpen(false)}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="3" width="8" height="8" rx="1.5" />
                      <rect x="13" y="3" width="8" height="8" rx="1.5" />
                      <rect x="3" y="13" width="8" height="8" rx="1.5" />
                      <rect x="13" y="13" width="8" height="8" rx="1.5" />
                    </svg>
                    Dashboard
                  </Link>

                  <Link to="/my-bookings" className="nav-dropdown-item" onClick={() => setOpen(false)}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
                    </svg>
                    My Bookings
                  </Link>

                  <Link to="/my-orders" className="nav-dropdown-item" onClick={() => setOpen(false)}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
                      <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
                    </svg>
                    My Orders
                  </Link>

                  <div className="nav-dropdown-divider" />

                  <button type="button" className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
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