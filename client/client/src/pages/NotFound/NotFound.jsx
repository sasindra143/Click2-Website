import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/Navbar/Navbar';
import './NotFound.css';

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 – Page Not Found | MailFlow360</title></Helmet>
      <Navbar />
      <div className="notfound-page">
        <div className="notfound-inner">
          <div className="notfound-code">404</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div className="notfound-btns">
            <Link to="/" className="cta-primary">🏠 Go Home</Link>
            <Link to="/contact" className="cta-secondary">Contact Support</Link>
          </div>
        </div>
      </div>
    </>
  );
}
