import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LineChart, TrendingUp, AlertCircle, Award, Target, Zap, CheckCircle2 } from 'lucide-react';

export const StudentAnalytics = () => {
  const { user } = useAuth();

  const semesters = [
    { sem: 'Sem 1', gpa: 8.80 },
    { sem: 'Sem 2', gpa: 9.05 },
    { sem: 'Sem 3', gpa: 8.75 },
    { sem: 'Sem 4', gpa: 9.12 },
    { sem: 'Sem 5', gpa: 8.98 },
    { sem: 'Sem 6 (Est)', gpa: 9.15 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. CGPA Projection Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%), var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Current Overall CGPA</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginTop: 4 }}>
            {user?.cgpa}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: 4 }}>
            Rank 4 of 128 • Honors Eligible
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Target CGPA Goal</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8', marginTop: 4 }}>
            {user?.targetCgpa}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Requires SGPA ≥ 9.35 in Sem 6 & 7
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Degree Credits Velocity</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981', marginTop: 4 }}>
            71.2%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            114 / 160 credits completed on track
          </div>
        </div>
      </div>

      {/* 2. Visual GPA Progression Chart */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>
          Semester SGPA Progression & Trajectory
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 24 }}>
          Historical academic performance curve across enrolled terms
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, padding: '0 20px', gap: 16 }}>
          {semesters.map((item, idx) => {
            const heightPercent = ((item.gpa - 7.5) / (10.0 - 7.5)) * 100;
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 10 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                  {item.gpa.toFixed(2)}
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 54,
                    height: `${heightPercent}%`,
                    background: idx === semesters.length - 1 ? 'linear-gradient(180deg, #0d9488 0%, #2563eb 100%)' : 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)',
                    borderRadius: '8px 8px 0 0',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    transition: 'height 0.4s ease'
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  {item.sem}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Strengths vs Subject Diagnostic */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Academic Strengths */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Award size={18} color="#10b981" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Identified Core Strengths</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Neural Architecture Implementation</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Top 2% in PyTorch and tensor calculus assignments. 96% internal average.
              </div>
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Reinforcement Learning & MDPs</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Exceptional problem-solving speed in Bellman optimality proofs.
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Interventions */}
        <div className="glass-panel" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertCircle size={18} color="#f59e0b" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Recommended High-Yield Interventions</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Distributed Cloud Consistency Proofs (CS-603)</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Mid-Term scored 36/50. Practice multi-node partitioned network state machines.
              </div>
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Syllabus Coverage: Generative Diffusion Models</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Upcoming unit with 20% end-term weightage. Pre-read DDPM papers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
