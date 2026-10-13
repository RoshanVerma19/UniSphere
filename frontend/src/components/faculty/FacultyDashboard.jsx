import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  BookOpen,
  Plus
} from 'lucide-react';

export const FacultyDashboard = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Faculty Hero Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(99, 102, 241, 0.12) 100%), var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            style={{
              width: 76,
              height: 76,
              borderRadius: 'var(--radius-lg)',
              objectFit: 'cover',
              border: '3px solid var(--accent-cyan)',
              boxShadow: 'var(--shadow-cyan-glow)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
                Welcome, {user?.name || 'Dr. Arvind Sharma'}!
              </h2>
              <span className="badge badge-cyan">
                {user?.title || 'Associate Professor'}
              </span>
              <span className="badge badge-primary">
                Employee #{user?.id || 'FAC-ENG-402'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
              {user?.department || 'Department of Artificial Intelligence & Data Science'}
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              Cabin: {user?.cabin} • Specialization: {user?.specialization}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigateTab('attendance-mgmt')}
            className="btn btn-cyan btn-sm"
          >
            <CalendarCheck size={15} /> Take Attendance
          </button>
          <button
            onClick={() => onNavigateTab('assignments-eval')}
            className="btn btn-primary btn-sm"
          >
            <ClipboardList size={15} /> Evaluate (28)
          </button>
        </div>
      </div>

      {/* 2. Key Faculty Stat Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 18
        }}
      >
        {/* Total Students */}
        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Assigned Students
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--accent-cyan-light)', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {user?.totalStudentsAssigned || 184}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            Across 3 active class sections
          </div>
        </div>

        {/* Classes Assigned */}
        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Assigned Courses
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {user?.totalClassesAssigned || 3}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            AI-601, AI-604, CS-403
          </div>
        </div>

        {/* Today's Attendance Progress */}
        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Today's Attendance
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
              2 / 3
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Classes Marked</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            Next: AI-604 (Sec A) at 03:15 PM
          </div>
        </div>

        {/* Pending Evaluations */}
        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Pending Evaluations
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--accent-amber-light)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
              28
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Submissions</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--accent-amber)', marginTop: 4 }}>
            Vision Transformer assignment
          </div>
        </div>
      </div>

      {/* 3. Assigned Classes Cards */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Assigned Academic Classes</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Current semester teaching load & classroom performance metrics
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('my-classes')}
            className="btn-ghost"
            style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}
          >
            Manage Classes →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {user?.assignedClasses?.map((cls) => (
            <div
              key={cls.id}
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span className="badge badge-cyan">{cls.subjectCode}</span>
                  <span className="badge badge-primary">{cls.studentCount} Students</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>
                  {cls.subjectName}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {cls.course} • Sem {cls.semester} ({cls.section})
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Avg Attendance:</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{cls.attendanceAvg}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Syllabus Covered:</span>
                  <strong style={{ color: 'var(--primary)' }}>{cls.syllabusProgress}%</strong>
                </div>
                <div style={{ height: 5, background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${cls.syllabusProgress}%`, height: '100%', background: '#0d9488' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Today's Faculty Schedule & Academic Announcements */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24
        }}
      >
        {/* Today's Schedule */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Today's Academic Schedule</h3>
            <button
              onClick={() => onNavigateTab('timetable')}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}
            >
              Full Schedule
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {user?.todaySchedule?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: item.status === 'Completed' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{item.classCode}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.subject}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    📍 {item.room} • {item.attendanceStatus}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600 }}>{item.time}</div>
                  <span
                    className={`badge ${item.status === 'Completed' ? 'badge-emerald' : 'badge-amber'}`}
                    style={{ fontSize: '0.62rem', marginTop: 4 }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Active Announcements</h3>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}
            >
              Post Notice
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {user?.announcements?.map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  borderLeft: '3px solid var(--accent-cyan)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{ann.title}</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{ann.date}</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', marginTop: 2 }}>
                  Audience: {ann.targetClass}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                  {ann.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
