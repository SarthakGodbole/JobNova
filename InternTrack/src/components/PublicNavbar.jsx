import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const PublicNavbar = () => {
  return (
    <header className="public-navbar">
      <div className="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.4rem' }}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00d2ff" />
              <stop offset="1" stopColor="#3a7bd5" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="2" y1="17" x2="22" y2="22" gradientUnits="userSpaceOnUse">
               <stop stopColor="#00d2ff" />
              <stop offset="1" stopColor="#3a7bd5" />
            </linearGradient>
            <linearGradient id="paint2_linear" x1="2" y1="12" x2="22" y2="17" gradientUnits="userSpaceOnUse">
               <stop stopColor="#00d2ff" />
              <stop offset="1" stopColor="#3a7bd5" />
            </linearGradient>
          </defs>
        </svg>
        JobNova
      </div>
      <nav className="nav-links">
        <ThemeToggle />
        <Link to="/login" className="btn-secondary">Login</Link>
        <Link to="/register" className="btn-primary">Get Started</Link>
      </nav>
    </header>
  );
};

export default PublicNavbar;
