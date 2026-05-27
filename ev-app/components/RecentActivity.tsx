import type { ActivityItem } from '@/lib/data';

interface RecentActivityProps {
  items: ActivityItem[];
}

function dotColor(type: ActivityItem['type']): string {
  switch (type) {
    case 'overtime':     return 'var(--amber)';
    case 'available':
    case 'occupied':     return 'var(--green)';
    case 'session-ended': return 'var(--text-tertiary)';
    default:             return 'var(--text-tertiary)';
  }
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="card">
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <p className="col-title">RECENT ACTIVITY</p>
      </div>

      {/* Rows */}
      <div>
        {items.map((item, idx) => (
          <div key={item.id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 0',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: dotColor(item.type),
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <strong>{item.spotName}</strong>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>{item.description}</span>
                </span>
              </div>
              <span
                className="dm-mono"
                style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}
              >
                {item.time}
              </span>
            </div>
            {idx < items.length - 1 && (
              <div style={{ height: 1, background: 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
