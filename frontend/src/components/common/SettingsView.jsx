import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Moon, Sun, Save } from 'lucide-react';

export const SettingsView = () => {
  const { user, role } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Preferences updated and synced with cloud account.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>
          {role === 'faculty' ? 'Faculty Profile & Preferences' : 'Student Account & System Preferences'}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>
          Manage your institutional identity, notification frequencies, and interface theme
        </p>

        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <img
              src={user?.avatar}
              alt={user?.name}
              style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '2px solid var(--border-medium)' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.id} • {user?.email}</div>
              <div style={{ marginTop: 6 }}>
                <span className={`badge ${role === 'faculty' ? 'badge-cyan' : 'badge-primary'}`}>
                  {role === 'faculty' ? 'Faculty Staff' : 'Registered Student'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" defaultValue={user?.name} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Institutional Email</label>
              <input type="email" defaultValue={user?.email} className="form-input" disabled />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" defaultValue={user?.department || 'Computer Science & AI'} className="form-input" disabled />
            </div>

            <div className="form-group">
              <label className="form-label">Theme Appearance</label>
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Active: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                {isDark ? <Moon size={16} color="#2563eb" /> : <Sun size={16} color="#fbbf24" />}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={15} /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
