import React, { useState } from 'react';
import { mockStudentsRoster } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { CalendarCheck, Save, CheckCircle2, XCircle, Clock, Calendar, Check, AlertCircle } from 'lucide-react';

export const FacultyAttendance = () => {
  const { showToast } = useToast();

  const [selectedClass, setSelectedClass] = useState('CLS-AI-6A');
  const [selectedDate, setSelectedDate] = useState('2026-10-13');
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const initial = {};
    mockStudentsRoster.forEach((stu) => {
      initial[stu.id] = stu.attendanceToday || 'Present';
    });
    return initial;
  });
  const [isSaving, setIsSaving] = useState(false);

  // Filter students by selected class
  const classStudents = mockStudentsRoster.filter(
    (stu) => stu.classId === selectedClass || selectedClass === 'ALL'
  );

  const setStatus = (id, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [id]: status
    }));
  };

  const markAll = (status) => {
    const updated = {};
    classStudents.forEach((stu) => {
      updated[stu.id] = status;
    });
    setAttendanceRecords((prev) => ({ ...prev, ...updated }));
    showToast(`Marked all ${classStudents.length} students as ${status}.`, 'info');
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(`Attendance for ${selectedClass} on ${selectedDate} saved to university registrar records.`, 'success');
    }, 850);
  };

  // Calculate live stats
  const presentCount = classStudents.filter((s) => attendanceRecords[s.id] === 'Present').length;
  const absentCount = classStudents.filter((s) => attendanceRecords[s.id] === 'Absent').length;
  const lateCount = classStudents.filter((s) => attendanceRecords[s.id] === 'Late').length;
  const total = classStudents.length;
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Header & Controls */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Attendance Ledger & Daily Register</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Mark student presence, tardiness, and submit official session records
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: 2 }}>
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-input"
              style={{ height: 38, fontSize: '0.84rem' }}
            >
              <option value="CLS-AI-6A">AI-601: Neural Networks (Sec A - 62 Stud)</option>
              <option value="CLS-CSE-4B">CS-403: Data Structures (Sec B - 60 Stud)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: 2 }}>
              Lecture Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
              style={{ height: 38, fontSize: '0.84rem' }}
            />
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button
              onClick={handleSave}
              className="btn btn-cyan"
              disabled={isSaving}
              style={{ height: 38 }}
            >
              <Save size={16} />
              <span>{isSaving ? 'Submitting...' : 'Save & Publish'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Live Stats Bar & Quick Toggles */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Present</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {presentCount} / {total}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Absent</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
              {absentCount}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Late</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {lateCount}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Session Attendance Rate</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              {rate}%
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => markAll('Present')}
            className="btn btn-secondary btn-sm"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="btn btn-secondary btn-sm"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* 3. Students Attendance Marking Table */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Term Attendance</th>
                <th>Status for {selectedDate}</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((stu) => {
                const currentStatus = attendanceRecords[stu.id] || 'Present';
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
                      <span
                        style={{
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          color: stu.attendancePercent < 75 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                        }}
                      >
                        {stu.attendancePercent}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setStatus(stu.id, 'Present')}
                          className={`btn btn-sm ${currentStatus === 'Present' ? 'btn-primary' : 'btn-outline'}`}
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          <CheckCircle2 size={13} /> Present
                        </button>
                        <button
                          onClick={() => setStatus(stu.id, 'Absent')}
                          className={`btn btn-sm ${currentStatus === 'Absent' ? 'btn-danger' : 'btn-outline'}`}
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          <XCircle size={13} /> Absent
                        </button>
                        <button
                          onClick={() => setStatus(stu.id, 'Late')}
                          className={`btn btn-sm ${currentStatus === 'Late' ? 'btn-cyan' : 'btn-outline'}`}
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          <Clock size={13} /> Late
                        </button>
                      </div>
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
