import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import { getApplicationById, deleteApplication } from '../../services/application.service';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        const data = await getApplicationById(id);
        setApp(data);
      } catch (err) {
        setError('Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Delete this application?')) {
      try {
        await deleteApplication(id);
        navigate('/student/applications');
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) return <div className="loading">Decoding data...</div>;
  if (error || !app) return <div className="alert-error">{error || 'Not found'}</div>;

  return (
    <div className="page-container">
      <div className="page-header flex-between mb-4">
        <div>
          <button className="btn-secondary small mb-2" onClick={() => navigate(-1)}>← Back to Database</button>
          <h1 className="page-title">{app.company}</h1>
          <p className="page-subtitle">{app.role}</p>
        </div>
        <div className="flex-gap">
          <StatusBadge status={app.status} />
          <Link to={`/student/applications/${id}/edit`} className="btn-primary small">Edit</Link>
          <button onClick={handleDelete} className="btn-danger small">Delete</button>
        </div>
      </div>

      <div className="glass-panel w-full" style={{maxWidth: '100%'}}>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Location</span>
            <span className="value">{app.location || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Date Applied</span>
            <span className="value">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="label">URL</span>
            <span className="value">
              {app.jobLink ? <a href={app.jobLink} target="_blank" rel="noreferrer">External Link ↗</a> : 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <span className="label">Field Notes</span>
          <p className="mt-2 text-muted">{app.notes || 'No notes logged.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
