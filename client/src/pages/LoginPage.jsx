import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
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
    setLoading(true);
    try {
      const userData = await login(form.email, form.password);
      if (userData.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
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

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your client portal to continue</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" autoComplete="email" required
              value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div className="field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#a78bfa', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" required
              value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? '✨ Signing In…' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
