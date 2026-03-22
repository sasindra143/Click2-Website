import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef();

  // Subtle 3D mouse tilt effect on the card
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.01)`;
    };
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { name, email, phone, password } = form;
      // register() returns user data & tokens — auto-login included
      const userData = await register(name, email, password, phone);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    } catch (err) {
      if (!err.response) {
        setError('Server is waking up. Please wait 30 seconds and try again.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" ref={cardRef} style={{ transition: 'transform 0.15s ease' }}>
        <Link to="/" className="auth-close-btn" title="Go Home">✕</Link>

        <div className="auth-logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">Click2<span>Website</span></span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start your digital transformation journey today</p>

        {error && <div className="auth-error">{error}</div>}

        {success ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399', borderRadius: '14px', padding: '2.5rem', textAlign: 'center',
            animation: 'cardReveal 0.4s ease both', display: 'flex', flexDirection: 'column', gap: '1rem'
          }}>
            <div style={{ fontSize: '3.5rem' }}>🎉</div>
            <h3 style={{ margin: '0', color: '#fff', fontSize: '1.4rem' }}>Registration Successful!</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
              Your account has been created successfully. Welcome to Click2Website! We have sent a welcome email to your inbox.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/" className="auth-btn" style={{ textDecoration: 'none', display: 'inline-block', background: '#3b82f6', color: '#fff' }}>
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" required
                value={form.name} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" autoComplete="email" required
                value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="field-group">
              <label htmlFor="phone">Phone Number <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional)</span></label>
              <input id="phone" name="phone" type="tel"
                value={form.phone} onChange={handleChange} placeholder="+91 9999999999" />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required
                value={form.password} onChange={handleChange} placeholder="Min. 6 characters" />
            </div>
            <div className="field-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required
                value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? '✨ Creating Account…' : 'Create Account & Sign In →'}
            </button>
          </form>
        )}

        {!success && (
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
