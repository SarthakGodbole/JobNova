import React from 'react';

const LoadingSkeleton = ({ type = 'text', width = '100%', height = '16px', className = '', style = {} }) => {
  if (type === 'card') {
    return (
      <div className={`skeleton ${className}`} style={{ width, height: height !== '16px' ? height : '140px', borderRadius: '12px', ...style }}></div>
    );
  }
  
  if (type === 'table') {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', ...style }}>
         {[1, 2, 3, 4].map(i => (
           <div key={i} style={{ display: 'flex', gap: '1rem' }}>
              <div className="skeleton skeleton-text" style={{ flex: 2, height: '20px' }}></div>
              <div className="skeleton skeleton-text" style={{ flex: 1, height: '20px' }}></div>
              <div className="skeleton skeleton-text" style={{ flex: 1, height: '20px' }}></div>
              <div className="skeleton skeleton-text" style={{ flex: 1, height: '20px' }}></div>
           </div>
         ))}
      </div>
    );
  }

  // default line
  return (
    <div className={`skeleton skeleton-${type} ${className}`} style={{ width, height, ...style }}></div>
  );
};

export default LoadingSkeleton;
