import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, ChevronDown, ChevronUp, Download } from 'lucide-react';

export const StudentAcademics = () => {
  const { user } = useAuth();
  const [expandedSub, setExpandedSub] = useState('AI-601');

  const semestersHistory = [
    { sem: 1, sgpa: 8.80, credits: 20, status: 'Cleared' },
    { sem: 2, sgpa: 9.05, credits: 22, status: 'Cleared' },
    { sem: 3, sgpa: 8.75, credits: 21, status: 'Cleared' },
    { sem: 4, sgpa: 9.12, credits: 24, status: 'Cleared' },
    { sem: 5, sgpa: 8.98, credits: 23, status: 'Cleared' },
    { sem: 6, sgpa: 8.94, credits: 17, status: 'Current (In Progress)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Transcript Header Stats */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Degree Program</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 4 }}>{user?.program}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Cumulative GPA</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
            {user?.cgpa} / 10.00
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Credits Earned</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: 4 }}>
            {user?.completedCredits} / {user?.totalCredits}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Class Rank</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: 4 }}>
            {user?.rank}
          </div>
        </div>
      </div>

      {/* Current Semester Subjects Enrolled */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Semester 6 Registered Courses</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Curriculum syllabus, instructor information, and continuous internal assessment (CIA)
            </p>
          </div>
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Download Syllabus PDF
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {user?.subjects?.map((sub) => {
            const isExpanded = expandedSub === sub.code;
            return (
              <div
                key={sub.code}
                style={{
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden'
                }}
              >
                <div
                  onClick={() => setExpandedSub(isExpanded ? null : sub.code)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-card)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: sub.color
                      }}
                    >
                      {sub.code}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{sub.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        Instructor: {sub.faculty} • {sub.credits} Academic Credits
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }} className="hide-on-mobile">
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Mid-Term: {sub.midTerm}/50</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)' }}>Projected: {sub.gradeEstimate}</div>
                    </div>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      padding: '16px 20px',
                      borderTop: '1px solid var(--border-subtle)',
                      background: 'var(--bg-glass)',
                      fontSize: '0.85rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: 20
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
                        Syllabus Units Covered:
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <li style={{ display: 'flex', gap: 8 }}><CheckCircle2 size={14} color="#10b981" /> Unit 1: Foundations & Backprop Math (Completed)</li>
                        <li style={{ display: 'flex', gap: 8 }}><CheckCircle2 size={14} color="#10b981" /> Unit 2: CNNs & Spatial Architectures (Completed)</li>
                        <li style={{ display: 'flex', gap: 8 }}><CheckCircle2 size={14} color="#10b981" /> Unit 3: Transformers & Self-Attention (In Progress - 85%)</li>
                        <li style={{ display: 'flex', gap: 8 }}><CheckCircle2 size={14} color="#94a3b8" /> Unit 4: Generative Models (Scheduled for Nov)</li>
                      </ul>
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
                        Continuous Assessment (CIA):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Mid-Term Exam #1 (25%):</span>
                          <strong>{sub.midTerm} / 50</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Internal Assignments (15%):</span>
                          <strong>{sub.internalMarks} / 50</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Classroom Attendance (10%):</span>
                          <strong>{sub.attendance}% ({sub.attended}/{sub.total} classes)</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Semester by Semester History Table */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>
          Historical Semester Transcript (GPA Progression)
        </h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>SGPA</th>
                <th>Credits Earned</th>
                <th>Grade Point Band</th>
                <th>Result Status</th>
              </tr>
            </thead>
            <tbody>
              {semestersHistory.map((row) => (
                <tr key={row.sem}>
                  <td><strong>Semester {row.sem}</strong></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                    {row.sgpa.toFixed(2)}
                  </td>
                  <td>{row.credits} Credits</td>
                  <td>Grade A+ / Outstanding</td>
                  <td>
                    <span className={`badge ${row.status.includes('Progress') ? 'badge-primary' : 'badge-emerald'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
