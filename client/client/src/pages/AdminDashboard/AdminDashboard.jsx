import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import api from '../../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Protect the route locally as an extra measure
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsersList(data);
      } catch (err) {
        setError('Failed to fetch users. Ensure you are an administrator.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsersList((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString([], {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="admin-page">
      <Navbar />
      
      <main className="admin-main">
        <div className="admin-header">
          <h1>Admin <span>Dashboard</span></h1>
          <p>Monitor your SaaS platform users, roles, and activity.</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loader">Loading users...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Emails Sent</th>
                  <th>SMS Sent</th>
                  <th>Gmail Linked</th>
                  <th>Last Login</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td><span className="stat-badge stat-email">{u.emailsSent}</span></td>
                    <td><span className="stat-badge stat-sms">{u.smsSent}</span></td>
                    <td>
                      {u.gmail_connected ? (
                        <span className="status-badge status-connected">✓</span>
                      ) : (
                        <span className="status-badge status-disconnected">✕</span>
                      )}
                    </td>
                    <td className="admin-date">{formatDate(u.lastLogin)}</td>
                    <td className="admin-date">{formatDate(u.createdAt)}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(u._id)}
                        disabled={u.role === 'admin' && user._id === u._id}
                        style={{ 
                          padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', 
                          color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', 
                          borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
                          opacity: (u.role === 'admin' && user._id === u._id) ? 0.3 : 1
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {usersList.length === 0 && (
              <div className="admin-empty">No users found.</div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
