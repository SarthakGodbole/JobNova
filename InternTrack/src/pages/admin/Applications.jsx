import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/StatusBadge';
import { getAdminApplications } from '../../services/admin.service';

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const data = await getAdminApplications();
        setApps(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch global applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header flex-between mb-4">
        <div>
          <h1 className="page-title">Global Applications</h1>
          <p className="page-subtitle">Monitoring all network missions</p>
        </div>
      </div>

      <div
        className="glass-panel"
        style={{
          maxWidth: '100%',
          padding: '1rem',
          animation: 'none',
          border: '1px solid var(--border-color)',
        }}
      >
        {error && <div className="alert-error" style={{ margin: '1rem' }}>{error}</div>}

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td><div className="skeleton skeleton-text" style={{ width: '80%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '60%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '70%' }}></div></td>
                    <td><div className="skeleton skeleton-badge" style={{ margin: 0 }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
                  </tr>
                ))
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div
                      className="empty-state"
                      style={{ padding: '3rem 1rem', border: 'none', background: 'transparent' }}
                    >
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📡</div>
                      <h4>No global missions found.</h4>
                      <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                        The network is currently quiet.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                apps.map((a) => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 600 }}>
                      {a.user?.email || a.user?.name || 'Unknown User'}
                    </td>
                    <td>{a.company}</td>
                    <td>{a.role}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td className="text-muted">
                      {a.appliedDate
                        ? new Date(a.appliedDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
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

export default Applications;