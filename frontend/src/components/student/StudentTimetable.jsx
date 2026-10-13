import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, User, ChevronRight } from 'lucide-react';

export const StudentTimetable = () => {
  const [selectedDay, setSelectedDay] = useState('Tuesday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const scheduleData = {
    'Monday': [
      { time: '09:00 - 10:15 AM', code: 'AI-601', name: 'Neural Networks & Deep Learning', hall: 'Hall 302', faculty: 'Dr. Arvind Sharma' },
      { time: '10:30 - 11:45 AM', code: 'CS-603', name: 'Distributed Cloud Architectures', hall: 'Hall 2A', faculty: 'Dr. Rajesh Kothari' },
      { time: '01:30 - 04:30 PM', code: 'AI-601L', name: 'Deep Learning Practical Lab', hall: 'GPU Computing Lab 1', faculty: 'Dr. Arvind Sharma' }
    ],
    'Tuesday': [
      { time: '09:00 - 10:15 AM', code: 'AI-601', name: 'Neural Networks & Deep Learning', hall: 'Hall 302', faculty: 'Dr. Arvind Sharma', isPassed: true },
      { time: '10:30 - 11:45 AM', code: 'AI-602', name: 'Natural Language Processing', hall: 'Lab 4A', faculty: 'Prof. Sunita Rao', isLive: true },
      { time: '01:30 - 03:00 PM', code: 'CS-603', name: 'Cloud Systems Lab Session', hall: 'Computing Lab 2', faculty: 'Dr. Rajesh Kothari' },
      { time: '03:15 - 04:30 PM', code: 'AI-604', name: 'Reinforcement Learning & Robotics', hall: 'Smart Room 108', faculty: 'Dr. Arvind Sharma' }
    ],
    'Wednesday': [
      { time: '09:00 - 10:15 AM', code: 'AI-602', name: 'Natural Language Processing', hall: 'Hall 302', faculty: 'Prof. Sunita Rao' },
      { time: '10:30 - 11:45 AM', code: 'HS-605', name: 'Engineering Ethics & AI Policy', hall: 'Auditorium B', faculty: 'Dr. Meenakshi Iyer' },
      { time: '02:00 - 04:00 PM', code: 'PRJ-699', name: 'Capstone AI Project Mentorship', hall: 'AI Innovation Hub', faculty: 'Dr. Arvind Sharma' }
    ],
    'Thursday': [
      { time: '09:00 - 10:15 AM', code: 'CS-603', name: 'Distributed Cloud Architectures', hall: 'Hall 2A', faculty: 'Dr. Rajesh Kothari' },
      { time: '10:30 - 11:45 AM', code: 'AI-604', name: 'Reinforcement Learning & Robotics', hall: 'Smart Room 108', faculty: 'Dr. Arvind Sharma' },
      { time: '01:30 - 03:30 PM', code: 'TUT-601', name: 'Deep Learning Problem Tutorial', hall: 'Hall 302', faculty: 'Dr. Arvind Sharma' }
    ],
    'Friday': [
      { time: '09:30 - 11:30 AM', code: 'AI-602L', name: 'NLP & LLM Tuning Lab Session', hall: 'Computing Lab 4', faculty: 'Prof. Sunita Rao' },
      { time: '01:30 - 03:00 PM', code: 'SEM-610', name: 'Department Research Colloquium', hall: 'Main Seminar Hall', faculty: 'Guest Speakers' }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Day Selector Pills */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: 10, overflowX: 'auto' }}>
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <CalendarDays size={14} />
              <span>{day}</span>
              {day === 'Tuesday' && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', marginLeft: 4 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Schedule for Selected Day */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {selectedDay} Academic Timetable
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Section A • B.Tech AI & Data Science
            </p>
          </div>
          <span className="badge badge-primary">Semester 6 Regular Schedule</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {scheduleData[selectedDay]?.map((slot, idx) => (
            <div
              key={idx}
              style={{
                padding: '18px 22px',
                borderRadius: 'var(--radius-lg)',
                background: slot.isLive ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-tertiary)',
                border: slot.isLive ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                boxShadow: slot.isLive ? 'var(--shadow-glow)' : 'none',
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
                    color: 'var(--primary)'
                  }}
                >
                  {slot.code}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>{slot.name}</span>
                    {slot.isLive && (
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem', animation: 'pulseGlow 2s infinite' }}>
                        NOW IN SESSION
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={13} color="var(--text-tertiary)" /> {slot.faculty}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={13} color="var(--text-tertiary)" /> {slot.hall}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  color: slot.isLive ? 'var(--primary)' : 'var(--text-secondary)',
                  background: 'var(--bg-card)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <Clock size={14} />
                <span>{slot.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
