import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Common Components
import { Sidebar } from './components/common/Sidebar';
import { Topbar } from './components/common/Topbar';
import { SettingsView } from './components/common/SettingsView';
import { Modal } from './components/common/Modal';

// Landing & Auth
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { AISuccessCoach } from './components/student/AISuccessCoach';
import { StudentAcademics } from './components/student/StudentAcademics';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentExamsAssignments } from './components/student/StudentExamsAssignments';
import { StudentStudyHub } from './components/student/StudentStudyHub';
import { StudentTimetable } from './components/student/StudentTimetable';
import { StudentAnalytics } from './components/student/StudentAnalytics';
import { StudentCareerRoadmap } from './components/student/StudentCareerRoadmap';

// Faculty Views
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { FacultyMyClasses } from './components/faculty/FacultyMyClasses';
import { FacultyStudentDirectory } from './components/faculty/FacultyStudentDirectory';
import { FacultyAttendance } from './components/faculty/FacultyAttendance';
import { FacultyAssignments } from './components/faculty/FacultyAssignments';
import { FacultyExamsMarks } from './components/faculty/FacultyExamsMarks';
import { FacultyAnalytics } from './components/faculty/FacultyAnalytics';
import { FacultyAnnouncements } from './components/faculty/FacultyAnnouncements';
import { FacultyTimetable } from './components/faculty/FacultyTimetable';

const MainAppContent = () => {
  const { role, isAuthenticated } = useAuth();

  // Public routing state when unauthenticated: 'landing' | 'auth'
  const [unauthView, setUnauthView] = useState('landing');
  const [authRoleChoice, setAuthRoleChoice] = useState(null);

  // Authenticated state
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAiCoachModalOpen, setIsAiCoachModalOpen] = useState(false);

  // If user is not logged in:
  if (!isAuthenticated) {
    if (unauthView === 'landing') {
      return (
        <LandingPage
          onGoToAuth={(chosenRole) => {
            setAuthRoleChoice(chosenRole || 'select');
            setUnauthView('auth');
          }}
        />
      );
    }
    return (
      <AuthPage
        initialRole={authRoleChoice}
        onBackToLanding={() => setUnauthView('landing')}
      />
    );
  }

  // Render Role-Specific Views
  const renderStudentContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <StudentDashboard
            onNavigateTab={setCurrentTab}
            onOpenCoach={() => setIsAiCoachModalOpen(true)}
          />
        );
      case 'ai-coach':
        return <AISuccessCoach />;
      case 'academics':
      case 'subjects':
        return <StudentAcademics />;
      case 'attendance':
        return <StudentAttendance />;
      case 'exams-assignments':
        return <StudentExamsAssignments />;
      case 'study-hub':
        return <StudentStudyHub />;
      case 'timetable':
        return <StudentTimetable />;
      case 'analytics':
        return <StudentAnalytics />;
      case 'career':
        return <StudentCareerRoadmap />;
      case 'notifications':
        return (
          <StudentDashboard
            onNavigateTab={setCurrentTab}
            onOpenCoach={() => setIsAiCoachModalOpen(true)}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <StudentDashboard
            onNavigateTab={setCurrentTab}
            onOpenCoach={() => setIsAiCoachModalOpen(true)}
          />
        );
    }
  };

  const renderFacultyContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <FacultyDashboard onNavigateTab={setCurrentTab} />;
      case 'my-classes':
      case 'my-subjects':
        return <FacultyMyClasses />;
      case 'student-directory':
        return <FacultyStudentDirectory />;
      case 'attendance-mgmt':
        return <FacultyAttendance />;
      case 'assignments-eval':
        return <FacultyAssignments />;
      case 'exams-marks':
        return <FacultyExamsMarks />;
      case 'academic-analytics':
        return <FacultyAnalytics />;
      case 'announcements':
        return <FacultyAnnouncements />;
      case 'timetable':
        return <FacultyTimetable />;
      case 'notifications':
        return <FacultyDashboard onNavigateTab={setCurrentTab} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <FacultyDashboard onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Role-Aware Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: isSidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          minWidth: 0,
          transition: 'margin-left var(--transition-normal)'
        }}
        className="app-main-layout"
      >
        {/* Topbar */}
        <Topbar
          currentTab={currentTab}
          onOpenMobile={() => setIsMobileSidebarOpen(true)}
          onOpenAiCoach={() => setIsAiCoachModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Route Content */}
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          {role === 'faculty' ? renderFacultyContent() : renderStudentContent()}
        </main>
      </div>

      {/* Floating AI Coach Modal / Quick Assistant */}
      <Modal
        isOpen={isAiCoachModalOpen}
        onClose={() => setIsAiCoachModalOpen(false)}
        title="AI Success Coach (UniSphere Core)"
        subtitle="Intelligent campus academic assistant & exam predictor"
        maxWidth={780}
      >
        <AISuccessCoach isEmbedded={true} />
      </Modal>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
