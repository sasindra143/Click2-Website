import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="logo-symbol">🌐</span>
          Click2<span>Website</span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA Area */}
        <div className="nav-cta">
          {user ? (
            <div className="nav-user">
              {user.avatar && (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="nav-avatar" 
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <Link to="/dashboard" className="btn-outline">Dashboard</Link>
              <button className="btn-primary" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Get Started Free 🚀</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger${open ? ' active' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
        <div className="mobile-cta">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-outline" onClick={() => setOpen(false)}>Dashboard</Link>
              <button className="btn-primary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>Get Started Free 🚀</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
