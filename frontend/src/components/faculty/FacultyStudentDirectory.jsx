import React, { useState } from 'react';
import { mockStudentsRoster } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { Search, Filter, AlertTriangle, CheckCircle, Mail, Phone, User, Award, ShieldAlert } from 'lucide-react';
import { Modal } from '../common/Modal';

export const FacultyStudentDirectory = () => {
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSupport, setFilterSupport] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filtered = mockStudentsRoster.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(search.toLowerCase()) ||
      stu.id.toLowerCase().includes(search.toLowerCase()) ||
      stu.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchesClass = filterClass === 'all' || stu.classId === filterClass;
    const matchesSupport =
      filterSupport === 'all'
        ? true
        : filterSupport === 'support'
        ? stu.needsSupport
        : !stu.needsSupport;
    return matchesSearch && matchesClass && matchesSupport;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Sample Data Disclaimer Banner */}
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
          <strong>Sample Student Roster:</strong> Displaying simulated student records for testing institutional workflows. All student records are fictional.
        </span>
      </div>

      {/* Search and Filters Header */}
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
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Faculty Student Directory</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Search enrolled students across your assigned sections & review attendance/academic standing
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search name, ID, or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 34, height: 36, fontSize: '0.84rem', width: 220 }}
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="form-input"
            style={{ height: 36, fontSize: '0.84rem' }}
          >
            <option value="all">All Classes</option>
            <option value="CLS-AI-6A">AI Sem 6A</option>
            <option value="CLS-CSE-4B">CSE Sem 4B</option>
          </select>

          <select
            value={filterSupport}
            onChange={(e) => setFilterSupport(e.target.value)}
            className="form-input"
            style={{ height: 36, fontSize: '0.84rem' }}
          >
            <option value="all">All Standings</option>
            <option value="support">Needs Intervention (&lt;75% Attendance)</option>
            <option value="good">Good Standing</option>
          </select>
        </div>
      </div>

      {/* Student Directory Table */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Course / Section</th>
                <th>Attendance</th>
                <th>CGPA</th>
                <th>Academic Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((stu) => {
                const isWarning = stu.attendancePercent < 75;
                return (
                  <tr key={stu.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={stu.avatar}
                          alt={stu.name}
                          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{stu.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>{stu.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{stu.id}</td>
                    <td>
                      <div>Sem {stu.semester} - Sec {stu.section}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>{stu.rollNumber}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: isWarning ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                          {stu.attendancePercent}%
                        </span>
                        {isWarning && <AlertTriangle size={14} color="#f43f5e" />}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {stu.cgpa.toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`badge ${stu.needsSupport ? 'badge-rose' : stu.cgpa >= 8.5 ? 'badge-emerald' : 'badge-primary'}`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {stu.gradeCategory}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedStudent(stu)}
                        className="btn btn-secondary btn-sm"
                      >
                        Profile & Notes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile & Academic Notes Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Dossier: ${selectedStudent.name}`}
          subtitle={`${selectedStudent.id} • Roll #${selectedStudent.rollNumber}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedStudent.name}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {selectedStudent.course} • Sem {selectedStudent.semester} (Section {selectedStudent.section})
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {selectedStudent.email}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                padding: '14px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Attendance Rate</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedStudent.attendancePercent < 75 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  {selectedStudent.attendancePercent}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Cumulative GPA</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedStudent.cgpa} / 10.00
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Faculty Academic Notes & Observations:
              </div>
              <div
                style={{
                  padding: '12px 14px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5
                }}
              >
                {selectedStudent.notes}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                type="button"
                onClick={() => {
                  showToast(`Parent counseling notice dispatched for ${selectedStudent.name}.`, 'info');
                  setSelectedStudent(null);
                }}
                className="btn btn-secondary btn-sm"
              >
                Trigger Academic Counseling
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="btn btn-primary btn-sm"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
