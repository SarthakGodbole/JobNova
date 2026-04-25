import React, { useState, useEffect } from 'react';
import { getAdminUsers } from '../../services/admin.service';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAdminUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch operators');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header mb-4">
        <h1 className="page-title">Operator Management</h1>
        <p className="page-subtitle">View all registered users on the network</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '100%', padding: '1rem', animation: 'none', border: '1px solid var(--border-color)' }}>
        
        {error && <div className="alert-error" style={{ margin: '1rem' }}>{error}</div>}

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operator Name</th>
                <th>Network Alias (Email)</th>
                <th>Clearance Level</th>
                <th>Initialization Date</th>
                <th className="text-center">Protocol Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                /* Skeleton Loading Rows */
                [1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td><div className="skeleton skeleton-text" style={{ width: '70%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '85%' }}></div></td>
                    <td><div className="skeleton skeleton-badge" style={{ margin: 0 }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                         <div className="skeleton" style={{ width: '50px', height: '28px', borderRadius: '6px' }}></div>
                         <div className="skeleton" style={{ width: '50px', height: '28px', borderRadius: '6px' }}></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                /* Empty state */
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="empty-state" style={{ padding: '3rem 1rem', border: 'none', background: 'transparent' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👤</div>
                      <h4>No operators found.</h4>
                    </div>
                  </td>
                </tr>
              ) : (
                /* Application Data */
                users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'status-rejected' : 'status-applied'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span className="badge-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-muted">{new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="actions-cell">
                      <button className="btn-secondary small" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View</button>
                      {u.role !== 'admin' && (
                        <button className="btn-danger small ml-2" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Ban</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
