import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const PublicNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`public-navbar !fixed top-0 w-full z-[1000] transition-all duration-300 ease-in-out px-[5%] flex items-center justify-between ${
        scrolled 
          ? 'py-3 bg-[var(--panel-bg)] backdrop-blur-md shadow-lg border-b border-[var(--border-color)] opacity-100' 
          : 'py-6 bg-transparent opacity-75'
      }`}
    >
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
