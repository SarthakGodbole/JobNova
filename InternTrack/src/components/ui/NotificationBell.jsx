import React, { useState, useEffect, useRef } from 'react';
import { getApplications } from '../../services/application.service';

const NotificationBell = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Only student operators process application manifests
    if (!user || user.role === 'admin') {
       setLoading(false);
       return;
    }

    const loadReminders = async () => {
      try {
        const apps = await getApplications();
        const alerts = [];
        const now = new Date();

        apps.forEach(app => {
          const status = (app.status || '').toLowerCase();
          
          if (app.deadline) {
            const deadlineDate = new Date(app.deadline);
            const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= 7) {
              alerts.push({ id: app._id, title: app.company, type: 'warning', message: `Deadline approaching in ${diffDays} day(s)` });
            }
          } 
          
          if (status.includes('interview') || status === 'online assessment') {
             alerts.push({ id: app._id, title: app.company, type: 'info', message: `Pending ${app.status} phase.` });
          } else if (status === 'applied') {
             const appliedDate = new Date(app.appliedDate);
             const diffDays = Math.floor((now - appliedDate) / (1000 * 60 * 60 * 24));
             if (diffDays > 14) {
               alerts.push({ id: app._id, title: app.company, type: 'alert', message: `No update in over ${diffDays} days. Ready to follow up?` });
             }
          }
        });

        // Deduplicate effectively and limit to 5 UI elements
        const uniqueAlerts = alerts.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
        setNotifications(uniqueAlerts.slice(0, 5));
      } catch (err) {
        console.error("Failed to intercept notifications telemetry", err);
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, [user]);

  if (user?.role === 'admin') return null; // Admins hide notification module on current spec

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <button 
        className="theme-toggle-btn" 
        style={{ 
          position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? 'var(--hover-bg)' : 'rgba(255,255,255,0.1)',
          borderColor: open ? 'var(--primary)' : 'var(--border-color)'
        }}
        onClick={() => setOpen(!open)}
        title="View Notifications"
      >
        <span style={{ filter: notifications.length > 0 ? 'drop-shadow(0 0 5px var(--accent))' : 'none' }}>🔔</span>
        {notifications.length > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent)', color: 'white',
            borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px var(--accent)',
            animation: 'fadeIn 0.3s'
          }}>
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="user-dropdown" style={{
           position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '320px',
           background: 'var(--panel-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
           border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 40px var(--shadow-color)', 
           zIndex: 100, overflow: 'hidden', animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="user-dropdown-header" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.1)' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '0.5px' }}>TELEMETRY ALERTS</strong>
          </div>
          
          <div className="user-dropdown-body" style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {loading ? (
               <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                 <div className="skeleton skeleton-text" style={{ width: '80%', margin: '0 auto' }}></div>
                 <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0.5rem auto' }}></div>
               </div>
            ) : notifications.length === 0 ? (
               <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                 <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.5 }}>✓</div>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>All network manifests are clear.</p>
               </div>
            ) : (
               notifications.map((note, idx) => (
                 <div key={idx} style={{ 
                    padding: '1rem', borderBottom: '1px solid var(--border-color)', 
                    display: 'flex', flexDirection: 'column', gap: '0.4rem', cursor: 'pointer',
                    transition: 'background 0.2s', borderLeft: note.type === 'warning' ? '3px solid var(--accent)' : '3px solid var(--primary)'
                 }} onMouseOver={e => e.currentTarget.style.background = 'var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{note.title}</span>
                       <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NEW</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{note.message}</span>
                 </div>
               ))
            )}
            
            {notifications.length > 0 && (
              <div style={{ padding: '0.8rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <a href="/student/applications" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                  View All Manifests
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
