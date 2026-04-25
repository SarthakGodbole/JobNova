import React from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

const DataTable = ({ columns, data, loading, emptyStateParams, renderRow, className = '', style = {} }) => {
  return (
    <div className={`table-responsive ${className}`} style={style}>
      <table className="data-table desktop-only" style={{ width: '100%' }}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={col.className || ''} style={col.style}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
             <tr>
               <td colSpan={columns.length} style={{ padding: 0 }}>
                  <LoadingSkeleton type="table" />
               </td>
             </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ borderBottom: 'none' }}>
                <EmptyState {...(emptyStateParams || {})} />
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
