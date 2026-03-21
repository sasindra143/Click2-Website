import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import './Dashboard.css';

const TABS = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'email', icon: '📧', label: 'Send Email' },
  { id: 'sms', icon: '📲', label: 'Send SMS' },
  { id: 'gmail', icon: '🔗', label: 'Connect Gmail' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

/* ─────── mock users for demo ─────── */
const MOCK_USERS = [
  { id: 1, name: 'Ramesh', email: 'ramesh@example.com', gmail: true, active: true },
  { id: 2, name: 'Priya', email: 'priya@example.com', gmail: false, active: true },
  { id: 3, name: 'Arjun', email: 'arjun@example.com', gmail: true, active: false },
];

export default function Dashboard() {
  const { user, logout, refreshUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '' });
  const [emailResult, setEmailResult] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);

  const [smsForm, setSmsForm] = useState({ to: '', message: '' });
  const [smsResult, setSmsResult] = useState(null);
  const [smsLoading, setSmsLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [profileResult, setProfileResult] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [user]);

  const [users] = useState(MOCK_USERS);

  useEffect(() => {
    const g = searchParams.get('google');
    if (g === 'success') refreshUser();
  }, [searchParams, refreshUser]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const connectGmail = async () => {
    try {
      const { data } = await api.get('/google/auth-url');
      window.location.href = data.url;
    } catch (e) {
      alert(e.response?.data?.message || 'Could not get Google auth URL');
    }
  };

  const disconnectGmail = async () => {
    if (!confirm('Disconnect Gmail?')) return;
    await api.post('/google/disconnect');
    refreshUser();
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true); setEmailResult(null);
    try {
      const { data } = await api.post('/email/send', emailForm);
      setEmailResult({ ok: true, msg: data.message });
      setEmailForm({ to: '', subject: '', body: '' });
      refreshUser();
    } catch (err) {
      setEmailResult({ ok: false, msg: err.response?.data?.message || 'Failed to send email' });
    } finally { setEmailLoading(false); }
  };

  const sendSMS = async (e) => {
    e.preventDefault();
    setSmsLoading(true); setSmsResult(null);
    try {
      const { data } = await api.post('/sms/send', smsForm);
      setSmsResult({ ok: true, msg: data.message });
      setSmsForm({ to: '', message: '' });
      refreshUser();
    } catch (err) {
      setSmsResult({ ok: false, msg: err.response?.data?.message || 'Failed to send SMS' });
    } finally { setSmsLoading(false); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true); setProfileResult(null);
    try {
      await updateProfile(profileForm);
      setProfileResult({ ok: true, msg: 'Profile updated successfully!' });
    } catch (err) {
      setProfileResult({ ok: false, msg: err.response?.data?.message || 'Failed to update profile' });
    } finally { setProfileLoading(false); }
  };

  return (
    <>
      <Helmet><title>Dashboard – Click2Website</title></Helmet>

      <div className="db-layout">
        {/* ── Overlay for mobile ── */}
        {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ── Sidebar ── */}
        <aside className={`db-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="db-logo">
            <Link to="/" className="db-logo-link">🌐 Click2<span>Website</span></Link>
          </div>

          <nav className="db-nav">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`db-nav-item${tab === t.id ? ' active' : ''}`}
                onClick={() => { setTab(t.id); setSidebarOpen(false); }}
              >
                <span className="db-nav-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
            
            {user?.role === 'admin' && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <Link to="/admin" className="db-nav-item" style={{ textDecoration: 'none' }}>
                  <span className="db-nav-icon">👑</span>
                  <span>Admin Panel</span>
                </Link>
              </div>
            )}
          </nav>

          <div className="db-sidebar-bottom">
            <div className="db-user-meta">
              <div className="db-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <div className="db-user-info">
                <span className="db-user-name">{user?.name}</span>
                <span className="db-user-email">{user?.email}</span>
              </div>
            </div>
            <button className="db-logout" onClick={handleLogout}>⎋ Logout</button>
          </div>
        </aside>

        {/* ── Main area ── */}
        <main className="db-main">
          {/* Mobile topbar */}
          <header className="db-topbar">
            <button className="db-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <span className="db-topbar-title">{TABS.find(t => t.id === tab)?.label}</span>
            <div className="db-topbar-user">Hi, {user?.name?.split(' ')[0]} 👋</div>
          </header>

          <div className="db-content">
            {/* ══ Overview ══ */}
            {tab === 'overview' && (
              <div className="db-section">
                <div className="db-welcome">
                  <div>
                    <h1>Welcome back, {user?.name}! 👋</h1>
                    <p>Here's your communication overview for today.</p>
                  </div>
                  {!user?.gmail_connected && (
                    <button className="cta-primary" onClick={connectGmail}>🔗 Connect Gmail</button>
                  )}
                </div>

                <div className="db-stats">
                  {[
                    { label: 'Emails Sent', val: user?.emailsSent ?? 0, icon: '📧', color: 'purple' },
                    { label: 'SMS Sent',    val: user?.smsSent ?? 0,    icon: '📲', color: 'blue' },
                    { label: 'Gmail',       val: user?.gmail_connected ? 'Active' : 'Not linked', icon: '🔗', color: 'green' },
                    { label: 'Account',     val: 'Pro',                  icon: '⭐', color: 'amber' },
                  ].map(s => (
                    <div key={s.label} className={`db-stat-card c-${s.color}`}>
                      <div className="db-stat-icon">{s.icon}</div>
                      <div>
                        <div className="db-stat-val">{s.val}</div>
                        <div className="db-stat-label">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {!user?.gmail_connected && (
                  <div className="db-notice warning">
                    ⚠️ <strong>Gmail not connected.</strong> Go to <button className="inline-link" onClick={() => setTab('gmail')}>Connect Gmail</button> to send emails.
                  </div>
                )}

                <div className="db-quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="db-quick-grid">
                    {[
                      { icon: '📧', label: 'Send Email', tab: 'email' },
                      { icon: '📲', label: 'Send SMS', tab: 'sms' },
                      { icon: '🔗', label: 'Gmail Settings', tab: 'gmail' },
                      { icon: '👤', label: 'My Profile', tab: 'profile' },
                    ].map(q => (
                      <button key={q.tab} className="db-quick-btn" onClick={() => setTab(q.tab)}>
                        <span>{q.icon}</span>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ Email ══ */}
            {tab === 'email' && (
              <div className="db-section">
                <h1>Send Email 📧</h1>
                <p className="db-subtitle">Send via your connected Gmail account using the Gmail API.</p>

                {!user?.gmail_connected && (
                  <div className="db-notice warning">
                    ⚠️ Gmail not connected. <button className="inline-link" onClick={() => setTab('gmail')}>Connect Gmail first.</button>
                  </div>
                )}

                <form className="db-form" onSubmit={sendEmail}>
                  <div className="db-field">
                    <label>To (Email Address)</label>
                    <input type="email" placeholder="recipient@example.com" value={emailForm.to}
                      onChange={e => setEmailForm(p => ({ ...p, to: e.target.value }))} required />
                  </div>
                  <div className="db-field">
                    <label>Subject</label>
                    <input type="text" placeholder="Email subject" value={emailForm.subject}
                      onChange={e => setEmailForm(p => ({ ...p, subject: e.target.value }))} required />
                  </div>
                  <div className="db-field">
                    <label>Message (HTML supported)</label>
                    <textarea rows={8} placeholder="Write your email body here…" value={emailForm.body}
                      onChange={e => setEmailForm(p => ({ ...p, body: e.target.value }))} required />
                  </div>
                  {emailResult && <div className={`db-result ${emailResult.ok ? 'ok' : 'err'}`}>{emailResult.msg}</div>}
                  <div className="db-form-actions">
                    <button type="submit" className="cta-primary" disabled={emailLoading || !user?.gmail_connected}>
                      {emailLoading ? 'Sending…' : '📤 Send Email'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ══ SMS ══ */}
            {tab === 'sms' && (
              <div className="db-section">
                <h1>Send SMS 📲</h1>
                <p className="db-subtitle">Send text messages instantly via Twilio.</p>
                <form className="db-form" onSubmit={sendSMS}>
                  <div className="db-field">
                    <label>Phone Number (with country code)</label>
                    <input type="tel" placeholder="+91 9876543210" value={smsForm.to}
                      onChange={e => setSmsForm(p => ({ ...p, to: e.target.value }))} required />
                  </div>
                  <div className="db-field">
                    <label>Message ({smsForm.message.length}/160)</label>
                    <textarea rows={5} maxLength={1600} placeholder="Your SMS message…" value={smsForm.message}
                      onChange={e => setSmsForm(p => ({ ...p, message: e.target.value }))} required />
                  </div>
                  {smsResult && <div className={`db-result ${smsResult.ok ? 'ok' : 'err'}`}>{smsResult.msg}</div>}
                  <div className="db-form-actions">
                    <button type="submit" className="cta-primary" disabled={smsLoading}>
                      {smsLoading ? 'Sending…' : '💬 Send SMS'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ══ Gmail ══ */}
            {tab === 'gmail' && (
              <div className="db-section">
                <h1>Connect Gmail 🔗</h1>
                <p className="db-subtitle">Link your Gmail account using Google OAuth 2.0 — no passwords stored.</p>

                <div className="db-gmail-card">
                  <div className="db-gmail-info">
                    <div className="db-gmail-icon">📧</div>
                    <div>
                      <strong>Gmail Account</strong>
                      <p>{user?.gmail_email || 'No account connected'}</p>
                    </div>
                    <span className={`db-badge ${user?.gmail_connected ? 'connected' : 'disconnected'}`}>
                      {user?.gmail_connected ? '✓ Connected' : '✗ Disconnected'}
                    </span>
                  </div>

                  {user?.gmail_connected ? (
                    <div className="db-gmail-actions">
                      <p className="db-gmail-note">✅ Your Gmail is connected. You can now send emails from the <button className="inline-link" onClick={() => setTab('email')}>Email Sender</button>.</p>
                      <button className="danger-btn" onClick={disconnectGmail}>Disconnect Gmail</button>
                    </div>
                  ) : (
                    <div className="db-gmail-actions">
                      <p className="db-gmail-note">Click below to securely link your Gmail account via Google OAuth.</p>
                      <button className="cta-primary" onClick={connectGmail}>🔗 Connect Gmail Account</button>
                    </div>
                  )}
                </div>

                <div className="db-oauth-steps">
                  <h3>How It Works</h3>
                  {['Click "Connect Gmail Account"', 'Login to your Google account', 'Grant permission to send emails', 'Start sending emails instantly!'].map((s, i) => (
                    <div key={i} className="db-oauth-step">
                      <div className="db-step-num">{i + 1}</div>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'profile' && (
              <div className="db-section">
                <h1>My Profile 👤</h1>
                <p className="db-subtitle">Update your personal information and account email.</p>
                <form className="db-form" onSubmit={handleProfileUpdate}>
                  <div className="db-field">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" value={profileForm.name}
                      onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="db-field">
                    <label>Account Email</label>
                    <input type="email" placeholder="you@example.com" value={profileForm.email}
                      onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div className="db-field">
                    <label>Phone Number (Optional)</label>
                    <input type="tel" placeholder="+91 9999999999" value={profileForm.phone}
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  {profileResult && <div className={`db-result ${profileResult.ok ? 'ok' : 'err'}`}>{profileResult.msg}</div>}
                  <div className="db-form-actions">
                    <button type="submit" className="cta-primary" disabled={profileLoading}>
                      {profileLoading ? 'Saving…' : '💾 Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
