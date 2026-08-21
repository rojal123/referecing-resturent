import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
  return (
      <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <h3>Tavola</h3>
          <p>Seasonal Italian cooking in the heart of the city.</p>
          <p>Reserve a table or order ahead for pickup.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/order">Menu</Link>
          <Link to="/booking">Reserve</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>12 Lakeside Avenue, Kathmandu</p>
          <p>+977 12345678</p>
          <p>hello@tavola-restaurant.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="wrap">
          <p>© 2026 Tavola Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}