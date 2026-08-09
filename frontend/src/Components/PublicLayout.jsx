import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function PublicLayout() {
  const { user } = useAuth();

  // An admin has no business on the customer-facing site -- bounce them
  // straight to the admin panel instead of rendering Home/Menu/Login/etc.
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}