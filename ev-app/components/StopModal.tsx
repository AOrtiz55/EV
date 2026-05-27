import type { ActiveSession } from '@/lib/data';

interface StopModalProps {
  session: ActiveSession | null;
  onConfirm: () => void;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

export default function StopModal({ session, onConfirm, onClose }: StopModalProps) {
  if (!session) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 500,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal-panel"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 380,
          maxWidth: 'calc(100vw - 32px)',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          padding: '24px',
          zIndex: 510,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p className="col-title" style={{ marginBottom: 4 }}>END SESSION</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Stop charging?
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              flexShrink: 0,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 22 }}>
          This will end your active session on{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{session.spotName}</strong>. The spot
          will become available immediately.
        </p>

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            className="btn btn-outline"
            onClick={onClose}
            style={{ padding: '12px', fontSize: 13 }}
          >
            Keep charging
          </button>
          <button
            className="btn btn-red"
            onClick={onConfirm}
            style={{ padding: '12px', fontSize: 13 }}
          >
            Yes, stop session
          </button>
        </div>
      </div>
    </>
  );
}
