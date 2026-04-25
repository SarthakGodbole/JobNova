import React, { useState, useEffect } from 'react';
import { getApplications, updateApplication } from '../../services/application.service';
import { addNotification } from '../../utils/notificationUtils';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';

const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: '#3a7bd5' },
  { id: 'Online Assessment', label: 'Online Assessment', color: '#ffb3d9' },
  { id: 'Technical Interview', label: 'Technical Interview', color: '#00d2ff' },
  { id: 'HR Interview', label: 'HR Interview', color: '#bc13fe' },
  { id: 'Offer', label: 'Offer', color: '#00ff7f' },
  { id: 'Rejected', label: 'Rejected', color: '#ff007f' }
];

const Toast = ({ message, onClose }) => (
  <div style={{
    position: 'fixed', bottom: '2rem', right: '2rem', background: '#ff4d4f', color: '#fff', 
    padding: '1rem 1.5rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 9999, display: 'flex', alignItems: 'center', gap: '1rem', animation: 'slideUp 0.3s ease-out'
  }}>
    <span>⚠️ {message}</span>
    <button onClick={onClose} style={{background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:'1.2rem'}}>&times;</button>
  </div>
);

const KanbanBoard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      setError('Could not fetch applications for Kanban');
    } finally {
      setLoading(false);
    }
  };

  const updateCardStatus = async (appId, newStatus) => {
    const appToMove = applications.find(a => a._id === appId);
    if (!appToMove || appToMove.status === newStatus) return;

    const oldStatus = appToMove.status;
    const updatedPayload = { ...appToMove, status: newStatus };
    
    // Optimistic UI update
    setApplications(prev => prev.map(app => 
      app._id === appId ? { ...app, status: newStatus } : app
    ));

    try {
      await updateApplication(appId, updatedPayload);
      addNotification('Status Changed', `${appToMove.company} application moved to ${newStatus}.`, 'info');
    } catch (err) {
      console.error("Kanban move failed:", err.response?.data || err.message);
      setToastMsg('Network failure: Unable to move card.');
      setTimeout(() => setToastMsg(''), 5000);
      // Revert on failure
      setApplications(prev => prev.map(app => 
        app._id === appId ? { ...app, status: oldStatus } : app
      ));
    }
  };

  const handleDragStart = (e, appId) => {
    setDraggedAppId(appId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (appId) {
      updateCardStatus(appId, newStatus);
    }
    setDraggedAppId(null);
  };

  if (loading) {
     return (
       <div className="page-container">
         <PageHeader title="Application Board" subtitle="Track applications through each stage" />
         <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem' }}>
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="glass-panel" style={{ minWidth: '320px', padding: '1rem' }}>
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

  // Ensure case-insensitive grouping but default to exact match
  const groupedApps = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter(app => (app.status || 'Applied').toLowerCase() === col.id.toLowerCase());
    return acc;
  }, {});

  // Handle items with statuses that don't match any columns
  const unknownApps = applications.filter(app => !COLUMNS.some(c => c.id.toLowerCase() === (app.status || '').toLowerCase()));
  if (unknownApps.length > 0) {
     groupedApps[COLUMNS[0].id] = [...groupedApps[COLUMNS[0].id], ...unknownApps];
  }

  return (
    <div className="page-container kanban-container">
      <PageHeader title="Application Board" subtitle="Track applications through each stage" />
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      <div className="kanban-board" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem' }}>
        {COLUMNS.map((col) => (
          <div 
            key={col.id} 
            className="kanban-column glass-panel"
            style={{ 
              minWidth: '320px',
              maxWidth: '320px',
              padding: '1rem',
              transition: 'background 0.3s ease',
              background: dragOverCol === col.id ? 'var(--hover-bg)' : 'var(--panel-bg)',
              border: dragOverCol === col.id ? `1px dashed ${col.color}` : '1px solid var(--border-color)',
            }}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="kanban-column-header" style={{ marginBottom: '1rem' }}>
              <h3 style={{ borderBottom: `2px solid ${col.color}`, paddingBottom: '0.5rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between' }}>
                {col.label} <span className="kanban-count" style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{groupedApps[col.id]?.length || 0}</span>
              </h3>
            </div>
            
            <div className="kanban-column-body" style={{ minHeight: '150px' }}>
              {groupedApps[col.id]?.length === 0 ? (
                <div className="kanban-empty" style={{ 
                  textAlign: 'center', padding: '2rem 1rem', border: '1px dashed var(--border-color)', 
                  borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' 
                }}>
                  No applications
                </div>
              ) : (
                groupedApps[col.id]?.map(app => (
                  <div 
                    key={app._id} 
                    className="kanban-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, app._id)}
                    style={{
                      padding: '1rem',
                      marginBottom: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'grab',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      boxShadow: '0 2px 4px var(--shadow-color)',
                      opacity: draggedAppId === app._id ? 0.5 : 1
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px var(--shadow-color)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px var(--shadow-color)';
                    }}
                  >
                    <div className="kanban-card-title" style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.company}</div>
                    <div className="kanban-card-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{app.role}</div>
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
