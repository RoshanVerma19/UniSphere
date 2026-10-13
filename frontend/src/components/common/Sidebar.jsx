import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  FileCheck2,
  BrainCircuit,
  CalendarDays,
  LineChart,
  Compass,
  Bell,
  Settings,
  Users,
  ClipboardList,
  Award,
  BarChart3,
  Megaphone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowLeftRight
} from 'lucide-react';

export const Sidebar = ({ currentTab, onSelectTab, isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
  const { user, role, logout, switchRole } = useAuth();

  // Student Navigation Items
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-coach', label: 'AI Success Coach', icon: Sparkles, badge: 'AI', badgeColor: 'cyan' },
    { id: 'academics', label: 'My Academics', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, badge: '89%' },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'exams-assignments', label: 'Exams & Assignments', icon: FileCheck2, badge: '3' },
    { id: 'study-hub', label: 'Study Hub', icon: BrainCircuit },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'career', label: 'Career Roadmap', icon: Compass },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '2', badgeColor: 'rose' },
    { id: 'settings', label: 'Profile & Settings', icon: Settings }
  ];

  // Faculty Navigation Items
  const facultyNavItems = [
    { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { id: 'my-classes', label: 'My Classes', icon: GraduationCap, badge: '3' },
    { id: 'my-subjects', label: 'My Subjects', icon: BookOpen },
    { id: 'student-directory', label: 'Student Directory', icon: Users },
    { id: 'attendance-mgmt', label: 'Attendance Management', icon: CalendarCheck },
    { id: 'assignments-eval', label: 'Assignments & Evaluations', icon: ClipboardList, badge: '28', badgeColor: 'amber' },
    { id: 'exams-marks', label: 'Exams & Marks', icon: Award },
    { id: 'academic-analytics', label: 'Academic Analytics', icon: BarChart3 },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '1' },
    { id: 'settings', label: 'Profile & Settings', icon: Settings }
  ];

  const navItems = role === 'faculty' ? facultyNavItems : studentNavItems;

  const handleNavClick = (id) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99
          }}
          className="show-on-mobile"
        />
      )}

      <aside
        style={{
          width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'var(--bg-glass-strong)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'width var(--transition-normal), transform var(--transition-normal)',
          transform: isMobileOpen ? 'translateX(0)' : 'none'
        }}
        className={isMobileOpen ? 'mobile-sidebar-open' : ''}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0' : '0 20px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Sparkles size={20} />
            </div>

            {!isCollapsed && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
                    Uni<span className="gradient-text">Sphere</span>
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {role === 'faculty' ? 'Faculty Portal' : 'Student Portal'}
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="btn-ghost hide-on-mobile"
              style={{ padding: 6, borderRadius: 'var(--radius-sm)' }}
              title="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Collapsed expand button */}
        {isCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }} className="hide-on-mobile">
            <button
              onClick={onToggleCollapse}
              className="btn-ghost"
              style={{ padding: 6, borderRadius: 'var(--radius-sm)' }}
              title="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Role Pill Banner */}
        {!isCollapsed && (
          <div style={{ padding: '12px 16px 4px 16px' }}>
            <div
              style={{
                background: role === 'faculty' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                border: `1px solid ${role === 'faculty' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: role === 'faculty' ? '#0d9488' : '#2563eb',
                    boxShadow: `0 0 8px ${role === 'faculty' ? '#0d9488' : '#2563eb'}`
                  }}
                />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {role === 'faculty' ? 'Faculty Workspace' : 'Student Workspace'}
                </span>
              </div>
              <button
                onClick={() => switchRole(role === 'faculty' ? 'student' : 'faculty')}
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3
                }}
                title="Switch Portal Role"
              >
                <ArrowLeftRight size={11} /> Switch
              </button>
            </div>
          </div>
        )}

        {/* Navigation Link List */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: isCollapsed ? '10px 0' : '10px 14px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  transition: 'all var(--transition-fast)',
                  position: 'relative'
                }}
                className={!isActive ? 'btn-ghost' : ''}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  size={19}
                  color={isActive ? 'var(--primary)' : 'currentColor'}
                  style={{ flexShrink: 0 }}
                />

                {!isCollapsed && (
                  <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`badge badge-${item.badgeColor || 'primary'}`}
                    style={{ fontSize: '0.68rem', padding: '2px 7px' }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div
          style={{
            padding: isCollapsed ? '12px 6px' : '14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user?.name || 'User'}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border-medium)'
                }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Academic User'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.id}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: 10,
              width: '100%',
              padding: isCollapsed ? '8px 0' : '8px 12px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-rose)',
              fontSize: '0.82rem',
              fontWeight: 500
            }}
            className="btn-danger"
            title="Sign Out"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
