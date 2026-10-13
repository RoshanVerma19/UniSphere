import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiCoachSuggestions } from '../../data/mockData';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  RefreshCw
} from 'lucide-react';

export const AISuccessCoach = ({ isEmbedded = false }) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'coach',
      text: `Hello ${user?.name?.split(' ')[0] || 'Kartikey'}! I'm your UniSphere AI Success Coach powered by the UniSphere neural intelligence engine.\n\nI have analyzed your Semester 6 metrics:\n• **Current CGPA:** ${user?.cgpa || '8.94'} (Target: ${user?.targetCgpa || '9.20'})\n• **Attendance:** ${user?.attendanceOverall || '89.4'}% (Safe Zone across all subjects)\n• **Upcoming Deadline:** Vision Transformer fine-tuning submission due tomorrow!\n\nHow can I help you excel today? You can choose one of the smart prompts below or ask me anything regarding your syllabus, revision, or career strategy.`,
      timestamp: 'Just now'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const [conversationId, setConversationId] = useState(null);

  const handleSend = async (textToSend) => {
    const query = (textToSend ?? inputVal).trim();
    if (!query || isTyping) return;

    const timestamp = () =>
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-user`,
        sender: 'user',
        text: query,
        timestamp: timestamp()
      }
    ]);
    setInputVal('');
    setIsTyping(true);

    try {
      const token =
        user?.token || localStorage.getItem('unisphere_access_token');

      if (!token) {
        throw new Error('Session expired. Please log in again.');
      }

      const apiBase = (
        import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080'
      ).replace(/\/+$/, '');

      const response = await fetch(
        `${apiBase}/api/v1/student/coach/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: query,
            ...(conversationId !== null
              ? { conversation_id: conversationId }
              : {})
          })
        }
      );

      const payload = await response.json().catch(() => ({}));
      const data = payload.data ?? payload;

      if (!response.ok || payload.success === false) {
        const detail =
          data.detail ||
          payload.detail ||
          payload.error?.message ||
          'AI Coach request failed.';
        throw new Error(
          typeof detail === 'string' ? detail : 'Request failed.'
        );
      }

      if (data.conversation_id != null) {
        setConversationId(data.conversation_id);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-coach`,
          sender: 'coach',
          text: data.reply || 'The AI returned an empty response.',
          timestamp: timestamp()
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          sender: 'coach',
          text: `Unable to get an AI response: ${error.message}`,
          timestamp: timestamp()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isEmbedded ? '560px' : 'calc(100vh - 120px)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden'
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          padding: '16px 22px',
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                AI Success Coach
              </h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                UniSphere NEURAL ENGINE
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', margin: 0 }}>
              Personalized syllabus advisor, exam predictor & career accelerator
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'm-reset',
                sender: 'coach',
                text: `Session refreshed. How can I assist your academic progress today, ${user?.name?.split(' ')[0]}?`,
                timestamp: 'Just now'
              }
            ])
          }
          className="btn-ghost"
          style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}
          title="Reset conversation"
        >
          <RefreshCw size={14} /> Clear
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div
        style={{
          padding: '10px 18px',
          background: 'var(--bg-glass)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        {aiCoachSuggestions.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSend(item.prompt)}
            className="btn btn-secondary btn-sm"
            style={{
              fontSize: '0.76rem',
              padding: '5px 11px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Zap size={12} color="#0d9488" />
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: 12,
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '80%' : '88%'
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <Bot size={18} />
                </div>
              )}

              <div
                style={{
                  background: isUser ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'var(--bg-tertiary)',
                  color: isUser ? '#ffffff' : 'var(--text-primary)',
                  padding: '14px 18px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: isUser ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: isUser ? '0 4px 14px rgba(99, 102, 241, 0.35)' : 'var(--shadow-sm)',
                  fontSize: '0.88rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: isUser ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-tertiary)',
                    marginTop: 6,
                    textAlign: isUser ? 'right' : 'left'
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <User size={18} color="var(--primary)" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={18} />
            </div>
            <div
              style={{
                background: 'var(--bg-tertiary)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                gap: 5,
                alignItems: 'center'
              }}
            >
              <span className="shimmer-loading" style={{ width: 8, height: 8, borderRadius: '50%' }} />
              <span className="shimmer-loading" style={{ width: 8, height: 8, borderRadius: '50%' }} />
              <span className="shimmer-loading" style={{ width: 8, height: 8, borderRadius: '50%' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginLeft: 6 }}>
                AI Success Coach analyzing semester knowledge graph...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div
        style={{
          padding: '14px 20px',
          background: 'var(--bg-glass-strong)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: 10,
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask AI Coach: 'Help me debug my ViT assignment' or 'Prepare me for mid-term'..."
          className="form-input"
          style={{ flex: 1, height: 44, borderRadius: 'var(--radius-lg)' }}
          disabled={isTyping}
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputVal.trim() || isTyping}
          className="btn btn-primary"
          style={{
            height: 44,
            padding: '0 20px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Send size={16} />
          <span className="hide-on-mobile">Ask Coach</span>
        </button>
      </div>
    </div>
  );
};
