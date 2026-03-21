import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">🌐 Click2<span>Website</span></Link>
          <p>Premium Web Development Services for Hospitals, Colleges, Businesses, LMS Portals, and Portfolios.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="GitHub">🐙</a>
            <a href="#" aria-label="Instagram">📸</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/services#pricing">Pricing</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:sasindragandla@gmail.com">📧 sasindragandla@gmail.com</a></li>
            <li><a href="tel:+919959732476">📱 +91 9959732476</a></li>
            <li><span>📍 India</span></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Click2Website. All rights reserved.</p>
        <p>Built with ❤️ in India</p>
      </div>
    </footer>
  );
}
