import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = (msg, dur) => addToast(msg, 'success', dur);
  const error = (msg, dur) => addToast(msg, 'error', dur);
  const info = (msg, dur) => addToast(msg, 'info', dur);
  const warning = (msg, dur) => addToast(msg, 'warning', dur);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast Render Overlay */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((t) => {
          let bg = 'rgba(17, 24, 39, 0.95)';
          let border = 'rgba(255, 255, 255, 0.1)';
          let color = '#fff';
          let icon = '🔔';

          if (t.type === 'success') {
            border = 'rgba(16, 185, 129, 0.5)';
            icon = '✅';
          } else if (t.type === 'error') {
            border = 'rgba(239, 68, 68, 0.5)';
            icon = '❌';
          } else if (t.type === 'warning') {
            border = 'rgba(245, 158, 11, 0.5)';
            icon = '⚠️';
          } else if (t.type === 'info') {
            border = 'rgba(99, 102, 241, 0.5)';
            icon = 'ℹ️';
          }

          return (
            <div
              key={t.id}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                color,
                padding: '12px 18px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                fontSize: '0.875rem',
                backdropFilter: 'blur(10px)',
                animation: 'slideLeft 0.25s ease-out',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{icon}</span>
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
