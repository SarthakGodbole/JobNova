import React, { useState, useEffect, useRef } from 'react';
import { getApplications } from '../../services/application.service';
import { getLocalNotifications, markAsRead, clearAllNotifications } from '../../utils/notificationUtils';

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

  const loadNotifications = () => {
    const localNotifs = getLocalNotifications();
    setNotifications(localNotifs);
    setLoading(false);
  };

  useEffect(() => {
    if (!user || user.role === 'admin') {
       setLoading(false);
       return;
    }
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('notificationsUpdated', handleUpdate);
    return () => window.removeEventListener('notificationsUpdated', handleUpdate);
  }, [user]);

  if (user?.role === 'admin') return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{`
        @keyframes dropdownAnim {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes pulseGlowLight {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .notif-dropdown {
           position: absolute; top: calc(100% + 15px); right: 0; width: 380px;
           background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
           border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 16px; 
           box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.08); 
           z-index: 9999; overflow: hidden; animation: dropdownAnim 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .notif-header {
           padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(0,0,0,0.2);
           display: flex; justify-content: space-between; align-items: center;
        }

        .notif-header-text {
           font-size: 1rem; color: var(--text-main); letter-spacing: 0.5px; font-weight: bold;
        }

        .notif-empty-container {
           padding: 4rem 2rem; text-align: center; display: flex; flex-direction: column; gap: 0.8rem; justify-content: center; align-items: center;
        }

        .notif-empty-title {
           color: var(--text-main); font-size: 1.05rem; font-weight: 600; margin: 0;
        }

        .notif-empty-sub {
           color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin: 0;
        }

        .notif-item {
           padding: 1.2rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
           display: flex; flex-direction: column; gap: 0.4rem; cursor: pointer; transition: all 0.2s ease;
        }

        .bell-icon-active {
           filter: drop-shadow(0 0 8px var(--accent));
           animation: pulseGlow 2s infinite;
        }

        /* Light Mode Specific Overrides */
        :root[data-theme="light"] .notif-dropdown {
           background: #ffffff !important;
           backdrop-filter: none !important;
           -webkit-backdrop-filter: none !important;
           border: 1px solid #e5e7eb !important;
           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }

        :root[data-theme="light"] .notif-header {
           background: #ffffff !important;
           border-bottom: 1px solid #e5e7eb !important;
        }

        :root[data-theme="light"] .notif-header-text {
           color: #111827 !important;
        }

        :root[data-theme="light"] .notif-empty-title {
           color: #374151 !important;
        }

        :root[data-theme="light"] .notif-empty-sub {
           color: #6b7280 !important;
        }

        :root[data-theme="light"] .notif-item {
           border-bottom: 1px solid #e5e7eb !important;
        }

        :root[data-theme="light"] .bell-icon-active {
           filter: none !important;
           animation: pulseGlowLight 2s infinite !important;
        }
      `}</style>
      <div className="user-menu-wrapper" ref={menuRef}>
        <button 
          className="theme-toggle-btn" 
          style={{ 
            position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: open ? 'var(--hover-bg)' : 'rgba(255,255,255,0.1)',
            borderColor: open ? 'var(--primary)' : 'var(--border-color)',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setOpen(!open)}
          title="View Notifications"
        >
          <span className={unreadCount > 0 ? "bell-icon-active" : ""}>🔔</span>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent)', color: 'white',
              borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px var(--accent)',
              animation: 'fadeIn 0.3s'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="user-dropdown notif-dropdown">
            <div className="user-dropdown-header notif-header">
              <strong className="notif-header-text">Notifications</strong>
              {notifications.length > 0 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); clearAllNotifications(); }}
                  style={{ fontSize: '0.8rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
                  onMouseOver={(e) => e.target.style.color = 'var(--text-main)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="user-dropdown-body" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {loading ? (
                 <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                   <div className="skeleton skeleton-text" style={{ width: '80%', margin: '0 auto' }}></div>
                   <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0.5rem auto' }}></div>
                 </div>
              ) : notifications.length === 0 ? (
                 <div className="notif-empty-container">
                   <h3 className="notif-empty-title">No notifications yet</h3>
                   <p className="notif-empty-sub">
                     Updates about applications, interviews, and reminders will appear here.
                   </p>
                 </div>
              ) : (
                 notifications.map((note) => (
                   <div key={note.id} 
                     className="notif-item"
                     onClick={() => !note.read && markAsRead(note.id)}
                     style={{ 
                      background: note.read ? 'transparent' : 'rgba(139, 92, 246, 0.05)',
                      borderLeft: note.type === 'warning' ? '3px solid var(--accent)' : '3px solid var(--primary)',
                      opacity: note.read ? 0.6 : 1
                   }} onMouseOver={e => e.currentTarget.style.background = 'var(--hover-bg)'} 
                      onMouseOut={e => e.currentTarget.style.background = note.read ? 'transparent' : 'rgba(139, 92, 246, 0.05)'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{note.title}</span>
                         {!note.read && (
                           <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', flexShrink: 0, marginLeft: '0.5rem' }}></span>
                         )}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{note.message}</span>
                   </div>
                 ))
              )}
              
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationBell;
