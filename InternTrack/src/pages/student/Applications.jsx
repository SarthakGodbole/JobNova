import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApplicationCard from '../../components/ApplicationCard';
import StatusBadge from '../../components/StatusBadge';
import { getApplications, deleteApplication } from '../../services/application.service';
import { motion } from 'framer-motion';
import { EyeIcon, EditIcon, TrashIcon } from '../../components/ui/Icons';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and sort
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first

  // Delete Modal State
  const [deleteId, setDeleteId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplications({ search, status: statusFilter, sort: sortOrder });
      setApplications(data);
    } catch (err) {
      setError('Could not fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, statusFilter, sortOrder]);

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteApplication(deleteId);
      setApplications(applications.filter(app => app._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert('Failed to delete application.');
      setDeleteId(null);
    }
  };

  const isUrgent = (dateStr) => {
    if (!dateStr) return false;
    const daysSince = (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
    return daysSince >= 0 && daysSince < 3;
  };

  return (
    <motion.div className="page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="page-header flex-between mb-4">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">Track and manage your internship/job applications</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/student/applications/new" className="btn-primary">
            <span>+</span> New Application
          </Link>
        </motion.div>
      </div>

      <div className="filters-bar glass-panel" style={{ padding: '1rem', animation: 'none', maxWidth: 'none', display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
        <input 
          type="text" 
          placeholder="Search by company, role, or location..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Online Assessment">Online Assessment</option>
          <option value="Technical Interview">Technical Interview</option>
          <option value="HR Interview">HR Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filter-select">
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {error ? (
        <div className="alert-error">{error}</div>
      ) : loading ? (
        <div className="table-responsive">
          <table className="data-table desktop-only">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td><div className="skeleton skeleton-text" style={{ width: '60%' }}></div></td>
                  <td><div className="skeleton skeleton-text" style={{ width: '80%' }}></div></td>
                  <td><div className="skeleton skeleton-badge"></div></td>
                  <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                       <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '4px' }}></div>
                       <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '4px' }}></div>
                       <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '4px' }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="app-grid mobile-only">
             {[1, 2, 3, 4].map(i => (
                <div key={i} className="card app-card" style={{ padding: '1.5rem' }}>
                  <div className="skeleton skeleton-text" style={{ width: '60%', height: '20px', marginBottom: '1rem' }}></div>
                  <div className="skeleton skeleton-badge" style={{ marginBottom: '1rem' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                </div>
             ))}
          </div>
        </div>
      ) : applications.length === 0 ? (
        <motion.div className="empty-state" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
           <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
           <h3>No applications yet</h3>
           <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Start by adding your first internship or job application.</p>
           <Link to="/student/applications/new" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Add Application</Link>
        </motion.div>
      ) : (
        <div className="table-responsive">
          <table className="data-table desktop-only">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => {
                const urgent = isUrgent(app.appliedDate);
                return (
                  <tr key={app._id} style={urgent ? { borderLeft: '3px solid var(--primary)', backgroundColor: 'rgba(0, 210, 255, 0.03)' } : {}}>
                    <td style={{ fontWeight: 600 }}>{app.company}</td>
                    <td>{app.role} {urgent && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginLeft: '0.5rem', border: '1px solid currentColor', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>NEW</span>}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td className="text-muted">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</td>
                    <td className="actions-cell">
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <Link to={`/student/applications/${app._id}`} className="btn-icon-action btn-icon-view" title="View Details"><EyeIcon /></Link>
                        <Link to={`/student/applications/${app._id}/edit`} className="btn-icon-action btn-icon-edit" title="Edit"><EditIcon /></Link>
                        <button onClick={() => confirmDelete(app._id)} className="btn-icon-action btn-icon-delete" title="Delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="app-grid mobile-only">
            {applications.map(app => (
              <ApplicationCard key={app._id} application={app} onDelete={confirmDelete} />
            ))}
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Application?</h3>
            <p>Are you sure you want to permanently delete this application record? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Applications;
