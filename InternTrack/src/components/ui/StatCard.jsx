import React from 'react';

const StatCard = ({ title, value, gradientStart = 'var(--primary)', gradientEnd = 'var(--secondary)', textShadowColor = 'rgba(0, 210, 255, 0.4)', valueColor = 'var(--primary)' }) => {
  return (
    <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '4px', 
        height: '100%', 
        background: `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})` 
      }}></div>
      <h3 style={{ letterSpacing: '1px' }}>{title}</h3>
      <p className="stat-value" style={{ color: valueColor, textShadow: `0 0 10px ${textShadowColor}` }}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;
