import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOutIcon } from './Icons';

const UserMenu = ({ user, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        .user-menu-dropdown {
           position: absolute; top: calc(100% + 12px); right: 0; width: 240px;
           background: rgba(15, 15, 20, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
           border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; 
           box-shadow: 0 15px 40px rgba(0,0,0,0.5); z-index: 9999; overflow: hidden;
        }

        .user-menu-header {
           padding: 1.5rem 1.2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255,255,255,0.03);
        }

        .user-menu-email {
           display: block; font-size: 0.95rem; margin-bottom: 0.5rem; color: #ffffff; 
           white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold;
        }

        .user-menu-link {
           display: block; padding: 0.8rem 1rem; color: #e2e8f0; text-decoration: none; 
           border-radius: 8px; transition: all 0.2s; font-size: 0.95rem; font-weight: 500;
        }

        .user-menu-link:hover {
           background: var(--hover-bg); color: #ffffff;
        }

        .user-menu-logout {
           padding: 0.8rem 1rem; background: transparent; border: none; color: #ff4d4f; width: 100%;
           text-align: left; border-radius: 8px; cursor: pointer; display: flex; align-items: center; 
           gap: 0.5rem; font-weight: 600; transition: all 0.2s; font-size: 0.95rem;
        }

        .user-menu-logout:hover {
           background: rgba(255, 77, 79, 0.1); color: #ff7875;
        }

        /* Light Mode Specific Overrides */
        :root[data-theme="light"] .user-menu-dropdown {
           background: #ffffff !important;
           backdrop-filter: none !important;
           -webkit-backdrop-filter: none !important;
           border: 1px solid #e5e7eb !important;
           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }

        :root[data-theme="light"] .user-menu-header {
           background: #ffffff !important;
           border-bottom: 1px solid #e5e7eb !important;
        }

        :root[data-theme="light"] .user-menu-email {
           color: #111827 !important;
        }

        :root[data-theme="light"] .user-menu-link {
           color: #374151 !important;
        }

        :root[data-theme="light"] .user-menu-link:hover {
           background: rgba(0, 0, 0, 0.05) !important;
           color: #111827 !important;
        }

        :root[data-theme="light"] .user-menu-logout:hover {
           background: rgba(239, 68, 68, 0.1) !important;
           color: #dc2626 !important;
        }
      `}</style>
      <div className="user-menu-wrapper" ref={menuRef}>
        <button 
          className="user-profile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
             display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'transparent', 
             border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px',
             transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--hover-bg)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <div className="avatar" style={{
             width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
             display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold'
          }}>
            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="user-email-text desktop-only" style={{ color: 'var(--text-main)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px', display: 'inline-block', verticalAlign: 'middle' }}>
            {user?.email || 'operator@system.io'}
          </span>
          <span className="dropdown-arrow" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>▼</span>
        </button>

        <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="user-menu-dropdown" 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="user-menu-header">
              <strong className="user-menu-email">{user?.email || 'Operator Account'}</strong>
              <span className="role-badge" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'var(--hover-bg)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{user?.role || 'Guest'}</span>
            </div>
            <div className="user-dropdown-body" style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <button className="dropdown-item" style={{ padding: 0, textAlign: 'left', background: 'transparent', border: 'none', width: '100%' }}>
                <a href={user?.role === 'admin' ? '/admin/profile' : '/student/profile'} className="user-menu-link">
                  👤 Profile
                </a>
              </button>
              <div className="dropdown-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '0.3rem 0' }}></div>
              <button 
                className="user-menu-logout text-danger" 
                onClick={() => { handleLogout(); setMenuOpen(false); }}
              >
                <LogOutIcon size={16} /> Logout
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default UserMenu;
