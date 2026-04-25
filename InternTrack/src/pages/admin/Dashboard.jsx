import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../services/admin.service';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError('System error: Failed to pull network stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
         <div className="skeleton skeleton-text" style={{ width: '300px', height: '40px', marginBottom: '1rem' }}></div>
         <div className="skeleton skeleton-text" style={{ width: '400px', height: '20px', marginBottom: '2.5rem' }}></div>
         <div className="stats-grid mb-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '12px' }}></div>)}
         </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="page-container flex-center">
        <div className="empty-state" style={{ padding: '6rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3>System Error</h3>
          <p className="text-muted">{error || 'Data unavailable'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header mb-4" style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">System Overview</h1>
        <p className="page-subtitle">Global metrics for the JobNova network</p>
      </div>

      <div className="stats-grid mt-4">
        {/* Total Operators */}
        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #ff007f, #ffb3d9)' }}></div>
          <h3 style={{ letterSpacing: '1px' }}>Total Operators</h3>
          <p className="stat-value" style={{ color: '#ffb3d9', textShadow: '0 0 10px rgba(255, 0, 127, 0.4)' }}>{stats.totalUsers}</p>
        </div>

        {/* Total Applications */}
        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--primary), var(--secondary))' }}></div>
          <h3 style={{ letterSpacing: '1px' }}>Total Apps Tracked</h3>
          <p className="stat-value" style={{ color: 'var(--primary)', textShadow: '0 0 10px rgba(0, 210, 255, 0.4)' }}>{stats.totalApplications}</p>
        </div>

        {/* Active Interviews */}
        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #00d2ff, #3a7bd5)' }}></div>
          <h3 style={{ letterSpacing: '1px' }}>Network Interfaces</h3>
          <p className="stat-value" style={{ color: 'var(--primary)', textShadow: '0 0 10px rgba(0, 210, 255, 0.4)' }}>{stats.activeInterviews}</p>
        </div>

        {/* Offers Secured */}
        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #00ff7f, #3a7bd5)' }}></div>
          <h3 style={{ letterSpacing: '1px' }}>Offers Secured</h3>
          <p className="stat-value" style={{ color: '#00ff7f', textShadow: '0 0 10px rgba(0, 255, 127, 0.4)' }}>{stats.offersSecured}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
