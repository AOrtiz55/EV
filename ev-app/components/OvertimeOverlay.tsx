import type { Spot } from '@/lib/data';

interface OvertimeOverlayProps {
  spot: Spot;
  onNudge: (spotId: number) => void;
  onDismiss: (spotId: number) => void;
}

export default function OvertimeOverlay({ spot, onNudge, onDismiss }: OvertimeOverlayProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--amber-bg)',
        border: '1px solid var(--amber)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        zIndex: 10,
        gap: 10,
      }}
    >
      {/* Left text */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)', lineHeight: 1.3 }}>
          Still there?
        </p>
        <p style={{ fontSize: 10, color: 'var(--amber)', marginTop: 2, opacity: 0.85 }}>
          {spot.overtimeMinutes} min over your limit
        </p>
      </div>

      {/* Right buttons */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => onNudge(spot.id)}
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--amber)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Send nudge
        </button>
        <button
          onClick={() => onDismiss(spot.id)}
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            color: 'var(--amber)',
            border: '1px solid var(--amber)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
