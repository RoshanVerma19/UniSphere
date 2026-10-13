import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { Play, Pause, RotateCcw, BrainCircuit, CheckCircle2, BookOpen, Clock, Sparkles } from 'lucide-react';

export const StudentStudyHub = () => {
  const { showToast } = useToast();

  // Pomodoro Timer State: 25 minutes = 1500 seconds
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      showToast(mode === 'focus' ? '🎉 Focus session complete! Time for a 5-minute break.' : 'Break over! Ready for the next deep work session.', 'success');
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, showToast]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const flashcards = [
    {
      q: 'Why does Multi-Head Attention scale quadratically with sequence length $N$?',
      a: 'Because compute requires calculating all pairwise dot products between $N$ Query and $N$ Key tokens, yielding an $N \\times N$ attention matrix.',
      subject: 'AI-601'
    },
    {
      q: 'What distinguishes Paxos consensus from Raft in distributed systems?',
      a: 'Raft decomposes consensus into explicit Leader Election and Log Replication for human interpretability, whereas Paxos uses symmetric multi-proposer rounds.',
      subject: 'CS-603'
    },
    {
      q: 'What is the Exploration-Exploitation trade-off in Reinforcement Learning?',
      a: 'Balancing trying new actions to gather environment transition info vs taking currently highest-reward actions to maximize cumulative return.',
      subject: 'AI-604'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Pomodoro Focus Engine */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%), var(--bg-card)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <span className="badge badge-primary">UniSphere DEEP WORK</span>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>
          {mode === 'focus' ? '25-Minute High-Retention Study Session' : '5-Minute Cognitive Recovery'}
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
          Backed by neuroscience: structured intervals enhance memory encoding and eliminate cognitive fatigue.
        </p>

        {/* Timer Display */}
        <div
          style={{
            fontSize: '4.8rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
            color: isRunning ? 'var(--primary)' : 'var(--text-primary)',
            textShadow: isRunning ? '0 0 30px rgba(99, 102, 241, 0.4)' : 'none',
            marginBottom: 24
          }}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
          <button
            onClick={toggleTimer}
            className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'} btn-lg`}
            style={{ minWidth: 140 }}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="btn btn-secondary btn-lg"
            title="Reset Timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* 2. Spaced Repetition Revision Flashcards */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Smart Revision Flashcards</h3>
              <Sparkles size={16} color="var(--primary)" />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Curated by the AI Success Coach to reinforce high-yield concepts for end-semester examinations
            </p>
          </div>
          <button
            onClick={() => showToast('Generated 5 new flashcards from recent lecture notes.', 'info')}
            className="btn btn-secondary btn-sm"
          >
            Refresh Cards
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {flashcards.map((card, idx) => (
            <div
              key={idx}
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
                <span className="badge badge-subtle" style={{ marginBottom: 10 }}>{card.subject}</span>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 10, color: 'var(--text-primary)' }}>
                  {card.q}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-card)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                  💡 {card.a}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                <button
                  onClick={() => showToast('Mastery score recorded in academic analytics.', 'success')}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--accent-emerald)' }}
                >
                  <CheckCircle2 size={14} /> Mastered
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
