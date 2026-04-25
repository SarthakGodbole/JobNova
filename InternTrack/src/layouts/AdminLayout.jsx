import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'System Overview', path: '/admin/dashboard', icon: '❂' },
    { name: 'Operators', path: '/admin/users', icon: '⚇' },
    { name: 'Global Apps', path: '/admin/applications', icon: '▤' }
  ];

  return (
    <div className="layout-wrapper">
      <Sidebar 
        navLinks={navLinks}
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        brandText="Orbital Admin"
        brandColor="var(--accent)"
      />

      <div className={`layout-main ${isCollapsed ? 'expanded' : ''}`}>
        <Header 
          user={user}
          isCollapsed={isCollapsed}
          toggleDesktopSidebar={() => setIsCollapsed(!isCollapsed)}
          toggleMobileSidebar={() => setIsMobileOpen(true)}
          handleLogout={handleLogout}
        />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
