import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const StudentLoginForm = ({ onBackToRoleSelect, onSwitchToFaculty }) => {
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState('test.student@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = 'Student ID or institutional email is required';
    } else if (identifier.includes('@') && !identifier.includes('.')) {
      newErrors.identifier = 'Enter a valid student email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the validation errors in the form.', 'error');
      return;
    }

    try {
      const res = await login('student', identifier, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}! Student workspace active.`, 'success');
      }
    } catch (error) {
      showToast(error.message || 'Authentication failed. Please verify credentials.', 'error');
    }
  };

  const handleFillDemo = () => {
    setIdentifier('test.student@example.com');
    setPassword('');
    setErrors({});
    showToast('Test account email loaded. Enter the password that succeeded in Swagger.', 'info');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your registered student email address.', 'error');
      return;
    }
    setIsSubmittingForgot(true);
    setTimeout(() => {
      setIsSubmittingForgot(false);
      setShowForgotModal(false);
      showToast('Password recovery instructions sent to your institutional inbox.', 'success');
      setForgotEmail('');
    }, 900);
  };

  return (
    <div style={{ width: '100%', maxWidth: 460, margin: '0 auto' }}>
      {/* Back button & Role Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={onBackToRoleSelect}
          className="btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.84rem' }}
        >
          <ArrowLeft size={16} /> Back to Portals
        </button>

        <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <GraduationCap size={14} /> Student Portal Access
        </span>
      </div>

      {/* Main Login Card */}
      <div
        className="glass-panel"
        style={{
          padding: '32px 30px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <GraduationCap size={28} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: 4 }}>
            Student Authentication
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Enter your student ID or institutional email to access your academic dashboard.
          </p>
        </div>

        {/* Demo Quick-Fill Pill */}
        <div
          style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px dashed rgba(99, 102, 241, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem'
          }}
        >
          <div>
            <span style={{ fontWeight: 600, color: '#1d4ed8' }}>Demo Student Account:</span>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Kartikey Patel (6th Sem)</div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Auto-Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Identifier Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="student-id">
              <span>Student ID or Email</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>e.g. STU-2026-8819</span>
            </label>
            <div className="form-input-wrapper">
              <Mail className="form-input-icon" size={17} />
              <input
                id="student-id"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="student.id@unisphere.edu"
                className={`form-input has-icon ${errors.identifier ? 'is-invalid' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.identifier && (
              <div className="form-error-msg" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={13} /> {errors.identifier}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <div className="form-label">
              <label htmlFor="student-password">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 500 }}
              >
                Forgot password?
              </button>
            </div>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={17} />
              <input
                id="student-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className={`form-input has-icon has-action ${errors.password ? 'is-invalid' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  color: 'var(--text-tertiary)',
                  padding: 4,
                  display: 'flex'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <div className="form-error-msg" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={13} /> {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 20px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary)', width: 16, height: 16, borderRadius: 4 }}
              />
              <span>Remember this device</span>
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Encrypted session</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="shimmer-loading" style={{ width: 16, height: 16, borderRadius: '50%' }} />
                Authenticating Student...
              </span>
            ) : (
              <span>Login to Student Portal</span>
            )}
          </button>
        </form>

        {/* Alternate registration link & switch to faculty */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.82rem' }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
            New admitted student?{' '}
            <button
              onClick={() => setShowRegisterModal(true)}
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              Activate Institutional ID
            </button>
          </div>

          <div style={{ color: 'var(--text-tertiary)' }}>
            Are you a faculty or teaching staff?{' '}
            <button
              onClick={onSwitchToFaculty}
              style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}
            >
              Access Faculty Portal â†’
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Student Password"
        subtitle="We will dispatch a secure reset OTP to your university email"
      >
        <form onSubmit={handleForgotSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="forgot-email">Institutional Email</label>
            <div className="form-input-wrapper">
              <Mail className="form-input-icon" size={17} />
              <input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="kartikey.patel@unisphere.edu"
                className="form-input has-icon"
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmittingForgot}
            >
              {isSubmittingForgot ? 'Dispatching...' : 'Send Recovery Link'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Student ID Activation / Registration Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Student Portal Registration"
        subtitle="Activate your UniSphere campus credentials using your enrollment token"
      >
        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <p style={{ marginBottom: 14 }}>
            Student accounts are provisioned automatically by the University Registrar upon semester enrolment.
          </p>
          <div
            style={{
              padding: '14px 16px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              marginBottom: 16
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              Required Details for Activation:
            </div>
            <ul style={{ paddingLeft: 18, fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Enrollment / Admission Application Number</li>
              <li>Registered Parent / Student Mobile for OTP verification</li>
              <li>Department & Degree Program selection</li>
            </ul>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>
            Need help? Contact the Registrar Helpdesk at registrar@unisphere.edu or Block A, Room 102.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setShowRegisterModal(false);
                handleFillDemo();
              }}
              className="btn btn-primary"
            >
              Use Demo Account to Preview
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

