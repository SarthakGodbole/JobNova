import React from 'react';

const EmptyState = ({ icon = '📡', title = 'No results found', description, action }) => {
  return (
    <div className="empty-state" style={{ padding: '4rem 1rem', border: '1px dashed var(--border-color)', background: 'transparent', textAlign: 'center', borderRadius: '12px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'float 6s ease-in-out infinite' }}>{icon}</div>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{title}</h3>
      {description && <p className="text-muted" style={{ marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
