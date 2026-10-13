import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BarChart3, TrendingUp, AlertTriangle, Users, Award, ShieldAlert, Mail } from 'lucide-react';
import { mockStudentsRoster } from '../../data/mockData';

export const FacultyAnalytics = () => {
  const { showToast } = useToast();

  const atRiskStudents = mockStudentsRoster.filter((s) => s.needsSupport || s.attendancePercent < 75);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Sample Data Notice */}
      <div
        style={{
          padding: '12px 18px',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}
      >
        <ShieldAlert size={16} color="#0d9488" />
        <span>
          <strong>Faculty Analytics Simulation:</strong> Performance graphs and risk metrics are simulated for demonstration. Connects to Institutional Learning Analytics API.
        </span>
      </div>

      {/* 1. High-Level Macro Analytics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 18
        }}
      >
        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Cohort Pass Rate Estimate</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', marginTop: 4 }}>
            94.8%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Based on Mid-Term 1 and continuous labs
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Mean Assignment Turn-in</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginTop: 4 }}>
            87.2%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            +4.3% higher than departmental average
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Flagged for Intervention</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)', marginTop: 4 }}>
            {atRiskStudents.length} Students
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--accent-rose)', marginTop: 4 }}>
            Attendance &lt;75% or Mid-Term &lt;50%
          </div>
        </div>
      </div>

      {/* 2. Visual Performance Comparison Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Class Attendance Distribution */}
        <div className="glass-panel" style={{ padding: '24px 26px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>Classroom Attendance Distribution</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span>&gt;90% Attendance (Honor Tier)</span>
                <strong>42 Students (68%)</strong>
              </div>
              <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: '#10b981' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span>75% - 90% (Good Standing)</span>
                <strong>16 Students (26%)</strong>
              </div>
              <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ width: '26%', height: '100%', background: '#0d9488' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span>&lt;75% Attendance (Detention Risk)</span>
                <strong style={{ color: 'var(--accent-rose)' }}>4 Students (6%)</strong>
              </div>
              <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ width: '6%', height: '100%', background: '#f43f5e' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Grade Band Distribution */}
        <div className="glass-panel" style={{ padding: '24px 26px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>Mid-Term Grade Band Distribution</h4>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: 160, gap: 16, padding: '0 10px' }}>
            {[
              { band: 'O (90+)', count: 18, pct: 60, color: '#10b981' },
              { band: 'A+ (80-89)', count: 24, pct: 80, color: '#0d9488' },
              { band: 'A (70-79)', count: 12, pct: 40, color: '#2563eb' },
              { band: 'B+ (60-69)', count: 5, pct: 20, color: '#f59e0b' },
              { band: 'F (<50)', count: 3, pct: 12, color: '#f43f5e' }
            ].map((b, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 6 }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{b.count}</span>
                <div style={{ width: '100%', height: `${b.pct}%`, background: b.color, borderRadius: '6px 6px 0 0' }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{b.band}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. At-Risk Student Intervention Detector Table */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color="#f43f5e" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Early Intervention Warning System</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Identifies students requiring academic remediation or counseling before semester examination cutoff
            </p>
          </div>
          <button
            onClick={() => showToast('Batch remedial mentoring advisory issued.', 'info')}
            className="btn btn-secondary btn-sm"
          >
            <Mail size={14} /> Dispatch Batch Notification
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course Section</th>
                <th>Attendance</th>
                <th>CGPA</th>
                <th>Detected Risk Factors</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((stu) => (
                <tr key={stu.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={stu.avatar}
                        alt={stu.name}
                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{stu.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>{stu.rollNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td>Sem {stu.semester} ({stu.section})</td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
                      {stu.attendancePercent}%
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{stu.cgpa.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-rose">
                      {stu.attendancePercent < 75 ? 'Low Attendance (<75%)' : 'Mid-Term Score Alert'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => showToast(`Remedial coaching session scheduled with ${stu.name}.`, 'success')}
                      className="btn btn-secondary btn-sm"
                    >
                      Schedule Remedial Class
                    </button>
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
