import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
          className="user-dropdown" 
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
             position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '240px',
             background: 'rgba(15, 15, 20, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-color)',
             borderRadius: '12px', boxShadow: '0 15px 40px rgba(0,0,0,0.5)', zIndex: 9999, overflow: 'hidden'
          }}>
          <div className="user-dropdown-header" style={{ padding: '1.5rem 1.2rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)' }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.5rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'Operator Account'}</strong>
            <span className="role-badge" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'var(--hover-bg)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{user?.role || 'Guest'}</span>
          </div>
          <div className="user-dropdown-body" style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <button className="dropdown-item" style={{ padding: 0, textAlign: 'left', background: 'transparent', border: 'none', width: '100%' }}>
              <a href={user?.role === 'admin' ? '/admin/profile' : '/student/profile'} style={{
                display: 'block', padding: '0.8rem 1rem', color: '#e2e8f0', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s', fontSize: '0.95rem', fontWeight: 500
              }} onMouseOver={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = '#fff'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e2e8f0'; }}>
                👤 Profile
              </a>
            </button>
            <div className="dropdown-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '0.3rem 0' }}></div>
            <button 
              className="dropdown-item text-danger" 
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              style={{
                 padding: '0.8rem 1rem', background: 'transparent', border: 'none', color: '#ff4d4f', width: '100%',
                 textAlign: 'left', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, transition: 'all 0.2s', fontSize: '0.95rem'
              }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)'; e.currentTarget.style.color = '#ff7875'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ff4d4f'; }}
            >
              🚪 Logout
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
