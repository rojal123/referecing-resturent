import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';

// Wrap any <Route element={...}> that should only be reachable when logged in.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
