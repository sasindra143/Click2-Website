import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import '../styles/auth.css';

export default function ResetPassword() {
  const { token }                   = useParams();
  const navigate                    = useNavigate();
  const [form, setForm]             = useState({ password: '', confirmPassword: '' });
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  // Validate the token exists
  useEffect(() => {
    if (!token) navigate('/forgot-password');
  }, [token, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      setDone(true);
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
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

        {done ? (
          <div style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)',
            color: '#34d399', borderRadius: '16px', padding: '2rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.6rem' }}>Password Reset!</h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              Your password has been successfully updated.
              Redirecting you to the login page in a few seconds…
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
              Sign In Now →
            </Link>
          </div>
        ) : (
          <>
            <h1 className="auth-title">Set New Password</h1>
            <p className="auth-subtitle">Choose a strong password for your account.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label htmlFor="password">New Password</label>
                <input
                  id="password" name="password" type="password" required
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                />
              </div>
              <div className="field-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword" name="confirmPassword" type="password" required
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Repeat new password"
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? '🔐 Saving…' : '🔑 Reset Password →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
