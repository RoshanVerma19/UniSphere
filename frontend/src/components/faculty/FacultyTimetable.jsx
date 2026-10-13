import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';

export const FacultyTimetable = () => {
  const [selectedDay, setSelectedDay] = useState('Tuesday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const schedule = {
    'Monday': [
      { time: '09:00 - 10:15 AM', code: 'AI-601', title: 'Neural Networks & Deep Learning', classCode: 'AI Sem 6A', venue: 'Hall 302', type: 'Lecture' },
      { time: '01:30 - 04:30 PM', code: 'AI-601L', title: 'Deep Learning Practical Lab', classCode: 'AI Sem 6A', venue: 'GPU Computing Lab 1', type: 'Lab Session' }
    ],
    'Tuesday': [
      { time: '09:00 - 10:15 AM', code: 'AI-601', title: 'Neural Networks & Deep Learning', classCode: 'AI Sem 6A', venue: 'Hall 302', type: 'Lecture', isDone: true },
      { time: '01:30 - 02:30 PM', code: 'COUNCIL', title: 'NBA Accreditation Committee Review', classCode: 'Faculty Council', venue: 'Boardroom 1', type: 'Admin Meeting' },
      { time: '03:15 - 04:30 PM', code: 'AI-604', title: 'Reinforcement Learning & Robotics', classCode: 'AI Sem 6A', venue: 'Smart Room 108', type: 'Lecture' }
    ],
    'Wednesday': [
      { time: '11:30 - 12:45 PM', code: 'CS-403', title: 'Data Structures in C++', classCode: 'CSE Sem 4B', venue: 'Lecture Complex 104', type: 'Lecture' },
      { time: '02:00 - 04:00 PM', code: 'OFFICE', title: 'Student Mentorship & Doubt Clinic', classCode: 'All Students', venue: 'Cabin #412', type: 'Office Hours' }
    ],
    'Thursday': [
      { time: '10:30 - 11:45 AM', code: 'AI-604', title: 'Reinforcement Learning & Robotics', classCode: 'AI Sem 6A', venue: 'Smart Room 108', type: 'Lecture' },
      { time: '01:30 - 03:30 PM', code: 'TUT-601', title: 'Deep Learning Tutorial & Problem Solving', classCode: 'AI Sem 6A', venue: 'Hall 302', type: 'Tutorial' }
    ],
    'Friday': [
      { time: '10:00 - 11:15 AM', code: 'CS-403', title: 'Data Structures in C++', classCode: 'CSE Sem 4B', venue: 'Lecture Complex 104', type: 'Lecture' },
      { time: '02:00 - 04:30 PM', code: 'RESEARCH', title: 'Neuro-Symbolic AI Research Meeting', classCode: 'PhD Scholars', venue: 'AI Innovation Lab', type: 'Research' }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Day Selector */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: 10, overflowX: 'auto' }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`btn ${selectedDay === day ? 'btn-cyan' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <CalendarDays size={14} />
            <span>{day}</span>
          </button>
        ))}
      </div>

      {/* Daily Teaching Schedule */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 18 }}>
          Faculty Teaching Schedule — {selectedDay}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {schedule[selectedDay]?.map((slot, idx) => (
            <div
              key={idx}
              style={{
                padding: '18px 22px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: '#0d9488'
                  }}
                >
                  {slot.code}
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{slot.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Users size={13} color="var(--text-tertiary)" /> {slot.classCode}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={13} color="var(--text-tertiary)" /> {slot.venue}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="badge badge-subtle">{slot.type}</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Clock size={14} />
                  <span>{slot.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
