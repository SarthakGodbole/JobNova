import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ApplicationCard = ({ application, onDelete }) => {
  const { _id, company, role, status, appliedDate } = application;
  // Mark as urgent if applied within the last 3 days
  const isUrgent = appliedDate && (new Date() - new Date(appliedDate) < 3 * 24 * 60 * 60 * 1000);

  return (
    <div className="card app-card" style={isUrgent ? { borderColor: 'rgba(0, 210, 255, 0.4)', boxShadow: '0 0 10px rgba(0, 210, 255, 0.1)' } : {}}>
      <div className="card-header">
        <h3 className="position">{role}</h3>
        <StatusBadge status={status} />
      </div>
      <div className="card-body">
        <p className="company" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <span className="icon">🏢</span> {company}
        </p>
        <p className="date" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          <span className="icon">📅</span> {appliedDate ? new Date(appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
        </p>
      </div>
      <div className="card-actions">
        <Link to={`/student/applications/${_id}`} className="btn-secondary small" title="View Details">👁️</Link>
        <Link to={`/student/applications/${_id}/edit`} className="btn-secondary small" title="Edit">✏️</Link>
        <button onClick={() => onDelete(_id)} className="btn-danger small" title="Delete">🗑️</button>
      </div>
    </div>
  );
};

export default ApplicationCard;
