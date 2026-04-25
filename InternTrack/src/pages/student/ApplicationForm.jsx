import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationById, createApplication, updateApplication } from '../../services/application.service';
import { addNotification } from '../../utils/notificationUtils';
const ApplicationForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    location: '',
    jobLink: '',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const fetchApp = async () => {
        try {
          setLoading(true);
          const data = await getApplicationById(id);
          // Format date string for the HTML5 date input securely
          if (data.appliedDate) {
            data.appliedDate = new Date(data.appliedDate).toISOString().split('T')[0];
          }
          setFormData(data);
        } catch (err) {
          setError('Failed to fetch application details');
        } finally {
          setLoading(false);
        }
      };
      fetchApp();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear targeted field error on change
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.company.trim()) errs.company = "Company name is required.";
    if (!formData.role.trim()) errs.role = "Job role is required.";
    if (!formData.status) errs.status = "Status is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateApplication(id, formData);
        addNotification('Application Updated', `Your application for ${formData.role} at ${formData.company} was updated.`, 'info');
      } else {
        await createApplication(formData);
        addNotification('Application Added', `You successfully added an application for ${formData.role} at ${formData.company}.`, 'info');
      }
      navigate('/student/applications');
    } catch (err) {
      setError('Failed to save application');
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="page-container flex-center">
        <div className="glass-panel form-panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0 auto 1.5rem', height: '30px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '50px', marginBottom: '1rem' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '50px', marginBottom: '1rem' }}></div>
        </div>
      </div>
    );
  }

  const isInvalid = (field) => validationErrors[field] ? 'is-invalid' : '';

  return (
    <div className="page-container flex-center" style={{ padding: '2rem 1rem' }}>
      <div className="glass-panel form-panel" style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {isEdit ? 'Update Application' : 'Add New Application'}
          </h2>
          <p className="text-muted">
            {isEdit ? 'Modify your application details.' : 'Track a new internship or job application'}
          </p>
        </div>
        
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Section: Core Data */}
          <div className="form-section-header" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Basic Details</h3>
          </div>
          
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Company Name <span style={{color: 'var(--accent)'}}>*</span></label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="company" 
                  value={formData.company} 
                  onChange={handleChange} 
                  className={isInvalid('company')}
                  placeholder="Enter company name" 
                />
              </div>
              {validationErrors.company && (
                <span className="validation-feedback">{validationErrors.company}</span>
              )}
            </div>
            
            <div className="input-group">
              <label>Job Role <span style={{color: 'var(--accent)'}}>*</span></label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange} 
                  className={isInvalid('role')}
                  placeholder="Enter job role (e.g. Frontend Developer)" 
                />
              </div>
              {validationErrors.role && <span className="validation-feedback">{validationErrors.role}</span>}
            </div>
          </div>

          {/* Section: Tracking Metrics */}
          <div className="form-section-header" style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Application Details</h3>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Application Status <span style={{color: 'var(--accent)'}}>*</span></label>
              <div className="input-wrapper">
                <select name="status" value={formData.status} onChange={handleChange} className={`form-input ${isInvalid('status')}`} style={{ width: '100%' }}>
                  <option value="Applied">Applied</option>
                  <option value="Online Assessment">Online Assessment</option>
                  <option value="Technical Interview">Technical Interview</option>
                  <option value="HR Interview">HR Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              {validationErrors.status && <span className="validation-feedback">{validationErrors.status}</span>}
            </div>

            <div className="input-group">
              <label>Applied Date</label>
              <div className="input-wrapper">
                <input 
                  type="date" 
                  name="appliedDate" 
                  value={formData.appliedDate || ''} 
                  onChange={handleChange} 
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Section: Auxiliary Data */}
          <div className="form-section-header" style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Additional Information</h3>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Location</label>
              <div className="input-wrapper">
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote / Mumbai / Bangalore" />
              </div>
            </div>

            <div className="input-group">
              <label>Application Link</label>
              <div className="input-wrapper">
                <input type="url" name="jobLink" value={formData.jobLink} onChange={handleChange} placeholder="Paste job link (optional)" />
              </div>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '1.5rem' }}>
            <label>Notes</label>
            <div className="input-wrapper">
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                rows="5" 
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Add notes (interview details, contacts, etc.)"
              ></textarea>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)} style={{ padding: '0.8rem 2rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.8rem 3rem' }}>
              {loading ? 'Saving...' : (isEdit ? 'Update Application' : 'Save Application')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
