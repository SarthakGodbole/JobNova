import React from 'react';

const SectionCard = ({ title, subtitle, children, className = '', style = {} }) => {
  return (
    <div className={`glass-panel ${className}`} style={{ maxWidth: '100%', padding: '2rem 1.5rem', animation: 'fadeIn 0.6s ease-out forwards', display: 'flex', flexDirection: 'column', ...style }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
           {title && <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{title}</h3>}
           {subtitle && <p className="text-muted" style={{ fontSize: '0.85rem' }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
