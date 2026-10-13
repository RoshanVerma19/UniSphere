import React from 'react';
import {
  Sparkles,
  GraduationCap,
  Users,
  CalendarCheck,
  BrainCircuit,
  BarChart3,
  ArrowRight
} from 'lucide-react';

export const LandingPage = ({ onGoToAuth }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Public Navbar */}
      <nav
        className="glass-header"
        style={{
          height: 72,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
              Uni<span className="gradient-text">Sphere</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => onGoToAuth('student')}
            className="btn btn-primary btn-sm"
          >
            <GraduationCap size={16} />
            <span>Student Portal</span>
          </button>
          <button
            onClick={() => onGoToAuth('faculty')}
            className="btn btn-cyan btn-sm"
          >
            <Users size={16} />
            <span>Faculty Portal</span>
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section
        style={{
          padding: '80px 24px 60px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37, 99, 235, 0.10), transparent)'
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-light)',
              border: '1px solid rgba(37, 99, 235, 0.22)',
              color: '#1d4ed8',
              fontSize: '0.84rem',
              fontWeight: 600,
              marginBottom: 24
            }}
          >
            <Sparkles size={16} />
            <span>Your all-in-one academic companion</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: 20
            }}
          >
            Make every semester <span className="gradient-text">your best one</span>
          </h1>

          <p
            style={{
              fontSize: '1.12rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: 680,
              margin: '0 auto 36px auto'
            }}
          >
            UniSphere unifies academics, intelligent attendance, continuous evaluations, and the{' '}
            <strong style={{ color: 'var(--text-primary)' }}>UniSphere AI Study Coach</strong> into one easy-to-use learning space for students and faculty.
          </p>

          {/* Quick Access Dual Portal Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 48
            }}
          >
            <button
              onClick={() => onGoToAuth('student')}
              className="btn btn-primary btn-lg"
              style={{ minWidth: 220 }}
            >
              <GraduationCap size={20} />
              <span>Launch Student Portal</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onGoToAuth('faculty')}
              className="btn btn-cyan btn-lg"
              style={{ minWidth: 220 }}
            >
              <Users size={20} />
              <span>Launch Faculty Portal</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Statistics Bar */}
          <div
            className="glass-panel"
            style={{
              padding: '24px 32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 20,
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                Academic tools in one place
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                &lt; 1 Sec
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                Personalized study guidance
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                94.8%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                Progress tracking
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                24/7
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                Access to your learning hub
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Architectural Pillars */}
      <section style={{ padding: '60px 24px', maxWidth: 1160, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Everything you need to learn and teach
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
            A clearer, calmer way to manage everyday campus life
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Pillar 1: AI Coach */}
          <div className="glass-panel" style={{ padding: '30px 26px', borderRadius: 'var(--radius-xl)' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18
              }}
            >
              <BrainCircuit size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
              UniSphere AI Study Coach
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>
              Get help organizing revision, spotting topics to revisit, building a study plan, and preparing for your next goal.
            </p>
          </div>

          {/* Pillar 2: Attendance System */}
          <div className="glass-panel" style={{ padding: '30px 26px', borderRadius: 'var(--radius-xl)' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18
              }}
            >
              <CalendarCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
              Smart Attendance & Safe Margins
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>
              Faculty mark lecture presence in 1-click while students track safe absence buffers and submit duty leave verification automatically.
            </p>
          </div>

          {/* Pillar 3: Academic Analytics */}
          <div className="glass-panel" style={{ padding: '30px 26px', borderRadius: 'var(--radius-xl)' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #0d9488 0%, #3b82f6 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18
              }}
            >
              <BarChart3 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
              Early At-Risk Interventions
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>
              Statistical alerting detects at-risk learners before semester cutoffs, enabling remedial coaching and proactive mentoring.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Institutional Footer */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--border-subtle)',
          padding: '30px 32px',
          background: 'var(--bg-glass-strong)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
            UniSphere University Ecosystem
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            • Fall 2026 Academic Term
          </span>
        </div>

        <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
          Designed for students and educators • One connected campus
        </div>
      </footer>
    </div>
  );
};
