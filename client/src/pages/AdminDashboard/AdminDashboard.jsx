import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import api from '../../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [usersList, setUsersList]   = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [smsModal, setSmsModal]     = useState(null);  // { userId, userName }
  const [smsMsg, setSmsMsg]         = useState('');
  const [smsLoading, setSmsLoading] = useState(false);
  const [actionMsg, setActionMsg]   = useState('');

  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
      ]);
      setUsersList(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to fetch admin data. Ensure you are logged in as administrator.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showAction = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsersList((prev) => prev.filter((u) => u._id !== id));
      showAction('✅ User deleted successfully');
    } catch (err) {
      showAction('❌ ' + (err.response?.data?.message || 'Failed to delete user'));
    }
  };

  const handleToggleAutomation = async (id, currentPaused) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/pause-automation`);
      setUsersList((prev) =>
        prev.map((u) => u._id === id ? { ...u, automationPaused: data.automationPaused } : u)
      );
      showAction(`✅ ${data.message}`);
    } catch (err) {
      showAction('❌ Failed to toggle automation');
    }
  };

  const handleSendCustomSMS = async () => {
    if (!smsMsg.trim()) return;
    setSmsLoading(true);
    try {
      const { data } = await api.post(`/admin/users/${smsModal.userId}/send-sms`, {
        message: smsMsg,
      });
      showAction(`✅ ${data.message}`);
      setSmsModal(null);
      setSmsMsg('');
    } catch (err) {
      showAction('❌ ' + (err.response?.data?.message || 'SMS failed'));
    } finally {
      setSmsLoading(false);
    }
  };

  const fmt = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleString([], {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="admin-page">
      <Navbar />

      <main className="admin-main">
        {/* ── Header ── */}
        <div className="admin-header">
          <h1>Admin <span>Dashboard</span></h1>
          <p>Monitor users, control automation sequences, and send custom messages.</p>
        </div>

        {/* ── Stats Cards ── */}
        {stats && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">👥</div>
              <div>
                <div className="admin-stat-value">{stats.total}</div>
                <div className="admin-stat-label">Total Users</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">📬</div>
              <div>
                <div className="admin-stat-value">{stats.openRate}%</div>
                <div className="admin-stat-label">Email Open Rate</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">📱</div>
              <div>
                <div className="admin-stat-value">{stats.smsSent}</div>
                <div className="admin-stat-label">SMS Follow-ups Sent</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">⏸️</div>
              <div>
                <div className="admin-stat-value">{stats.paused}</div>
                <div className="admin-stat-label">Automation Paused</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">🆕</div>
              <div>
                <div className="admin-stat-value">{stats.recent7Days}</div>
                <div className="admin-stat-label">New (7 days)</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Action Message Toast ── */}
        {actionMsg && <div className="admin-toast">{actionMsg}</div>}
        {error     && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loader">
            <div className="admin-spinner" />
            <p>Loading dashboard data…</p>
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
                            {u.avatar
                              ? <img src={u.avatar} alt={u.name} />
                              : u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{u.name}</strong>
                            <div className="admin-meta">
                              {u.phone ? u.phone : <span className="no-phone">No phone</span>}
                            </div>
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
                          onClick={() => handleToggleAutomation(u._id, u.automationPaused)}
                          title={u.automationPaused ? 'Click to resume automation' : 'Click to pause automation'}
                        >
                          {u.automationPaused ? '⏸ Paused' : '▶ Active'}
                        </button>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="action-btn sms-btn"
                            onClick={() => setSmsModal({ userId: u._id, userName: u.name })}
                            title="Send Custom SMS"
                          >
                            📱 SMS
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(u._id)}
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

              {usersList.length === 0 && (
                <div className="admin-empty">
                  <p>🎉 No regular users found yet.</p>
                </div>
              )}
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
                      <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {u.role}
                      </span>
                    </div>
                  </div>
                  <div className="admin-card-row">
                    <span className="admin-card-label">Email</span>
                    <div className="email-status-cell">
                      <span className={`status-dot ${u.welcomeEmailOpened ? 'dot-green' : 'dot-orange'}`} />
                      {u.welcomeEmailOpened ? 'Opened' : `Unopened (${u.reminderCount || 0} sent)`}
                    </div>
                  </div>
                  <div className="admin-card-row">
                    <span className="admin-card-label">Joined</span>
                    <span>{fmt(u.createdAt)}</span>
                  </div>
                  <div className="admin-card-actions">
                    <button
                      className={`automation-toggle ${u.automationPaused ? 'paused' : 'active'}`}
                      onClick={() => handleToggleAutomation(u._id, u.automationPaused)}
                    >
                      {u.automationPaused ? '⏸ Paused' : '▶ Active'}
                    </button>
                    <button
                      className="action-btn sms-btn"
                      onClick={() => setSmsModal({ userId: u._id, userName: u.name })}
                    >
                      📱 SMS
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(u._id)}
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
              <br /><small>This will pause automated messages for this user.</small>
            </p>
            <textarea
              className="modal-textarea"
              rows={5}
              placeholder="Type your custom SMS message here…"
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

      <Footer />
    </div>
  );
};

export default AdminDashboard;
