import React from 'react';
import { HelpCircle } from 'lucide-react';

export const EmptyState = ({ icon: Icon = HelpCircle, title, description, actionText, onAction }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-medium)',
        margin: '16px 0'
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          marginBottom: 16
        }}
      >
        <Icon size={26} />
      </div>

      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 6 }}>{title}</h4>
      <p style={{ fontSize: '0.86rem', color: 'var(--text-tertiary)', maxWidth: 420, marginBottom: 18 }}>
        {description}
      </p>

      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', style }) => {
  return (
    <div
      className="shimmer-loading"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};
