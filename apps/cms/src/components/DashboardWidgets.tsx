import React from 'react';

const DashboardWidgets: React.FC = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    }}>
      <div style={{
        background: '#1b2a51',
        color: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
      }}>
        <h3 style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>RIKAS CMS</h3>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', opacity: 0.6 }}>
          Kelola konten website RIKAS Indo Technology
        </p>
      </div>
    </div>
  );
};

export default DashboardWidgets;
