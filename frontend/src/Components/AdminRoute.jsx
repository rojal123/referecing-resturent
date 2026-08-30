import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';

// Wrap the admin route with this. Sends non-logged-in visitors to
// /admin/login (a separate URL/page from the customer login), and
// logged-in-but-not-admin visitors back to the homepage.
export default function AdminRoute({ children }) {
  const { user, checkingSession } = useAuth();

  if (checkingSession) {
    return null; // avoid a flash of "redirecting" while /auth/me is still loading
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}