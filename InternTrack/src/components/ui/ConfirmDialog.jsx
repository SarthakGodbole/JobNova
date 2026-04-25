import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="modal-content" style={{ animation: 'slideUp 0.3s ease-out', textAlign: 'center' }}>
        {isDestructive && <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent)' }}>⚠️</div>}
        <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{title}</h3>
        <p className="text-muted" style={{ marginBottom: '2rem', lineHeight: 1.5 }}>{message}</p>
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn-secondary" onClick={onCancel}>{cancelText}</button>
          <button className={isDestructive ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
