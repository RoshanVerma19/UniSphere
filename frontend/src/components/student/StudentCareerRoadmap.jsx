import React from 'react';
import { Compass, Briefcase, Award, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';

export const StudentCareerRoadmap = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Career Readiness Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.14) 100%), var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="badge badge-cyan">CAREER AI ENGINE</span>
            <span className="badge badge-emerald">HIGH PLACEMENT READINESS</span>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Target Role: AI Research Scientist / MLE</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: 540, marginTop: 4 }}>
            Tailored pathway benchmarked against tier-1 AI lab hiring standards (NVIDIA, Google DeepMind, OpenAI).
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Profile ATS Score</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            92 / 100
          </div>
        </div>
      </div>

      {/* Target Skills & Verified Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <div className="glass-panel" style={{ padding: '24px 26px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14 }}>Core Competency Matrix</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { skill: 'PyTorch & Distributed Training', level: 'Advanced (95%)', verified: true },
              { skill: 'Transformer Architecture & Attention', level: 'Advanced (90%)', verified: true },
              { skill: 'CUDA & GPU Kernel Optimization', level: 'Intermediate (65%)', verified: false },
              { skill: 'Vector Databases & RAG Systems', level: 'Proficient (85%)', verified: true }
            ].map((s, idx) => (
              <div key={idx} style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.skill}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>{s.level}</div>
                </div>
                {s.verified ? (
                  <span className="badge badge-emerald"><CheckCircle2 size={12} /> Verified</span>
                ) : (
                  <span className="badge badge-amber">In Progress</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px 26px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14 }}>Curated Campus Opportunities</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { company: 'NVIDIA', role: 'Autonomous AI Intern', deadline: 'Shortlisted for Round 2', tag: 'Interview Scheduled' },
              { company: 'Microsoft Research', role: 'Undergraduate AI Fellow', deadline: 'Apply by Nov 05', tag: 'Recommended' },
              { company: 'Google DeepMind', role: 'Student Researcher 2027', deadline: 'Applications Open Dec', tag: 'Target Match' }
            ].map((opp, idx) => (
              <div key={idx} style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{opp.company}</div>
                  <span className="badge badge-primary" style={{ fontSize: '0.62rem' }}>{opp.tag}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{opp.role}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', marginTop: 4 }}>{opp.deadline}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
