import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/auth.css';

export default function ForgotPassword() {
  const [email, setEmail]       = useState('');
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Link to="/" className="auth-close-btn" title="Go Home">✕</Link>

        <div className="auth-logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">Click2<span>Website</span></span>
        </div>

        {sent ? (
          <div style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)',
            color: '#34d399', borderRadius: '16px', padding: '2rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.6rem' }}>Check Your Inbox!</h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              We've sent a password reset link to <strong style={{ color: '#fff' }}>{email}</strong>.
              The link expires in <strong>1 hour</strong>. Check your spam folder too.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block', marginTop: '1.5rem',
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                color: '#fff', padding: '0.7rem 1.8rem',
                borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
              }}
            >
              Back to Login →
            </Link>
          </div>
        ) : (
          <>
            <h1 className="auth-title">Forgot Password?</h1>
            <p className="auth-subtitle">Enter your email and we'll send you a secure reset link.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email" type="email" required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? '✉️ Sending Reset Link…' : '🔑 Send Reset Link →'}
              </button>
            </form>

            <p className="auth-switch">
              Remembered it? <Link to="/login">Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
