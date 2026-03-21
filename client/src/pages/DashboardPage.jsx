import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('overview');
  const [gmailStatus, setGmailStatus] = useState({
    connected: user?.gmail_connected || false,
    gmail_email: user?.gmail_email || null,
  });

  // Email form
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '' });
  const [emailResult, setEmailResult] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // SMS form
  const [smsForm, setSmsForm] = useState({ to: '', message: '' });
  const [smsResult, setSmsResult] = useState(null);
  const [smsLoading, setSmsLoading] = useState(false);

  // Handle Google OAuth redirect
  useEffect(() => {
    const googleParam = searchParams.get('google');
    if (googleParam === 'success') {
      refreshUser().then((u) => {
        setGmailStatus({ connected: u.gmail_connected, gmail_email: u.gmail_email });
      });
    }
  }, [searchParams, refreshUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const connectGmail = async () => {
    try {
      const { data } = await api.get('/google/auth-url');
      window.location.href = data.url;
    } catch (err) {
      alert('Failed to get Google auth URL: ' + (err.response?.data?.message || err.message));
    }
  };

  const disconnectGmail = async () => {
    if (!window.confirm('Disconnect Gmail account?')) return;
    await api.post('/google/disconnect');
    setGmailStatus({ connected: false, gmail_email: null });
    await refreshUser();
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailResult(null);
    try {
      const { data } = await api.post('/email/send', emailForm);
      setEmailResult({ success: true, message: data.message });
      setEmailForm({ to: '', subject: '', body: '' });
      refreshUser();
    } catch (err) {
      setEmailResult({ success: false, message: err.response?.data?.message || 'Failed to send email' });
    } finally {
      setEmailLoading(false);
    }
  };

  const sendSMS = async (e) => {
    e.preventDefault();
    setSmsLoading(true);
    setSmsResult(null);
    try {
      const { data } = await api.post('/sms/send', smsForm);
      setSmsResult({ success: true, message: data.message });
      setSmsForm({ to: '', message: '' });
      refreshUser();
    } catch (err) {
      setSmsResult({ success: false, message: err.response?.data?.message || 'Failed to send SMS' });
    } finally {
      setSmsLoading(false);
    }
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">✉</span>
          <span className="logo-text">MailFlow<span>360</span></span>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: 'overview', icon: '⊞', label: 'Overview' },
            { id: 'email', icon: '📧', label: 'Send Email' },
            { id: 'sms', icon: '💬', label: 'Send SMS' },
            { id: 'settings', icon: '⚙', label: 'Gmail Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-btn" title="Logout" onClick={handleLogout}>⎋</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">Welcome back, {user?.name}! Here's your overview.</p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon email-icon">📧</div>
                <div className="stat-body">
                  <span className="stat-value">{user?.emailsSent ?? 0}</span>
                  <span className="stat-label">Emails Sent</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon sms-icon">💬</div>
                <div className="stat-body">
                  <span className="stat-value">{user?.smsSent ?? 0}</span>
                  <span className="stat-label">SMS Sent</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon gmail-icon">🔗</div>
                <div className="stat-body">
                  <span className="stat-value">{user?.gmail_connected ? 'Active' : 'Not linked'}</span>
                  <span className="stat-label">Gmail Status</span>
                </div>
              </div>
            </div>

            {!user?.gmail_connected && (
              <div className="notice-card">
                <span className="notice-icon">⚠️</span>
                <div>
                  <strong>Gmail not connected</strong>
                  <p>Connect your Gmail account in <button className="inline-link" onClick={() => setActiveTab('settings')}>Gmail Settings</button> to start sending emails.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Email ── */}
        {activeTab === 'email' && (
          <div className="tab-content">
            <h1 className="page-title">Send Email</h1>
            <p className="page-sub">Send emails via your connected Gmail account.</p>

            {!user?.gmail_connected && (
              <div className="notice-card">
                <span className="notice-icon">⚠️</span>
                <div>
                  <strong>Gmail not connected</strong>
                  <p>Please <button className="inline-link" onClick={() => setActiveTab('settings')}>connect Gmail</button> first.</p>
                </div>
              </div>
            )}

            <form className="form-card" onSubmit={sendEmail}>
              <div className="field-group">
                <label>To</label>
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm((p) => ({ ...p, to: e.target.value }))}
                  required
                />
              </div>
              <div className="field-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="Email subject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm((p) => ({ ...p, subject: e.target.value }))}
                  required
                />
              </div>
              <div className="field-group">
                <label>Message (HTML supported)</label>
                <textarea
                  rows={8}
                  placeholder="Write your email body here…"
                  value={emailForm.body}
                  onChange={(e) => setEmailForm((p) => ({ ...p, body: e.target.value }))}
                  required
                />
              </div>
              {emailResult && (
                <div className={`result-msg ${emailResult.success ? 'success' : 'error'}`}>
                  {emailResult.message}
                </div>
              )}
              <button type="submit" className="submit-btn" disabled={emailLoading || !user?.gmail_connected}>
                {emailLoading ? 'Sending…' : '📤 Send Email'}
              </button>
            </form>
          </div>
        )}

        {/* ── SMS ── */}
        {activeTab === 'sms' && (
          <div className="tab-content">
            <h1 className="page-title">Send SMS</h1>
            <p className="page-sub">Send text messages via Twilio.</p>

            <form className="form-card" onSubmit={sendSMS}>
              <div className="field-group">
                <label>To (Phone Number)</label>
                <input
                  type="tel"
                  placeholder="+1234567890"
                  value={smsForm.to}
                  onChange={(e) => setSmsForm((p) => ({ ...p, to: e.target.value }))}
                  required
                />
              </div>
              <div className="field-group">
                <label>Message</label>
                <textarea
                  rows={5}
                  placeholder="Your SMS message…"
                  maxLength={1600}
                  value={smsForm.message}
                  onChange={(e) => setSmsForm((p) => ({ ...p, message: e.target.value }))}
                  required
                />
                <span className="char-count">{smsForm.message.length}/1600</span>
              </div>
              {smsResult && (
                <div className={`result-msg ${smsResult.success ? 'success' : 'error'}`}>
                  {smsResult.message}
                </div>
              )}
              <button type="submit" className="submit-btn" disabled={smsLoading}>
                {smsLoading ? 'Sending…' : '💬 Send SMS'}
              </button>
            </form>
          </div>
        )}

        {/* ── Settings ── */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <h1 className="page-title">Gmail Settings</h1>
            <p className="page-sub">Connect your Gmail account to send emails.</p>

            <div className="settings-card">
              <div className="settings-row">
                <div className="settings-info">
                  <span className="settings-icon">📧</span>
                  <div>
                    <strong>Gmail Account</strong>
                    <p>{gmailStatus.connected ? gmailStatus.gmail_email : 'Not connected'}</p>
                  </div>
                </div>
                <div className="settings-badge" data-status={gmailStatus.connected ? 'connected' : 'disconnected'}>
                  {gmailStatus.connected ? '✓ Connected' : '✗ Disconnected'}
                </div>
              </div>

              {gmailStatus.connected ? (
                <button className="danger-btn" onClick={disconnectGmail}>Disconnect Gmail</button>
              ) : (
                <button className="submit-btn" onClick={connectGmail}>
                  🔗 Connect Gmail Account
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
