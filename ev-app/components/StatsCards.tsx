import { EARLIEST_FREE } from '@/lib/data';
import type { Spot } from '@/lib/types';

interface StatsCardsProps {
  spots: Spot[];
}

export default function StatsCards({ spots }: StatsCardsProps) {
  const available = spots.filter((s) => s.status === 'available').length;
  const inUse = spots.filter((s) => s.status === 'in-use' || s.status === 'overtime').length;
  const earliest = EARLIEST_FREE[0];

  return (
    <div className="stats-grid">
      {/* Available */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <p className="col-title" style={{ marginBottom: 6 }}>Available</p>
        <p className="dm-mono" style={{ fontSize: 28, fontWeight: 600, color: 'var(--green)', lineHeight: 1 }}>
          {available}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>spots open now</p>
      </div>

      {/* In Use */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <p className="col-title" style={{ marginBottom: 6 }}>In Use</p>
        <p className="dm-mono" style={{ fontSize: 28, fontWeight: 600, color: 'var(--red)', lineHeight: 1 }}>
          {inUse}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>currently charging</p>
      </div>

      {/* Earliest Free */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <p className="col-title" style={{ marginBottom: 6 }}>Earliest Free</p>
        <p className="dm-mono" style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>
          {earliest ? `${earliest.minutesUntilFree}m` : '—'}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
          {earliest ? `Spot #${earliest.id} at ${earliest.freeAt}` : 'No spots freeing soon'}
        </p>
      </div>
    </div>
  );
}
