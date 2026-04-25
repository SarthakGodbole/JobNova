import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './ui/UserMenu';
import NotificationBell from './ui/NotificationBell';

const Header = ({ 
  user, 
  toggleMobileSidebar, 
  toggleDesktopSidebar, 
  handleLogout,
  isCollapsed
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="menu-btn desktop-only" onClick={toggleDesktopSidebar}>
          {isCollapsed ? '⇥' : '⇤'}
        </button>
        <button className="menu-btn mobile-only" onClick={toggleMobileSidebar}>
          ☰
        </button>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <NotificationBell user={user} />
        <ThemeToggle />
        
        <div className="user-menu-wrapper" style={{ position: 'relative' }}>
          <UserMenu user={user} handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;
