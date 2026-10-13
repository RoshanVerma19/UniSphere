import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  FileCheck2,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Award,
  ChevronRight,
  Target,
  BarChart2
} from 'lucide-react';

export const StudentDashboard = ({ onNavigateTab, onOpenCoach }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [studyPlan, setStudyPlan] = useState(user?.todayStudyPlan || []);

  const toggleTask = (id) => {
    setStudyPlan((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          showToast(
            next ? `Great work! Marked "${t.title}" complete.` : `Unchecked "${t.title}".`,
            next ? 'success' : 'info'
          );
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Student Hero Profile Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(6, 182, 212, 0.12) 100%), var(--bg-card)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            style={{
              width: 76,
              height: 76,
              borderRadius: 'var(--radius-lg)',
              objectFit: 'cover',
              border: '3px solid var(--primary)',
              boxShadow: 'var(--shadow-glow)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
                Welcome, {user?.name || 'Kartikey Patel'}!
              </h2>
              <span className="badge badge-primary">
                Semester {user?.semester || 6} • Sec {user?.section || 'A'}
              </span>
              <span className="badge badge-emerald">
                Academic Standing: Excellent
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
              {user?.program || 'B.Tech in Artificial Intelligence & Data Science'} • Roll #{user?.rollNumber || '23AI089'}
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              Faculty Advisor: {user?.advisor || 'Dr. Arvind Sharma'} • Class Rank: {user?.rank || '4th of 128'}
            </div>
          </div>
        </div>

        {/* Quick AI Coach Action Card */}
        <div
          onClick={onOpenCoach}
          className="glass-panel glass-panel-hover"
          style={{
            padding: '14px 20px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            maxWidth: 320
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.5)'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
              AI Coach Ready
            </div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              "1 urgent assignment & 3 upcoming exams detected"
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Academic Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 18
        }}
      >
        {/* CGPA & Academic Goals */}
        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Current CGPA
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Target size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {user?.cgpa || '8.94'}
            </span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>/ 10.00</span>
          </div>

          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
              <span>Target: {user?.targetCgpa || '9.20'}</span>
              <span>+0.26 required</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: '89.4%', height: '100%', background: 'linear-gradient(90deg, #2563eb, #0d9488)' }} />
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={12} /> Top 3% of Department Cohort
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Overall Attendance
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-emerald-light)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CalendarCheck size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
              {user?.attendanceOverall || '89.4'}%
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>SAFE (&gt;75%)</span>
          </div>

          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
              <span>{user?.attendanceAttended || 279} / {user?.attendanceTotalClasses || 312} Classes</span>
              <span>Can miss 4 without risk</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${user?.attendanceOverall || 89.4}%`, height: '100%', background: '#10b981' }} />
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
            Mandatory university threshold: 75.0%
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Pending Tasks
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-amber-light)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileCheck2 size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
              2
            </span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Due this week</span>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
            Urgent: ViT PyTorch Implementation (Due Tomorrow)
          </div>
          <button
            onClick={() => onNavigateTab('exams-assignments')}
            style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Review all submissions <ChevronRight size={13} />
          </button>
        </div>

        {/* Upcoming Examinations */}
        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Next Examination
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-purple-light)',
                color: 'var(--accent-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Oct 28, 2026
            </span>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
            AI-601: Deep Learning Theory (15 Days left)
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
            Hall 4B • 09:30 AM - 12:30 PM
          </div>
        </div>
      </div>

      {/* 3. Middle Grid: Subject Performance & Today's Study Plan */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24
        }}
      >
        {/* Subject-Wise Performance & Internal Marks */}
        <div className="glass-panel" style={{ padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Subject Performance Overview</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>Internal marks and attendance standing</p>
            </div>
            <button
              onClick={() => onNavigateTab('academics')}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}
            >
              View Full Syllabus
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {user?.subjects?.map((sub) => (
              <div
                key={sub.code}
                style={{
                  padding: '12px 14px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem', color: sub.color }}>
                      {sub.code}
                    </span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {sub.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: 3 }}>
                    Faculty: {sub.faculty} • {sub.credits} Credits
                  </div>

                  {/* Attendance & marks bar */}
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, height: 5, background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ width: `${(sub.midTerm / 50) * 100}%`, height: '100%', background: sub.color }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {sub.midTerm}/50 Mid-Term
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: sub.attendance >= 85 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                    {sub.attendance}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Attendance</div>
                  <span
                    className={`badge ${sub.gradeEstimate.startsWith('O') || sub.gradeEstimate.startsWith('A') ? 'badge-emerald' : 'badge-amber'}`}
                    style={{ fontSize: '0.62rem', marginTop: 4 }}
                  >
                    Est: {sub.gradeEstimate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's AI Study Plan Checklist */}
        <div className="glass-panel" style={{ padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Today's AI Study Plan</h3>
                <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>AI OPTIMIZED</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
                Personalized task queue based on upcoming exams & assignments
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('study-hub')}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}
            >
              Study Hub →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {studyPlan.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: task.completed ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-tertiary)',
                  border: task.completed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ marginTop: 2, color: task.completed ? 'var(--accent-emerald)' : 'var(--text-tertiary)' }}>
                  {task.completed ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)'
                    }}
                  >
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 3 }}>
                    {task.reason}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                    <span>🕒 {task.time}</span>
                    <span>📚 {task.subject}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Study Progress summary */}
          <div
            style={{
              marginTop: 20,
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
              <span>Weekly Focus Target</span>
              <span>18.5 / 25 Hours (74%)</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: '74%', height: '100%', background: 'linear-gradient(90deg, #2563eb, #0d9488)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Today's Live Timetable & Recent Announcements */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24
        }}
      >
        {/* Today's Timetable */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Today's Class Schedule</h3>
            <button
              onClick={() => onNavigateTab('timetable')}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}
            >
              Full Timetable
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {user?.timetableToday?.map((slot, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: slot.isLive ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-tertiary)',
                  border: slot.isLive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>{slot.code}</span>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{slot.name}</span>
                    {slot.isLive && (
                      <span className="badge badge-primary" style={{ animation: 'pulseGlow 2s infinite', fontSize: '0.62rem' }}>
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {slot.faculty} • {slot.hall}
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {slot.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Campus Alerts */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Important Notifications</h3>
            <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>2 NEW</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {user?.notifications?.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  borderLeft: notif.unread ? '3px solid var(--primary)' : '3px solid var(--border-medium)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{notif.title}</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                    {notif.timestamp}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                  {notif.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
