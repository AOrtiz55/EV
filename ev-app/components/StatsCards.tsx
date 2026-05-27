import type { Spot } from '@/lib/data';

interface StatsCardsProps {
  available: number;
  inUse: number;
  earliestFree: Spot | undefined;
}

export default function StatsCards({ available, inUse, earliestFree }: StatsCardsProps) {
  return (
    <div className="stats-grid">
      {/* Available */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <p className="col-title" style={{ marginBottom: 6 }}>Available</p>
        <p
          className="dm-mono"
          style={{ fontSize: 28, fontWeight: 600, color: 'var(--green)', lineHeight: 1 }}
        >
          {available}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>spots open now</p>
      </div>

      {/* In Use */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <p className="col-title" style={{ marginBottom: 6 }}>In Use</p>
        <p
          className="dm-mono"
          style={{ fontSize: 28, fontWeight: 600, color: 'var(--red)', lineHeight: 1 }}
        >
          {inUse}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>currently charging</p>
      </div>

      {/* Earliest Free */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <p className="col-title" style={{ marginBottom: 6 }}>Earliest Free</p>
        <p
          className="dm-mono"
          style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}
        >
          {earliestFree ? `${earliestFree.minutesRemaining}m` : '—'}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
          {earliestFree
            ? `${earliestFree.name} at ${earliestFree.occupiedUntil}`
            : 'No spots freeing soon'}
        </p>
      </div>
    </div>
  );
}
