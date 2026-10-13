import React, { useState } from 'react';
import { RoleSelector } from './RoleSelector';
import { StudentLoginForm } from './StudentLoginForm';
import { FacultyLoginForm } from './FacultyLoginForm';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const AuthPage = ({ initialRole = null, onBackToLanding }) => {
  // view: 'select' | 'student' | 'faculty'
  const [view, setView] = useState(initialRole || 'select');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99, 102, 241, 0.22), transparent), var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 20px 48px 20px',
        position: 'relative'
      }}
    >
      {/* Top Bar with Brand and Back to Public Site */}
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 36
        }}
      >
        <button
          onClick={onBackToLanding}
          className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem', fontWeight: 500 }}
        >
          <ArrowLeft size={16} /> Public UniSphere Website
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Sparkles size={16} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            Uni<span className="gradient-text">Sphere</span>
          </span>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          Campus Security Gateway v2.4
        </div>
      </div>

      {/* Main Authentication Container */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {view === 'select' && (
          <RoleSelector
            selectedRole={null}
            onSelectRole={(role) => setView(role)}
          />
        )}

        {view === 'student' && (
          <StudentLoginForm
            onBackToRoleSelect={() => setView('select')}
            onSwitchToFaculty={() => setView('faculty')}
          />
        )}

        {view === 'faculty' && (
          <FacultyLoginForm
            onBackToRoleSelect={() => setView('select')}
            onSwitchToStudent={() => setView('student')}
          />
        )}
      </div>
    </div>
  );
};
