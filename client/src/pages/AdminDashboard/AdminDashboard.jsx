import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import api from '../../api/axios';
import './AdminDashboard.css';

/* ── Custom Dialog (replaces window.confirm / window.alert) ── */
const Dialog = ({ type, title, message, onConfirm, onClose, loading }) => (
  <div className="dialog-overlay" onClick={onClose}>
    <div className={`dialog-box dialog-${type}`} onClick={(e) => e.stopPropagation()}>
      <div className="dialog-icon">
        {type === 'confirm' && '⚠️'}
        {type === 'success' && '✅'}
        {type === 'error'   && '❌'}
      </div>
      <h3 className="dialog-title">{title}</h3>
      <p className="dialog-message">{message}</p>
      <div className="dialog-actions">
        {type === 'confirm' ? (
          <>
            <button className="dialog-btn dialog-cancel" onClick={onClose}>Cancel</button>
            <button
              className="dialog-btn dialog-confirm-btn"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </>
        ) : (
          <button className="dialog-btn dialog-ok" onClick={onClose}>Got it</button>
        )}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user }  = useAuth();
  const [usersList, setUsersList]   = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Custom dialog state
  const [dialog, setDialog] = useState(null);
  // { type: 'confirm'|'success'|'error', title, message, onConfirm?, loading? }

  // SMS modal state
  const [smsModal, setSmsModal]     = useState(null); // { userId, userName }
  const [smsMsg, setSmsMsg]         = useState('');
  const [smsLoading, setSmsLoading] = useState(false);

  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const showDialog = (type, title, message, onConfirm = null) => {
    setDialog({ type, title, message, onConfirm, loading: false });
  };

  const closeDialog = () => setDialog(null);

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
      ]);
      setUsersList(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Delete ── */
  const handleDelete = (id, name) => {
    showDialog(
      'confirm',
      'Delete User',
      `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`,
      async () => {
        setDialog((prev) => ({ ...prev, loading: true }));
        try {
          await api.delete(`/admin/users/${id}`);
          setUsersList((prev) => prev.filter((u) => u._id !== id));
          showDialog('success', 'User Deleted', `"${name}" has been removed from the platform.`);
        } catch (err) {
          showDialog('error', 'Delete Failed', err.response?.data?.message || 'Could not delete user. Try again.');
        }
      }
    );
  };

  /* ── Toggle Automation ── */
  const handleToggleAutomation = async (id, name, isPaused) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/pause-automation`);
      setUsersList((prev) =>
        prev.map((u) => u._id === id ? { ...u, automationPaused: data.automationPaused } : u)
      );
    } catch (err) {
      showDialog('error', 'Error', 'Failed to toggle automation.');
    }
  };

  /* ── Custom SMS ── */
  const handleSendCustomSMS = async () => {
    if (!smsMsg.trim()) return;
    setSmsLoading(true);
    try {
      const { data } = await api.post(`/admin/users/${smsModal.userId}/send-sms`, { message: smsMsg });
      setSmsModal(null);
      setSmsMsg('');
      showDialog('success', 'SMS Sent!', data.message);
    } catch (err) {
      showDialog('error', 'SMS Failed', err.response?.data?.message || 'Could not send SMS.');
    } finally {
      setSmsLoading(false);
    }
  };

  const fmt = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="admin-page">
      <Navbar />

      <main className="admin-main">
        {/* ── Header ── */}
        <div className="admin-header">
          <h1>Admin <span>Dashboard</span></h1>
          <p>Monitor users, control email/SMS automations, and manage your platform.</p>
        </div>

        {/* ── Stats Cards ── */}
        {stats && (
          <div className="admin-stats-grid">
            {[
              { icon: '👥', value: stats.total,       label: 'Total Users' },
              { icon: '📬', value: `${stats.openRate}%`, label: 'Email Open Rate' },
              { icon: '📱', value: stats.smsSent,     label: 'SMS Sent' },
              { icon: '⏸️', value: stats.paused,      label: 'Automation Paused' },
              { icon: '🆕', value: stats.recent7Days, label: 'New (7 days)' },
            ].map((s) => (
              <div className="admin-stat-card" key={s.label}>
                <div className="admin-stat-icon">{s.icon}</div>
                <div>
                  <div className="admin-stat-value">{s.value}</div>
                  <div className="admin-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loader">
            <div className="admin-spinner" />
            <p>Loading dashboard…</p>
          </div>
        ) : (
          <>
            <div className="admin-section-title">
              <h2>👥 User Management</h2>
              <span className="admin-count">{usersList.length} users</span>
            </div>

            {/* ── Desktop Table ── */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Email Status</th>
                    <th>Automation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-avatar">
                            {u.avatar ? <img src={u.avatar} alt={u.name} /> : u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{u.name}</strong>
                            <div className="admin-meta">{u.phone || <span className="no-phone">No phone</span>}</div>
                          </div>
                        </div>
                      </td>
                      <td className="admin-email">{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="admin-date">{fmt(u.createdAt)}</td>
                      <td>
                        <div className="email-status-cell">
                          <span className={`status-dot ${u.welcomeEmailOpened ? 'dot-green' : 'dot-orange'}`} />
                          {u.welcomeEmailOpened ? 'Opened' : `Not opened (${u.reminderCount || 0} reminders)`}
                        </div>
                      </td>
                      <td>
                        <button
                          className={`automation-toggle ${u.automationPaused ? 'paused' : 'active'}`}
                          onClick={() => handleToggleAutomation(u._id, u.name, u.automationPaused)}
                        >
                          {u.automationPaused ? '⏸ Paused' : '▶ Active'}
                        </button>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="action-btn sms-btn"
                            onClick={() => setSmsModal({ userId: u._id, userName: u.name })}
                          >
                            📱 SMS
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(u._id, u.name)}
                            disabled={u.role === 'admin' && user._id === u._id}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {usersList.length === 0 && <div className="admin-empty"><p>No users found yet.</p></div>}
            </div>

            {/* ── Mobile Cards ── */}
            <div className="admin-cards-mobile">
              {usersList.map((u) => (
                <div key={u._id} className="admin-user-card">
                  <div className="admin-card-top">
                    <div className="admin-avatar">
                      {u.avatar ? <img src={u.avatar} alt={u.name} /> : u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-card-info">
                      <strong>{u.name}</strong>
                      <span className="admin-email">{u.email}</span>
                      <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>{u.role}</span>
                    </div>
                  </div>
                  <div className="admin-card-row">
                    <span className="admin-card-label">Email</span>
                    <div className="email-status-cell">
                      <span className={`status-dot ${u.welcomeEmailOpened ? 'dot-green' : 'dot-orange'}`} />
                      {u.welcomeEmailOpened ? 'Opened' : `Unopened (${u.reminderCount || 0} reminders)`}
                    </div>
                  </div>
                  <div className="admin-card-row">
                    <span className="admin-card-label">Joined</span>
                    <span>{fmt(u.createdAt)}</span>
                  </div>
                  <div className="admin-card-actions">
                    <button
                      className={`automation-toggle ${u.automationPaused ? 'paused' : 'active'}`}
                      onClick={() => handleToggleAutomation(u._id, u.name, u.automationPaused)}
                    >
                      {u.automationPaused ? '⏸ Paused' : '▶ Active'}
                    </button>
                    <button className="action-btn sms-btn" onClick={() => setSmsModal({ userId: u._id, userName: u.name })}>
                      📱 SMS
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(u._id, u.name)}
                      disabled={u.role === 'admin' && user._id === u._id}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Custom SMS Modal ── */}
      {smsModal && (
        <div className="modal-overlay" onClick={() => setSmsModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>📱 Send Custom SMS</h3>
            <p className="modal-subtitle">
              To: <strong>{smsModal.userName}</strong>
              <br /><small>Sending this will pause automated messages for this user.</small>
            </p>
            <textarea
              className="modal-textarea"
              rows={5}
              placeholder="Type your custom message…"
              value={smsMsg}
              onChange={(e) => setSmsMsg(e.target.value)}
            />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setSmsModal(null)}>Cancel</button>
              <button
                className="modal-send"
                onClick={handleSendCustomSMS}
                disabled={!smsMsg.trim() || smsLoading}
              >
                {smsLoading ? 'Sending…' : '📤 Send SMS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Custom HTML Dialog (no browser dialogs) ── */}
      {dialog && (
        <Dialog
          type={dialog.type}
          title={dialog.title}
          message={dialog.message}
          onConfirm={dialog.onConfirm}
          onClose={closeDialog}
          loading={dialog.loading}
        />
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
