import { useState, useEffect, useRef } from 'react';
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
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateProfile({ avatar: reader.result });
      } catch (err) {
        console.error('Failed to update avatar', err);
      }
    };
    reader.readAsDataURL(file);
  };

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
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <img 
                src={user.avatar || 'https://via.placeholder.com/42'} 
                alt="Profile" 
                className="nav-avatar" 
                onClick={handleAvatarClick}
                title="Click to update profile image"
                style={{ cursor: 'pointer' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/42';
                }}
              />
              {user.role === 'admin' && <Link to="/admin" className="btn-outline">Admin Panel</Link>}
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
              {user.role === 'admin' && <Link to="/admin" className="btn-outline" onClick={() => setOpen(false)}>Admin Panel</Link>}
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
