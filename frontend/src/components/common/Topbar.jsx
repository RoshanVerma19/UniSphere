import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  ArrowLeftRight,
  LogOut,
  User,
  Settings,
  CheckCircle,
  ExternalLink,
  X
} from 'lucide-react';

export const Topbar = ({ currentTab, onOpenMobile, onOpenAiCoach, isCollapsed, onSearchChange }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const getPageTitle = (tabId) => {
    const titles = {
      'dashboard': role === 'faculty' ? 'Faculty Command Center' : 'Student Success Dashboard',
      'ai-coach': 'AI Success Coach (UniSphere Engine)',
      'academics': 'Curriculum & Academic Transcript',
      'attendance': 'Smart Attendance Management & Analytics',
      'subjects': 'Registered Course Enrolment',
      'exams-assignments': 'Exams Schedule & Assignment Submissions',
      'study-hub': 'Intelligent Study Hub & Focus Tools',
      'timetable': 'Weekly Academic Timetable',
      'analytics': 'Comprehensive Academic Analytics',
      'career': 'Career Readiness & Skill Pathway',
      'settings': 'Account & Notification Settings',
      'my-classes': 'Assigned Academic Classes & Sections',
      'my-subjects': 'Faculty Subjects & Syllabus Planning',
      'student-directory': 'Student Directory & Performance Ledger',
      'attendance-mgmt': 'Classroom Attendance Ledger',
      'assignments-eval': 'Assignment Evaluation & Rubrics',
      'exams-marks': 'Continuous Assessment & Examination Marks',
      'academic-analytics': 'Faculty Analytics & At-Risk Intervention',
      'announcements': 'Department Notices & Broadcasts'
    };
    return titles[tabId] || 'UniSphere Workspace';
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'var(--bg-glass-strong)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        gap: 16
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={onOpenMobile}
          className="btn-ghost show-on-mobile"
          style={{ padding: 8, borderRadius: 'var(--radius-sm)' }}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              {getPageTitle(currentTab)}
            </h1>
            <span
              className={`badge ${role === 'faculty' ? 'badge-cyan' : 'badge-primary'}`}
              style={{ fontSize: '0.65rem' }}
            >
              {role === 'faculty' ? 'FACULTY' : 'STUDENT'}
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }} className="hide-on-mobile">
            UniSphere College Operating System • Active Term: Fall 2026
          </div>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div
        style={{
          flex: '0 1 360px',
          position: 'relative'
        }}
        className="hide-on-mobile"
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)'
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={role === 'faculty' ? "Search students, classes, submissions..." : "Search subjects, exams, notes, AI prompts..."}
          className="form-input"
          style={{
            paddingLeft: 38,
            paddingRight: 64,
            height: 38,
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-full)'
          }}
        />
        <span
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.7rem',
            background: 'var(--bg-tertiary)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--text-tertiary)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Right Controls: AI Coach Button, Switch Role, Theme, Notifs, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Quick AI Coach Launcher */}
        <button
          onClick={onOpenAiCoach}
          className="btn btn-primary btn-sm"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
            boxShadow: 'var(--shadow-glow)'
          }}
          title="Launch AI Success Coach"
        >
          <Sparkles size={15} />
          <span className="hide-on-mobile">AI Success Coach</span>
        </button>

        {/* Demo Role Switcher Button */}
        <button
          onClick={() => switchRole(role === 'faculty' ? 'student' : 'faculty')}
          className="btn btn-secondary btn-sm"
          title={`Switch to ${role === 'faculty' ? 'Student' : 'Faculty'} View`}
        >
          <ArrowLeftRight size={14} />
          <span className="hide-on-mobile">
            {role === 'faculty' ? 'View as Student' : 'View as Faculty'}
          </span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn-ghost"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
          aria-label="Toggle dark/light theme"
        >
          {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#2563eb" />}
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) setUnreadCount(0);
            }}
            className="btn-ghost"
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              position: 'relative'
            }}
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--accent-rose)',
                  boxShadow: '0 0 6px var(--accent-rose)'
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 46,
                right: 0,
                width: 340,
                padding: '16px',
                zIndex: 200,
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Recent Notifications</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>UniSphere Alert Feed</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {user?.notifications ? (
                  user.notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: '3px solid var(--primary)',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', lineHeight: 1.35 }}>
                        {n.description}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{n.timestamp}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                    No unread notices at this moment.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '3px 8px 3px 3px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-glass)'
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name || 'User'}
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
            />
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                maxWidth: 100,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              className="hide-on-mobile"
            >
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </button>

          {showProfileMenu && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 46,
                right: 0,
                width: 250,
                padding: '14px',
                zIndex: 200,
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)', marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{user?.email}</div>
                <div style={{ marginTop: 6 }}>
                  <span className={`badge ${role === 'faculty' ? 'badge-cyan' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                    {role === 'faculty' ? 'Faculty Member' : 'Undergraduate Student'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  onClick={() => switchRole(role === 'faculty' ? 'student' : 'faculty')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    textAlign: 'left'
                  }}
                  className="btn-ghost"
                >
                  <ArrowLeftRight size={15} />
                  <span>Switch to {role === 'faculty' ? 'Student' : 'Faculty'} View</span>
                </button>

                <button
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    color: 'var(--accent-rose)',
                    textAlign: 'left'
                  }}
                  className="btn-ghost"
                >
                  <LogOut size={15} />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
