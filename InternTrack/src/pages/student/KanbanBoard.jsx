import React, { useState, useEffect } from 'react';
import { getApplications, updateApplication } from '../../services/application.service';
import { addNotification } from '../../utils/notificationUtils';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: '#3a7bd5' },
  { id: 'Online Assessment', label: 'Online Assessment', color: '#ffb3d9' },
  { id: 'Technical Interview', label: 'Technical Interview', color: '#00d2ff' },
  { id: 'HR Interview', label: 'HR Interview', color: '#bc13fe' },
  { id: 'Offer', label: 'Offer', color: '#00ff7f' },
  { id: 'Rejected', label: 'Rejected', color: '#ff007f' }
];

const Toast = ({ message, type = 'error', onClose }) => (
  <div style={{
    position: 'fixed', bottom: '2rem', right: '2rem', 
    background: type === 'error' ? '#ff4d4f' : '#10b981', 
    color: '#fff', 
    padding: '1rem 1.5rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 9999, display: 'flex', alignItems: 'center', gap: '1rem', animation: 'slideUp 0.3s ease-out'
  }}>
    <span>{type === 'error' ? '⚠️' : '✅'} {message}</span>
    <button onClick={onClose} style={{background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:'1.2rem'}}>&times;</button>
  </div>
);

const KanbanBoard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });
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

    const oldStatus = appToMove.status || 'Applied';
    const updatedPayload = { ...appToMove, status: newStatus };
    
    // Optimistic UI update
    setApplications(prev => prev.map(app => 
      app._id === appId ? { ...app, status: newStatus } : app
    ));

    try {
      await updateApplication(appId, updatedPayload);
      addNotification('Status updated', `${appToMove.company} moved from ${oldStatus} to ${newStatus}`, 'info');
      setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
      setTimeout(() => setToast({ message: '', type: '' }), 5000);
    } catch (err) {
      console.error("Kanban move failed:", err.response?.data || err.message);
      setToast({ message: 'Network failure: Unable to move card.', type: 'error' });
      setTimeout(() => setToast({ message: '', type: '' }), 5000);
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
    <>
      <style>{`
        .kanban-status-select {
           background: rgba(255, 255, 255, 0.05); color: var(--text-main); 
           border: 1px solid var(--border-color); padding: 0.3rem 0.5rem; 
           border-radius: 6px; font-size: 0.75rem; cursor: pointer; outline: none;
           transition: all 0.2s ease; width: 100%; appearance: none;
           text-overflow: ellipsis; display: block;
        }
        .kanban-status-select:hover {
           border-color: var(--primary); background: rgba(0, 0, 0, 0.1);
        }
        .kanban-status-select option {
           background: var(--panel-bg); color: var(--text-main);
        }

        :root[data-theme="light"] .kanban-status-select {
           background: #f9fafb !important; color: #111827 !important; border-color: #e5e7eb !important;
        }
        :root[data-theme="light"] .kanban-status-select:hover {
           border-color: #3b82f6 !important; background: #f3f4f6 !important;
        }
        :root[data-theme="light"] .kanban-status-select option {
           background: #ffffff !important; color: #111827 !important;
        }
      `}</style>

      <div className="page-container kanban-container">
        <PageHeader title="Application Board" subtitle="Track applications through each stage" />
        {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}

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
                  <AnimatePresence>
                    {groupedApps[col.id]?.map(app => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: draggedAppId === app._id ? 0.5 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                          boxShadow: '0 2px 4px var(--shadow-color)',
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
                        
                        <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                           <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</span>
                           <div style={{ position: 'relative', width: '70%' }}>
                             <select 
                               className="kanban-status-select"
                               value={app.status || 'Applied'}
                               onChange={(e) => updateCardStatus(app._id, e.target.value)}
                               onClick={(e) => e.stopPropagation()}
                               onFocus={(e) => e.target.closest('.kanban-card').removeAttribute('draggable')}
                               onBlur={(e) => e.target.closest('.kanban-card').setAttribute('draggable', 'true')}
                             >
                               {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                             </select>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
