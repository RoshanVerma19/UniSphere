import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Users, BookOpen, Search, Filter, CheckCircle2, Calendar } from 'lucide-react';

export const FacultyMyClasses = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterSem, setFilterSem] = useState('all');

  const classes = user?.assignedClasses || [];

  const filtered = classes.filter((cls) => {
    const matchesSearch =
      cls.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      cls.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      cls.course.toLowerCase().includes(search.toLowerCase());
    const matchesSem = filterSem === 'all' || cls.semester.toString() === filterSem;
    return matchesSearch && matchesSem;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Filter Controls */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Assigned Academic Classes</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Course, syllabus progress, and section enrollment records for Fall 2026
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Filter by subject or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 34, height: 36, fontSize: '0.84rem', width: 220 }}
            />
          </div>

          <select
            value={filterSem}
            onChange={(e) => setFilterSem(e.target.value)}
            className="form-input"
            style={{ height: 36, fontSize: '0.84rem' }}
          >
            <option value="all">All Semesters</option>
            <option value="4">Semester 4</option>
            <option value="6">Semester 6</option>
          </select>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map((cls) => (
          <div
            key={cls.id}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--border-medium)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>{cls.subjectCode}</span>
                <span className="badge badge-primary">{cls.studentCount} Students</span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>
                {cls.subjectName}
              </h4>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                {cls.course} • Sem {cls.semester} (Section {cls.section})
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                Venue: {cls.room} • Next: {cls.nextClassTime}
              </div>
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Syllabus Delivery</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{cls.syllabusProgress}%</strong>
              </div>
              <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ width: `${cls.syllabusProgress}%`, height: '100%', background: 'linear-gradient(90deg, #0d9488, #2563eb)' }} />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => showToast(`Loaded roster for ${cls.subjectCode} (${cls.studentCount} students).`, 'info')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  View Roster
                </button>
                <button
                  onClick={() => showToast(`Opening attendance ledger for ${cls.subjectCode}.`, 'info')}
                  className="btn btn-cyan btn-sm"
                  style={{ flex: 1 }}
                >
                  Take Attendance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
