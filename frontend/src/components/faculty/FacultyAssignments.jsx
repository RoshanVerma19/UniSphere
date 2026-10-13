import React, { useState } from 'react';
import { mockFacultyAssignments } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { ClipboardList, Plus, CheckCircle2, Clock, FileText, Send, User } from 'lucide-react';
import { Modal } from '../common/Modal';

export const FacultyAssignments = () => {
  const { showToast } = useToast();

  const [assignments, setAssignments] = useState(mockFacultyAssignments);
  const [activeEvalModal, setActiveEvalModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Evaluation Form state
  const [evalMarks, setEvalMarks] = useState(48);
  const [evalFeedback, setEvalFeedback] = useState('Outstanding PyTorch implementation of Multi-Head Self-Attention. CIFAR-100 test accuracy of 82.4% surpassed baseline expectations.');
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('CLS-AI-6A');
  const [newDeadline, setNewDeadline] = useState('');
  const [newMarks, setNewMarks] = useState(50);

  const handleOpenEval = (asn) => {
    setActiveEvalModal(asn);
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingGrade(true);
    setTimeout(() => {
      setIsSubmittingGrade(false);
      showToast(`Evaluation of ${evalMarks}/50 recorded for Kartikey Patel. Feedback dispatched.`, 'success');
      setActiveEvalModal(null);
      // update evaluated count
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === activeEvalModal.id
            ? { ...a, evaluatedCount: a.evaluatedCount + 1, pendingCount: Math.max(0, a.pendingCount - 1) }
            : a
        )
      );
    }, 800);
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newAsn = {
      id: `F-ASN-0${assignments.length + 1}`,
      title: newTitle,
      classId: newClass,
      className: newClass === 'CLS-AI-6A' ? 'B.Tech AI - Sem 6A' : 'B.Tech CSE - Sem 4B',
      subjectCode: newClass === 'CLS-AI-6A' ? 'AI-601' : 'CS-403',
      totalSubmissions: 0,
      totalExpected: 62,
      evaluatedCount: 0,
      pendingCount: 0,
      deadline: newDeadline || 'Nov 01, 2026',
      maxMarks: Number(newMarks),
      status: 'Accepting Submissions'
    };

    setAssignments([newAsn, ...assignments]);
    setShowCreateModal(false);
    showToast(`Assignment "${newTitle}" posted to student portal successfully!`, 'success');
    setNewTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Create Assignment Button */}
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Assignments & Submissions Evaluation</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Review lab practicals, assign rubric-based marks, and provide continuous feedback
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Create New Assignment
        </button>
      </div>

      {/* Assignment List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {assignments.map((asn) => {
          const isDone = asn.pendingCount === 0;
          return (
            <div
              key={asn.id}
              className="glass-panel"
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
                  <span className="badge badge-cyan">{asn.subjectCode}</span>
                  <span
                    className={`badge ${isDone ? 'badge-emerald' : 'badge-amber'}`}
                    style={{ fontSize: '0.68rem' }}
                  >
                    {asn.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>
                  {asn.title}
                </h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {asn.className} • Max Marks: {asn.maxMarks} pts
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                  Deadline: {asn.deadline}
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 8 }}>
                  <span>Evaluation Progress:</span>
                  <strong>
                    {asn.evaluatedCount} / {asn.totalSubmissions} Evaluated ({asn.pendingCount} Pending)
                  </strong>
                </div>

                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                  <div
                    style={{
                      width: `${asn.totalSubmissions > 0 ? (asn.evaluatedCount / asn.totalSubmissions) * 100 : 0}%`,
                      height: '100%',
                      background: isDone ? '#10b981' : 'linear-gradient(90deg, #f59e0b, #2563eb)'
                    }}
                  />
                </div>

                <button
                  onClick={() => handleOpenEval(asn)}
                  className="btn btn-cyan btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <FileText size={15} />
                  <span>{asn.pendingCount > 0 ? `Evaluate Submissions (${asn.pendingCount})` : 'Review Evaluated Marks'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evaluate Student Submission Modal */}
      {activeEvalModal && (
        <Modal
          isOpen={!!activeEvalModal}
          onClose={() => setActiveEvalModal(null)}
          title={`Evaluating: ${activeEvalModal.title}`}
          subtitle={`Student: Kartikey Patel (STU-2026-8819) • Section A`}
        >
          <form onSubmit={handleGradeSubmit}>
            <div
              style={{
                padding: '14px 16px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 16,
                fontSize: '0.84rem'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                Student Submission Attachment:
              </div>
              <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                📦 https://github.com/kartikeypatel/vit-cifar100-pytorch (Pushed Oct 12, 10:42 PM)
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eval-marks">
                <span>Award Marks (Out of {activeEvalModal.maxMarks})</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                  {evalMarks} / {activeEvalModal.maxMarks}
                </span>
              </label>
              <input
                id="eval-marks"
                type="number"
                min="0"
                max={activeEvalModal.maxMarks}
                value={evalMarks}
                onChange={(e) => setEvalMarks(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eval-feedback">Detailed Rubric Feedback & Comments</label>
              <textarea
                id="eval-feedback"
                className="form-input"
                rows={4}
                value={evalFeedback}
                onChange={(e) => setEvalFeedback(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setActiveEvalModal(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-cyan"
                disabled={isSubmittingGrade}
              >
                {isSubmittingGrade ? 'Publishing Grade...' : 'Save & Publish Feedback'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create New Assignment Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Class Assignment"
        subtitle="Students in the selected class will receive an immediate portal notification"
      >
        <form onSubmit={handleCreateAssignment}>
          <div className="form-group">
            <label className="form-label" htmlFor="asn-title">Assignment Title</label>
            <input
              id="asn-title"
              type="text"
              placeholder="e.g. Diffusion Models Sampling Lab Practical"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="asn-class">Target Class Section</label>
            <select
              id="asn-class"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="form-input"
            >
              <option value="CLS-AI-6A">AI-601: Neural Networks (B.Tech AI Sem 6A)</option>
              <option value="CLS-CSE-4B">CS-403: Data Structures (B.Tech CSE Sem 4B)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="asn-marks">Max Marks</label>
              <input
                id="asn-marks"
                type="number"
                value={newMarks}
                onChange={(e) => setNewMarks(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="asn-deadline">Submission Deadline</label>
              <input
                id="asn-deadline"
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Broadcast Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
