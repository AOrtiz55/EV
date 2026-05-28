import type { Spot } from '@/lib/types';

interface OverviewProps {
  spots: Spot[];
}

export default function Overview({ spots }: OverviewProps) {
  const available = spots.filter((s) => s.status === 'available').length;
  const inUse     = spots.filter((s) => s.status === 'in-use' || s.status === 'overtime').length;

  const overtimeSpots = spots.filter((s) => s.status === 'overtime');
  const freeSoonSpots = spots.filter(
    (s) => s.status === 'in-use' && s.timeToFull != null && parseInt(s.timeToFull) <= 15
  );

  return (
    <div className="card">
      {/* Top label */}
      <p className="col-title" style={{ marginBottom: 10 }}>OVERVIEW</p>

      {/* Large number boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(255,255,255,0.75)',
            borderRadius: 10,
            padding: 12,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 600, fontFamily: 'var(--mono)', lineHeight: 1, display: 'block', textAlign: 'center', color: 'var(--green)' }}>
            {available}
          </span>
          <span style={{ fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3, display: 'block', textAlign: 'center' }}>
            Available
          </span>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(255,255,255,0.75)',
            borderRadius: 10,
            padding: 12,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 600, fontFamily: 'var(--mono)', lineHeight: 1, display: 'block', textAlign: 'center', color: 'var(--red)' }}>
            {inUse}
          </span>
          <span style={{ fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3, display: 'block', textAlign: 'center' }}>
            In Use
          </span>
        </div>
      </div>

      {/* Alerts */}
      {(overtimeSpots.length > 0 || freeSoonSpots.length > 0) && (
        <>
          <p className="col-title" style={{ marginBottom: 8 }}>ALERTS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {overtimeSpots.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--amber-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--amber)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 500 }}>
                  {`Spot #${s.id}`} is in overtime · {s.overtimeMinutes} min over
                </span>
              </div>
            ))}
            {freeSoonSpots.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--green-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--green)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: 'var(--green-text)', fontWeight: 500 }}>
                  {`Spot #${s.id}`} frees up in {s.timeToFull}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
