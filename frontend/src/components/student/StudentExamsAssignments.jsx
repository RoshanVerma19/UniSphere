import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FileCheck2, Clock, Upload, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Modal } from '../common/Modal';

export const StudentExamsAssignments = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [assignments, setAssignments] = useState(user?.assignments || []);
  const [activeSubmitModal, setActiveSubmitModal] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenSubmit = (asn) => {
    setActiveSubmitModal(asn);
    setGithubUrl('');
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      showToast('Please provide a submission link or file repository URL.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setAssignments((prev) =>
        prev.map((a) => (a.id === activeSubmitModal.id ? { ...a, status: 'Submitted', grade: 'Under Review' } : a))
      );
      setIsSubmitting(false);
      setActiveSubmitModal(null);
      showToast(`Assignment "${activeSubmitModal.title}" submitted successfully!`, 'success');
    }, 850);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Upcoming Examination Schedule */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Upcoming Examinations Schedule</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              End-semester theory assessments and practical moderation
            </p>
          </div>
          <button
            onClick={() => showToast('Official University Hall Ticket downloaded.', 'info')}
            className="btn btn-secondary btn-sm"
          >
            Download Hall Ticket
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {user?.upcomingExams?.map((exam) => (
            <div
              key={exam.id}
              style={{
                padding: '18px 20px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span className="badge badge-primary">{exam.subjectCode}</span>
                  <span className="badge badge-rose">{exam.urgency} Priority</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.96rem', marginBottom: 6 }}>
                  {exam.subjectName}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {exam.examType}
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={13} color="var(--primary)" />
                  <strong style={{ color: 'var(--text-primary)' }}>{exam.date}</strong> ({exam.time})
                </div>
                <div>📍 {exam.hall}</div>
                <div style={{ marginTop: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 3 }}>
                    <span>Syllabus Coverage</span>
                    <span>{exam.syllabusCovered}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${exam.syllabusCovered}%`, height: '100%', background: '#2563eb' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Coursework & Pending Assignments */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 18 }}>
          Lab Submissions & Course Assignments
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {assignments.map((asn) => {
            const isSubmitted = asn.status === 'Submitted';
            return (
              <div
                key={asn.id}
                style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: isSubmitted ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16
                }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {asn.subjectCode}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>{asn.title}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {asn.subject} • Weightage: {asn.points} • Format: {asn.submissionFormat}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: asn.priority === 'Urgent' ? 'var(--accent-rose)' : 'var(--text-tertiary)', marginTop: 4 }}>
                    Deadline: {asn.dueDate}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    className={`badge ${isSubmitted ? 'badge-emerald' : asn.priority === 'Urgent' ? 'badge-rose' : 'badge-amber'}`}
                  >
                    {isSubmitted ? `Submitted (${asn.grade || 'Graded'})` : asn.status}
                  </span>

                  {!isSubmitted ? (
                    <button
                      onClick={() => handleOpenSubmit(asn)}
                      className="btn btn-primary btn-sm"
                    >
                      <Upload size={14} /> Submit Solution
                    </button>
                  ) : (
                    <button
                      onClick={() => showToast('Solution file retrieved from university cloud storage.', 'info')}
                      className="btn btn-secondary btn-sm"
                    >
                      View Submission
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assignment Submission Modal */}
      {activeSubmitModal && (
        <Modal
          isOpen={!!activeSubmitModal}
          onClose={() => setActiveSubmitModal(null)}
          title={`Submit: ${activeSubmitModal.title}`}
          subtitle={`Subject: ${activeSubmitModal.subject} • Format: ${activeSubmitModal.submissionFormat}`}
        >
          <form onSubmit={handleConfirmSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="repo-url">Repository or Google Drive / Cloud URL</label>
              <input
                id="repo-url"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/kartikeypatel/vit-cifar100-pytorch"
                className="form-input"
                required
              />
            </div>

            <div
              style={{
                border: '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '24px 20px',
                textAlign: 'center',
                background: 'var(--bg-input)',
                marginBottom: 20
              }}
            >
              <Upload size={24} color="var(--primary)" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Or Drag & Drop Submission Archive</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Supports .zip, .ipynb, .pdf up to 50MB</div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveSubmitModal(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Uploading to Portal...' : 'Confirm Submission'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
