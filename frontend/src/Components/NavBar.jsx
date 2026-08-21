import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import logo from '../assets/2.png';
import './navbar.css';

const links = [
  { to: '/booking', label: 'Reserve' },
  { to: '/order', label: 'Menu' },
  { to: '/about', label: 'About'},
  { to: '/contact', label: 'Contact'}
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