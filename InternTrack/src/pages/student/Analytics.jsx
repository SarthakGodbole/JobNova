import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { getAnalytics } from '../../services/application.service';

// Custom Tooltip for premium Recharts design
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: '0 10px 40px 0 var(--shadow-color)',
        color: 'var(--text-main)'
      }}>
        <p style={{ margin: 0, fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>
           {label || payload[0].name}
        </p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
             <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color || entry.payload.fill || 'var(--primary)', boxShadow: `0 0 6px ${entry.color || entry.payload.fill || 'var(--primary)'}` }}></span>
             <span style={{ color: 'var(--text-muted)' }}>Volume: </span>
             <strong style={{ color: entry.color || entry.payload.fill || 'var(--primary)', textShadow: `0 0 8px ${(entry.color || entry.payload.fill || 'var(--primary)')}80` }}>{entry.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const responseData = await getAnalytics();
        setData(responseData);
      } catch (err) {
        setError('Failed to fetch analytics telemetry');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
     return (
        <div className="page-container">
           <div className="skeleton skeleton-text" style={{ width: '300px', height: '40px', marginBottom: '2.5rem' }}></div>
           <div className="stats-grid mb-4" style={{ marginBottom: '2.5rem' }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '12px' }}></div>)}
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="skeleton" style={{ height: '450px', borderRadius: '16px' }}></div>
              <div className="skeleton" style={{ height: '450px', borderRadius: '16px' }}></div>
           </div>
        </div>
     );
  }
  
  if (error || !data) return <div className="alert-error" style={{ margin: '2rem' }}>{error || 'No telemetry data available'}</div>;

  // If there's truly no data, show the empty state requested
  if (data?.summary?.totalApplications === 0) {
    return (
      <motion.div className="page-container flex-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '70vh' }}>
        <div className="empty-state glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
           <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
           <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>No analytics data yet</h3>
           <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Add applications to see your progress and insights.</p>
        </div>
      </motion.div>
    );
  }

  const pendingCount = data?.statusBreakdown?.find(s => ['applied', 'pending'].includes(s.name?.toLowerCase()))?.value || 0;

  // Filter out zero-value statuses for the pie chart
  const validStatusData = data?.statusBreakdown?.filter(item => item.value > 0) || [];

  return (
    <motion.div className="page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="page-header mb-4" style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Track your application performance and progress</p>
      </div>

      <motion.div 
        className="stats-grid mb-4" 
        style={{ marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}
        initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div className="stat-card" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0, 210, 255, 0.15)' }} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--primary), var(--secondary))' }}></div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Applications</h3>
          <p className="stat-value" style={{ marginTop: '0.8rem', fontSize: '2.5rem' }}>{data.summary.totalApplications}</p>
        </motion.div>
        
        <motion.div className="stat-card" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(255, 0, 127, 0.15)' }} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #ff007f, #ffb3d9)' }}></div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontWeight: 500 }}>Interview Rate</h3>
          <p className="stat-value" style={{ color: '#ffb3d9', marginTop: '0.8rem', fontSize: '2.5rem', textShadow: '0 0 10px rgba(255, 0, 127, 0.3)' }}>{data.summary.interviewRate}</p>
        </motion.div>
        
        <motion.div className="stat-card" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0, 255, 127, 0.15)' }} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #00ff7f, #3a7bd5)' }}></div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontWeight: 500 }}>Offer Rate</h3>
          <p className="stat-value" style={{ color: '#00ff7f', marginTop: '0.8rem', fontSize: '2.5rem', textShadow: '0 0 10px rgba(0, 255, 127, 0.3)' }}>{data.summary.offerRate}</p>
        </motion.div>

        <motion.div className="stat-card" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(255, 219, 88, 0.15)' }} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #ffa500, #ffdb58)' }}></div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontWeight: 500 }}>Pending Applications</h3>
          <p className="stat-value" style={{ color: '#ffdb58', marginTop: '0.8rem', fontSize: '2.5rem', textShadow: '0 0 10px rgba(255, 165, 0, 0.3)' }}>{pendingCount}</p>
        </motion.div>
      </motion.div>

      <div className="charts-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', paddingBottom: '2rem' }}>
        {/* Monthly Trend Chart */}
        <motion.div className="glass-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }} style={{ maxWidth: '100%', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Application Trends</h3>
             <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>Monthly applications added</p>
          </div>
          <div style={{ width: '100%', height: 320, position: 'relative' }}>
            {(!data.monthlyTrend || data.monthlyTrend.length === 0) ? (
               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No trend data available.</div>
            ) : (
              <ResponsiveContainer>
                <LineChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#00d2ff" 
                    strokeWidth={3} 
                    dot={{ fill: '#00d2ff', stroke: 'var(--panel-bg)', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }}
                    style={{ filter: 'drop-shadow(0px 4px 8px rgba(0, 210, 255, 0.4))' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Status Breakdown Chart */}
        <motion.div className="glass-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ maxWidth: '100%', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Status Breakdown</h3>
             <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>Applications grouped by current status</p>
          </div>
          <div style={{ width: '100%', height: 320, flex: 1, position: 'relative' }}>
            {validStatusData.length === 0 ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No status data available.</div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={validStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {validStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 6px ${entry.color}80)` }} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          
          {validStatusData.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap', marginTop: '1.5rem', backgroundColor: 'var(--input-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {validStatusData.map((status, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: status.color || '#00d2ff', boxShadow: `0 0 8px ${status.color || '#00d2ff'}` }}></span>
                  {status.name} <span style={{ color: 'var(--text-muted)' }}>({status.value})</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
