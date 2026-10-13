import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Megaphone, Plus, Pin, Send, Calendar } from 'lucide-react';
import { Modal } from '../common/Modal';

export const FacultyAnnouncements = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [announcements, setAnnouncements] = useState(user?.announcements || []);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [targetClass, setTargetClass] = useState('All Assigned Classes');
  const [content, setContent] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnn = {
      id: `ANN-${Date.now()}`,
      title,
      targetClass,
      date: 'Today',
      views: 0,
      pinned: false,
      content
    };

    setAnnouncements([newAnn, ...announcements]);
    setShowModal(false);
    showToast('Announcement broadcasted to student portal feeds.', 'success');
    setTitle('');
    setContent('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Academic Circulars & Announcements</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Broadcast course updates, exam schedule guidelines, and seminar invitations
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Broadcast New Circular
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="glass-panel"
            style={{
              padding: '22px 26px',
              borderRadius: 'var(--radius-lg)',
              borderLeft: ann.pinned ? '4px solid var(--accent-cyan)' : '4px solid var(--primary)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {ann.pinned && <Pin size={16} color="var(--accent-cyan)" />}
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{ann.title}</h4>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>{ann.date}</span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginBottom: 8 }}>
              Target Audience: {ann.targetClass}
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {ann.content}
            </p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Broadcast Class Announcement"
        subtitle="This notice will appear in the student dashboard of the selected cohort"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label" htmlFor="ann-title">Announcement Title</label>
            <input
              id="ann-title"
              type="text"
              placeholder="e.g. Extra Lab Session for Reinforcement Learning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ann-target">Target Cohort</label>
            <select
              id="ann-target"
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="form-input"
            >
              <option>All Assigned Classes</option>
              <option>B.Tech AI - Sem 6A</option>
              <option>B.Tech CSE - Sem 4B</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ann-content">Notice Content & Instructions</label>
            <textarea
              id="ann-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-input"
              placeholder="Write the full message for students..."
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={15} /> Publish Circular
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
