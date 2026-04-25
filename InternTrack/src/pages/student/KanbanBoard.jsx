import React, { useState, useEffect } from 'react';
import { getApplications, updateApplication } from '../../services/application.service';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';

const COLUMNS = [
  { id: 'applied', label: 'Applied', color: '#3a7bd5' },
  { id: 'online assessment', label: 'Online Assessment', color: '#ffb3d9' },
  { id: 'technical interview', label: 'Technical Interview', color: '#00d2ff' },
  { id: 'hr interview', label: 'HR Interview', color: '#bc13fe' },
  { id: 'offered', label: 'Offer', color: '#00ff7f' },
  { id: 'rejected', label: 'Rejected', color: '#ff007f' }
];

const KanbanBoard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      setError('Telemetry error: Could not fetch missions for Kanban');
    } finally {
      setLoading(false);
    }
  };

  const moveCard = async (appId, currentStatus, direction) => {
    // Determine current index in COLUMNS by matching case-insensitively or falling back to 'applied' if malformed
    let currentIndex = COLUMNS.findIndex(c => c.id === (currentStatus || 'applied').toLowerCase());
    if (currentIndex === -1) currentIndex = 0; // fallback
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= COLUMNS.length) return; // out of bounds

    const newStatus = COLUMNS[newIndex].id;

    // Optimistic UI update
    setApplications(prev => prev.map(app => 
      app._id === appId ? { ...app, status: newStatus } : app
    ));

    try {
      await updateApplication(appId, { status: newStatus });
    } catch (err) {
      alert('Network failure: Unable to move card.');
      // Revert on failure
      fetchApplications();
    }
  };

  if (loading) {
     return (
       <div className="page-container">
         <PageHeader title="Mission Control Kanban" subtitle="Visual workflow tracker" />
         <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem' }}>
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="glass-panel" style={{ minWidth: '300px', padding: '1rem' }}>
                <LoadingSkeleton type="text" height="30px" style={{ marginBottom: '1.5rem' }} />
                <LoadingSkeleton type="card" height="100px" style={{ marginBottom: '1rem' }} />
                <LoadingSkeleton type="card" height="100px" />
             </div>
           ))}
         </div>
       </div>
     );
  }

  if (error) {
     return (
       <div className="page-container flex-center">
         <EmptyState icon="⚠️" title="System Error" description={error} />
       </div>
     );
  }

  // Group applications by normalized column ID
  const groupedApps = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter(app => (app.status || 'applied').toLowerCase() === col.id);
    return acc;
  }, {});

  // Handle items with statuses that don't match any columns (just drop them into the first column to prevent data loss visually)
  const unknownApps = applications.filter(app => !COLUMNS.some(c => c.id === (app.status || '').toLowerCase()));
  if (unknownApps.length > 0) {
     groupedApps[COLUMNS[0].id] = [...groupedApps[COLUMNS[0].id], ...unknownApps];
  }

  return (
    <div className="page-container kanban-container">
      <PageHeader title="Mission Control Kanban" subtitle="Visual tracking for your flight manifest" />

      <div className="kanban-board">
        {COLUMNS.map((col, colIndex) => (
          <div key={col.id} className="kanban-column glass-panel">
            <div className="kanban-column-header">
              <h3 style={{ borderBottom: `2px solid ${col.color}` }}>
                {col.label} <span className="kanban-count">{groupedApps[col.id]?.length || 0}</span>
              </h3>
            </div>
            
            <div className="kanban-column-body">
              {groupedApps[col.id]?.length === 0 ? (
                <div className="kanban-empty">No missions</div>
              ) : (
                groupedApps[col.id]?.map(app => (
                  <div key={app._id} className="kanban-card">
                    <div className="kanban-card-title">{app.company}</div>
                    <div className="kanban-card-subtitle">{app.position}</div>
                    
                    <div className="kanban-card-actions">
                      <button 
                        className="btn-kanban" 
                        onClick={() => moveCard(app._id, app.status, -1)}
                        disabled={colIndex === 0}
                        title="Move Left"
                      >
                        ◀
                      </button>
                      <button 
                        className="btn-kanban" 
                        onClick={() => moveCard(app._id, app.status, 1)}
                        disabled={colIndex === COLUMNS.length - 1}
                        title="Move Right"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
