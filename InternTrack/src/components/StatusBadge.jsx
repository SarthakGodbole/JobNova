import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'applied': return 'status-applied';
      case 'online assessment': return 'status-interviewing';
      case 'technical interview': return 'status-interviewing';
      case 'hr interview': return 'status-interviewing';
      case 'interviewing': return 'status-interviewing';
      case 'offer': return 'status-offered';
      case 'offered': return 'status-offered';
      case 'rejected': return 'status-rejected';
      case 'accepted': return 'status-accepted';
      default: return 'status-default';
    }
  };

  return (
    <span className={`badge ${getStatusColor(status)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span className="badge-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
