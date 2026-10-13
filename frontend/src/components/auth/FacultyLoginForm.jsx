import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const FacultyLoginForm = ({ onBackToRoleSelect, onSwitchToStudent }) => {
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState('arvind.sharma@unisphere.edu');
  const [password, setPassword] = useState('demo-faculty-pass456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = 'Faculty ID or institutional email is required';
    } else if (identifier.includes('@') && !identifier.includes('.')) {
      newErrors.identifier = 'Enter a valid institutional email';
    }

    if (!password) {
      newErrors.password = 'Faculty password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please verify your faculty credentials.', 'error');
      return;
    }

    try {
      const res = await login('faculty', identifier, password);
      if (res.success) {
        showToast(`Welcome Professor ${res.user.name}! Faculty portal initialized.`, 'success');
      }
    } catch (error) {
      showToast(error.message || 'Faculty authentication error. Please verify departmental access.', 'error');
    }
  };

  const handleFillDemo = () => {
    setIdentifier('FAC-ENG-402');
    setPassword('faculty@unisphere2026');
    setErrors({});
    showToast('Loaded Dr. Arvind Sharma demo credentials.', 'info');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your institutional email.', 'error');
      return;
    }
    setIsSubmittingForgot(true);
    setTimeout(() => {
      setIsSubmittingForgot(false);
      setShowForgotModal(false);
      showToast('Faculty verification PIN dispatched to IT registrar inbox.', 'success');
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

        <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Users size={14} /> Faculty Portal Access
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
              background: 'linear-gradient(135deg, #0d9488 0%, #075985 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              boxShadow: 'var(--shadow-cyan-glow)'
            }}
          >
            <Users size={28} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: 4 }}>
            Faculty & Educator Login
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Enter your Faculty Employee ID or institutional email to access class registers and evaluations.
          </p>
        </div>

        {/* Demo Quick-Fill Pill */}
        <div
          style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px dashed rgba(6, 182, 212, 0.35)',
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
            <span style={{ fontWeight: 600, color: '#22d3ee' }}>Demo Faculty Account:</span>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Dr. Arvind Sharma (AI Dept)</div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-cyan btn-sm"
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Auto-Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Faculty Identifier Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="faculty-id">
              <span>Faculty ID or Institutional Email</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>e.g. FAC-ENG-402</span>
            </label>
            <div className="form-input-wrapper">
              <Briefcase className="form-input-icon" size={17} />
              <input
                id="faculty-id"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="faculty.id@unisphere.edu"
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
              <label htmlFor="faculty-password">Institutional Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', fontWeight: 500 }}
              >
                Forgot password?
              </button>
            </div>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={17} />
              <input
                id="faculty-password"
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
                style={{ accentColor: 'var(--accent-cyan)', width: 16, height: 16, borderRadius: 4 }}
              />
              <span>Remember Faculty Session</span>
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>University 2FA ready</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-cyan btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="shimmer-loading" style={{ width: 16, height: 16, borderRadius: '50%' }} />
                Verifying Faculty Credentials...
              </span>
            ) : (
              <span>Login to Faculty Portal</span>
            )}
          </button>
        </form>

        {/* Switch to Student Portal */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.82rem' }}>
          <div style={{ color: 'var(--text-tertiary)' }}>
            Are you an enrolled student?{' '}
            <button
              onClick={onSwitchToStudent}
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              Access Student Portal â†’
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Faculty Password Assistance"
        subtitle="Verification link will be dispatched via Institutional Active Directory"
      >
        <form onSubmit={handleForgotSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="faculty-forgot-email">Institutional Email</label>
            <div className="form-input-wrapper">
              <Briefcase className="form-input-icon" size={17} />
              <input
                id="faculty-forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="arvind.sharma@unisphere.edu"
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
              className="btn btn-cyan"
              disabled={isSubmittingForgot}
            >
              {isSubmittingForgot ? 'Processing...' : 'Send Faculty Reset Link'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

