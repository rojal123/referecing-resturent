import { Outlet } from 'react-router-dom';
import Navbar from './NavBar.jsx';
import Footer from './Footer.jsx';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
