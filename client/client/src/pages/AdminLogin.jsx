import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../api/axios';
import '../styles/auth.css';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFirebaseLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send Firebase ID Token to backend for secure verification
      const res = await api.post('/auth/firebase-admin', {
        idToken
      });

      // Backend issued access tokens for Dashboard
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      // Force a full reload so the AuthContext picks up the new token
      window.location.href = '/admin';
      
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled.');
      } else {
        // Expose the EXACT error message so the Admin knows what is wrong in the Firebase config
        setError(`Firebase Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ position: 'relative', borderTop: '4px solid #ef4444' }}>
        <Link to="/" className="auth-close-btn" title="Go Home">✖</Link>
        <div className="auth-logo">
          <span className="logo-icon" style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }}>🛡️</span>
          <span className="logo-text">System<span>Admin</span></span>
        </div>

        <h1 className="auth-title">Authorized Access Only</h1>
        <p className="auth-subtitle">Sign in securely using your Admin Google Account</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form" style={{ marginTop: '2rem' }}>
          <button 
            type="button" 
            className="auth-btn" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#fff', color: '#333' }}
            onClick={handleFirebaseLogin} 
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: '20px' }}/>
            {loading ? 'Authenticating…' : 'Sign In with Google'}
          </button>
        </div>

      </div>
    </div>
  );
}
