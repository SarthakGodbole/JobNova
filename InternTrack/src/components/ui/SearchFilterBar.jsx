import React from 'react';

const SearchFilterBar = ({ children, style, className = '' }) => {
  return (
    <div className={`filters-bar glass-panel ${className}`} style={{ 
      padding: '1rem', 
      animation: 'none', 
      maxWidth: 'none', 
      display: 'flex', 
      gap: '1rem', 
      marginBottom: '2.5rem',
      flexWrap: 'wrap',
      ...style 
    }}>
      {children}
    </div>
  );
};

export default SearchFilterBar;
