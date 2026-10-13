import React, { useState } from 'react';
import { mockFacultyExams, mockStudentsRoster } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { Award, CheckCircle2, AlertCircle, Save, Send, Calculator, BarChart2 } from 'lucide-react';

export const FacultyExamsMarks = () => {
  const { showToast } = useToast();

  const [selectedExamId, setSelectedExamId] = useState('EX-M1-AI601');
  const [marksSheet, setMarksSheet] = useState({
    'STU-2026-8819': 46,
    'STU-2026-8820': 49,
    'STU-2026-8821': 24,
    'STU-2026-8822': 38,
    'STU-2026-8823': 22,
    'STU-2026-8824': 43,
    'STU-2026-8825': 39,
    'STU-2026-8826': 31
  });
  const [isSaving, setIsSaving] = useState(false);

  const activeExam = mockFacultyExams.find((e) => e.id === selectedExamId) || mockFacultyExams[0];
  const students = mockStudentsRoster.filter((s) => s.classId === activeExam.classId);

  const handleMarkChange = (studentId, val) => {
    const num = Number(val);
    if (num > activeExam.maxMarks) {
      showToast(`Score cannot exceed maximum marks (${activeExam.maxMarks}).`, 'error');
      return;
    }
    setMarksSheet((prev) => ({
      ...prev,
      [studentId]: num
    }));
  };

  const handleSaveMarks = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(`Marks for ${activeExam.examName} (${activeExam.subjectCode}) saved and synced with exam cell.`, 'success');
    }, 800);
  };

  // Compute live averages
  const scores = students.map((s) => marksSheet[s.id] || 0);
  const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Header & Exam Selector */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Examination Marks Entry & Moderation</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Record mid-term evaluations, lab assessments, and continuous internal scores
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="form-input"
            style={{ height: 38, fontSize: '0.84rem' }}
          >
            {mockFacultyExams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.examName} • {ex.subjectCode} ({ex.className})
              </option>
            ))}
          </select>

          <button
            onClick={handleSaveMarks}
            className="btn btn-cyan"
            disabled={isSaving}
            style={{ height: 38 }}
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Publish to Registrar'}</span>
          </button>
        </div>
      </div>

      {/* 2. Statistical Overview Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 18,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%), var(--bg-card)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Maximum Marks</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {activeExam.maxMarks} pts
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Cohort Average</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
            {avg} / {activeExam.maxMarks}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Highest Score</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
            {maxScore} pts
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Lowest Score (Intervention)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
            {minScore} pts
          </div>
        </div>
      </div>

      {/* 3. Inline Marks Entry Table */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Attendance</th>
                <th>Awarded Marks (Out of {activeExam.maxMarks})</th>
                <th>Grade Equivalence</th>
                <th>Academic Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => {
                const mark = marksSheet[stu.id] || 0;
                const percent = (mark / activeExam.maxMarks) * 100;
                let grade = 'F';
                if (percent >= 90) grade = 'O (Outstanding)';
                else if (percent >= 80) grade = 'A+ (Excellent)';
                else if (percent >= 70) grade = 'A (Very Good)';
                else if (percent >= 60) grade = 'B+ (Good)';
                else if (percent >= 50) grade = 'B (Above Average)';

                const isFailing = percent < 50;

                return (
                  <tr key={stu.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{stu.rollNumber}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={stu.avatar}
                          alt={stu.name}
                          style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{stu.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                        {stu.attendancePercent}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 140 }}>
                        <input
                          type="number"
                          min="0"
                          max={activeExam.maxMarks}
                          value={mark}
                          onChange={(e) => handleMarkChange(stu.id, e.target.value)}
                          className="form-input"
                          style={{
                            height: 34,
                            padding: '4px 10px',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            borderColor: isFailing ? 'var(--accent-rose)' : undefined
                          }}
                        />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>/{activeExam.maxMarks}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${isFailing ? 'badge-rose' : percent >= 80 ? 'badge-emerald' : 'badge-primary'}`}>
                        {grade}
                      </span>
                    </td>
                    <td>
                      {isFailing ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <AlertCircle size={13} /> Needs Remedial Class
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                          Satisfactory
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
