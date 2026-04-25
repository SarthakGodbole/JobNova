import React from 'react';

const PublicFooter = () => {
  return (
    <footer className="public-footer" style={{ borderTop: 'none', background: 'transparent' }}>
      <div className="footer-content" style={{ opacity: 0.7, transform: 'scale(0.95)' }}>
        <div className="logo" style={{ fontSize: '1.4rem', justifyContent: 'center', marginBottom: '0.5rem', fontWeight: 800 }}>
          JobNova
        </div>
        <p style={{ margin: '0.2rem 0', fontSize: '0.85rem' }}>© {new Date().getFullYear()} Orbital Systems Inc. All systems nominal.</p>
        <p style={{ margin: '0.2rem 0', fontSize: '0.85rem' }}>Developed by Sarthak Godbole</p>
        <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          <a href="mailto:sarthakgodbole926@gmail.com" style={{ color: 'var(--text-muted)' }}>sarthakgodbole926@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default PublicFooter;
