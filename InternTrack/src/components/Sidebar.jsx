import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ 
  navLinks, 
  isCollapsed, 
  isMobileOpen, 
  setIsMobileOpen, 
  brandText, 
  brandColor = 'var(--primary)' 
}) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon" style={{ borderColor: brandColor }}>
            <span style={{ backgroundColor: brandColor }}></span>
          </div>
          {!isCollapsed && <span className="brand-text" style={{ color: brandColor }}>{brandText}</span>}
          <button 
            className="mobile-close-btn" 
            onClick={() => setIsMobileOpen(false)}
          >
            ×
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={isCollapsed ? link.name : undefined}
                onClick={() => setIsMobileOpen(false)} // Auto close on mobile
              >
                <span className="nav-icon">{link.icon || '⊛'}</span>
                {!isCollapsed && <span className="nav-text">{link.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
