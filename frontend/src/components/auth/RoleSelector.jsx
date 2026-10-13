import React from 'react';
import { GraduationCap, Users, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const RoleSelector = ({ onSelectRole, selectedRole }) => {
  return (
    <div style={{ width: '100%', maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: 14
          }}
        >
          <Sparkles size={14} /> Unified Institutional Authentication
        </div>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10 }}>
          Welcome to <span className="gradient-text">UniSphere</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: 540, margin: '0 auto' }}>
          Select your dedicated portal to access your personalized academic workspace, AI tools, and institutional records.
        </p>
      </div>

      {/* Two Attractive Role Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          textAlign: 'left'
        }}
      >
        {/* Student Portal Card */}
        <div
          className="glass-panel glass-panel-hover"
          style={{
            padding: '32px 28px',
            borderRadius: 'var(--radius-xl)',
            border: selectedRole === 'student' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
            boxShadow: selectedRole === 'student' ? 'var(--shadow-glow)' : 'var(--shadow-md)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.055) 0%, #ffffff 100%)'
          }}
        >
          <div>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.35)'
              }}
            >
              <GraduationCap size={30} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Student Portal</h3>
              <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>Learner Hub</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 20 }}>
              Access your academics, AI Success Coach, study planner, attendance, timetable, and degree progress.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28 }}>
              {[
                'Personalized AI Success Coach (UniSphere)',
                'Real-time attendance & safe zone tracker',
                'Curriculum, marks & CGPA goals',
                'Smart study planner & exam countdowns'
              ].map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="#10b981" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onSelectRole('student')}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Continue as Student</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Faculty Portal Card */}
        <div
          className="glass-panel glass-panel-hover"
          style={{
            padding: '32px 28px',
            borderRadius: 'var(--radius-xl)',
            border: selectedRole === 'faculty' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-medium)',
            boxShadow: selectedRole === 'faculty' ? 'var(--shadow-cyan-glow)' : 'var(--shadow-md)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(15, 118, 110, 0.055) 0%, #ffffff 100%)'
          }}
        >
          <div>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #0d9488 0%, #075985 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                boxShadow: '0 8px 16px rgba(6, 182, 212, 0.35)'
              }}
            >
              <Users size={28} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Faculty Portal</h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>Educator Hub</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 20 }}>
              Manage classes, student performance, classroom attendance, assignment evaluations, and academic analytics.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28 }}>
              {[
                'Assigned classes & roster directory',
                '1-click attendance marking & records',
                'Assignment grading with rubric feedback',
                'Academic analytics & at-risk student intervention'
              ].map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="#0d9488" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onSelectRole('faculty')}
            className="btn btn-cyan btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Continue as Faculty</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Security Disclaimer Banner */}
      <div
        style={{
          marginTop: 28,
          padding: '12px 18px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.78rem',
          color: 'var(--text-tertiary)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <ShieldCheck size={16} color="var(--primary)" />
        <span>Institutional Access Note: Authentication & role permissions are verified cryptographically via university identity server. Selecting a role configures the portal interface.</span>
      </div>
    </div>
  );
};
