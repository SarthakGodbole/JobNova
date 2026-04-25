import React, { useState, useEffect } from 'react';
import { getApplicationStats } from '../../services/application.service';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, interviewing: 0, offered: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getApplicationStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load telemetry stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Initializing Dashboard...</div>;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <motion.div 
      className="page-container" 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}
    >
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Dashboard</h1>
        <p className="page-subtitle" style={{ marginTop: '0.5rem' }}>Overview of your application progress</p>
      </div>

      <div className="stats-grid" style={{ 
         display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
         gap: '1.5rem', alignItems: 'stretch' 
      }}>
        <motion.div 
          className="stat-card" 
          whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0, 210, 255, 0.15)' }} 
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '16px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }}
        >
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 500 }}>Total Applications</h3>
          <p className="stat-value" style={{ fontSize: '3.5rem', fontWeight: 700, margin: 'auto 0', color: 'var(--text-main)', lineHeight: 1 }}>{stats.total}</p>
        </motion.div>

        <motion.div 
          className="stat-card" 
          whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0, 210, 255, 0.15)' }} 
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '16px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }}
        >
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 500 }}>Active Interviews</h3>
          <p className="stat-value" style={{ fontSize: '3.5rem', fontWeight: 700, margin: 'auto 0', color: 'var(--text-main)', lineHeight: 1 }}>{stats.interviewing}</p>
        </motion.div>

        <motion.div 
          className="stat-card" 
          whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0, 210, 255, 0.15)' }} 
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '16px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }}
        >
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 500 }}>Offers Secured</h3>
          <p className="stat-value" style={{ fontSize: '3.5rem', fontWeight: 700, margin: 'auto 0', color: 'var(--text-main)', lineHeight: 1 }}>{stats.offered}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
