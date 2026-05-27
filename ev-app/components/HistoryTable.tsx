type HistoryType = 'overtime' | 'session-ended' | 'available' | 'occupied';

interface HistoryRow {
  id: number;
  type: HistoryType;
  event: string;
  spot: string;
  station: string;
  time: string;
  duration: string;
}

const historyRows: HistoryRow[] = [
  { id: 1, type: 'overtime',      event: 'Overtime alert',  spot: 'Spot #4', station: 'Station A', time: '11:44 AM', duration: '14m over' },
  { id: 2, type: 'session-ended', event: 'Session ended',   spot: 'Spot #7', station: 'Station B', time: '10:30 AM', duration: '2h 15m' },
  { id: 3, type: 'available',     event: 'Now available',   spot: 'Spot #9', station: 'Station B', time: '10:30 AM', duration: '—' },
  { id: 4, type: 'occupied',      event: 'Occupied',        spot: 'Spot #1', station: 'Station A', time: '8:00 AM',  duration: 'Ongoing' },
  { id: 5, type: 'occupied',      event: 'Now in use',      spot: 'Spot #2', station: 'Station A', time: '7:55 AM',  duration: 'Ongoing' },
  { id: 6, type: 'session-ended', event: 'Session ended',   spot: 'Spot #3', station: 'Station A', time: '6:30 AM',  duration: '1h 45m' },
  { id: 7, type: 'available',     event: 'Now available',   spot: 'Spot #5', station: 'Station B', time: '5:45 AM',  duration: '—' },
  { id: 8, type: 'occupied',      event: 'Occupied',        spot: 'Spot #8', station: 'Station B', time: '6:00 AM',  duration: 'Ongoing' },
];

function dotColor(type: HistoryType): string {
  switch (type) {
    case 'overtime':      return 'var(--amber)';
    case 'session-ended': return 'var(--text-tertiary)';
    case 'available':
    case 'occupied':      return 'var(--green)';
  }
}

export default function HistoryTable() {
  return (
    <section className="history-section" id="history">
      <div style={{ padding: '28px 24px' }}>
        <div style={{ marginBottom: 16 }}>
          <p className="col-title" style={{ marginBottom: 4 }}>HISTORY</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Full Activity Log</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                {['Event', 'Spot', 'Station', 'Time', 'Duration'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '8px 14px',
                      textAlign: 'left',
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--surface-2)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: dotColor(row.type),
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                        {row.event}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>
                    {row.spot}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>
                    {row.station}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span className="dm-mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {row.time}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span className="dm-mono" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {row.duration}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
