import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CalendarCheck, AlertTriangle, ShieldCheck, Plus, CheckCircle, FileText } from 'lucide-react';
import { Modal } from '../common/Modal';

export const StudentAttendance = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingLeave(true);
    setTimeout(() => {
      setIsSubmittingLeave(false);
      setShowLeaveModal(false);
      showToast('Leave application submitted to Department Academic Committee.', 'success');
      setLeaveReason('');
      setLeaveDate('');
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Attendance Header & Safe-Zone Stats */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%), var(--bg-card)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Cumulative Attendance</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', marginTop: 4 }}>
            {user?.attendanceOverall || 89.4}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {user?.attendanceAttended || 279} Attended of {user?.attendanceTotalClasses || 312} Held
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Safe Margin Calculator</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8', marginTop: 8 }}>
            Safe to miss 4 classes
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Attendance will stay strictly above mandatory 75% university norm
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="btn btn-primary"
            style={{ width: 'fit-content' }}
          >
            <Plus size={16} /> Apply for Duty Leave / Exemption
          </button>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 18 }}>
          Subject-Wise Attendance Breakdown
        </h3>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Faculty</th>
                <th>Classes Held</th>
                <th>Attended</th>
                <th>Percentage</th>
                <th>Regulation Status</th>
              </tr>
            </thead>
            <tbody>
              {user?.subjects?.map((sub) => {
                const isSafe = sub.attendance >= 85;
                const isWarning = sub.attendance < 80;
                return (
                  <tr key={sub.code}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: sub.color }}>
                      {sub.code}
                    </td>
                    <td><strong>{sub.name}</strong></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{sub.faculty}</td>
                    <td>{sub.total}</td>
                    <td>{sub.attended}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          {sub.attendance}%
                        </span>
                        <div style={{ width: 60, height: 6, background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${sub.attendance}%`,
                              height: '100%',
                              background: isSafe ? '#10b981' : isWarning ? '#f59e0b' : '#2563eb'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${isSafe ? 'badge-emerald' : isWarning ? 'badge-amber' : 'badge-primary'}`}>
                        {isSafe ? 'Safe (>85%)' : isWarning ? 'Attention (<80%)' : 'Eligible'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Application Modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Apply for Academic / Duty Leave"
        subtitle="Submit medical certificate or event participation receipt for attendance exemption"
      >
        <form onSubmit={handleLeaveSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="leave-type">Exemption Category</label>
            <select id="leave-type" className="form-input">
              <option>Medical Leave (Doctor Certificate attached)</option>
              <option>Hackathon / MLH Conference Duty Leave</option>
              <option>Sports & University Representation</option>
              <option>Family Emergency</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="leave-date">Date of Absence</label>
            <input
              id="leave-date"
              type="date"
              className="form-input"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="leave-reason">Reason & Supporting Details</label>
            <textarea
              id="leave-reason"
              className="form-input"
              rows={3}
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              placeholder="Provide reason and list the subjects missed on this date..."
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setShowLeaveModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmittingLeave}
            >
              {isSubmittingLeave ? 'Submitting...' : 'Submit Exemption Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
