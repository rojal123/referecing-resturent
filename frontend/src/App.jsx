import { Routes, Route } from 'react-router-dom';
import PublicLayout from './Components/PublicLayout.jsx';

import Home from './Pages/Root/Home.jsx';
import About from './Pages/Root/About.jsx';
import Order from './Pages/Root/Order.jsx'; 
import Booking from './Pages/Root/Booking.jsx';
import Contact from './Pages/Root/Contact.jsx';

import NotFound from './Pages/Errorpage/404.jsx';

import Login from './Pages/Auth/Login.jsx';
import Signup from './Pages/Auth/Signup.jsx';
import ResetPassword from './Pages/Auth/ResetPassword.jsx';
import ForgotPassword from './Pages/Auth/Forgetpassword.jsx';

import AdminRoute from './Components/AdminRoute.jsx';
import AdminLayout from './Components/AdminLayout.jsx';

import Orders from './Pages/admin/Orders/Orders.jsx';
import Report from './Pages/admin/Report/Report.jsx';
import AdminMenu from './Pages/admin/Menu/Menu.jsx';
import Bookings from './Pages/admin/Booking/Bookings.jsx';
import Dashboard from './Pages/admin/DashBoard/Dashboard.jsx';
import Customers from './Pages/admin/Customer/Customers.jsx';
import AdminReviews from './Pages/admin/Reviews/Reviews.jsx';
import AddEditDish from './Pages/admin/Booking/AddEditDish.jsx';
import Notifications from './Pages/admin/Notification/Notifications.jsx';

export default function App() {
  return (
    <Routes>
      {/* Login/Signup sit outside PublicLayout on purpose -- no Navbar/Footer
          on these two, same reasoning as the admin area below. */}
     <Route path="/login" element={<Login />} />
     <Route path="/signup" element={<Signup />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />
     <Route path="/reset-password" element={<ResetPassword />} />
     <Route path="*" element={<NotFound />} />

      {/* Public site: shares the Navbar + Footer via PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/order" element={<Order />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Admin area: its own sidebar layout, no public Navbar/Footer.
          Each item below is its own page/URL, e.g. /admin/bookings */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="orders" element={<Orders />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="menu/new" element={<AddEditDish />} />
        <Route path="menu/:id/edit" element={<AddEditDish />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="report" element={<Report />} />
      </Route>
    </Routes>
  );
}