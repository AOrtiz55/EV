import type { ActiveSession } from '@/lib/data';

const StopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <circle cx="8" cy="8" r="6" />
    <path d="M6 6l4 4M10 6l-4 4" />
  </svg>
);

interface MySessionProps {
  session: ActiveSession | null;
  onStop: () => void;
}

export default function MySession({ session, onStop }: MySessionProps) {
  if (!session) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>No active session</p>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
          Occupy a spot to start charging
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header row: MY STATS + Active badge left, Stop button right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p className="col-title">MY STATS</p>
          <span className="badge badge-green">Active</span>
        </div>
        <button className="btn btn-red-outline btn-sm" onClick={onStop} style={{ gap: 5 }}>
          <StopIcon />
          Stop
        </button>
      </div>

      {/* Spot name — includes station and level */}
      <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
        {session.spotName} — {session.station}, {session.level}
      </p>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3, marginBottom: 14 }}>
        Your active session · Started {session.startTime}
      </p>

      {/* Time grid — value above, label below */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'START', value: session.startTime },
          { label: 'STOP', value: session.stopTime },
          { label: 'REMAINING', value: `${session.remainingHours} hr` },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.75)',
              borderRadius: 8,
              padding: '9px 8px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)', display: 'block' }}>
              {value}
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2, display: 'block' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Consumption row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.75)', borderRadius: 8, padding: '9px 12px' }}>
          <p style={{ fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>⚡ Consumption</p>
          <p style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--mono)' }}>
            {session.consumptionKwh} kWh
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.75)', borderRadius: 8, padding: '9px 12px' }}>
          <p style={{ fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Charge %</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 99 }}>
              <div
                style={{
                  width: `${session.chargePercent}%`,
                  height: '100%',
                  background: '#1A1D23',
                  borderRadius: 99,
                }}
              />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)', flexShrink: 0 }}>
              {session.chargePercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
