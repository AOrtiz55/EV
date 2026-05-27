import type { Spot } from '@/lib/types';

interface SpotRowProps {
  spot: Spot;
  variant: 'card' | 'sheet';
  onOccupy: (spotId: number) => void;
  onReserve: () => void;
  disabled?: boolean;
  isOwned?: boolean;
}

export default function SpotRow({ spot, variant, onOccupy, onReserve, disabled = false, isOwned = false }: SpotRowProps) {
  const isAvailable = spot.status === 'available';
  const isInUse = spot.status === 'in-use';

  const rowBg = isOwned
    ? { background: '#EBF5FF', border: '1.5px solid #85B7EB' }
    : variant === 'sheet'
    ? undefined
    : isAvailable
    ? { background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.7)' }
    : { background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.6)' };

  const rowClass =
    variant === 'sheet'
      ? 'spot-row glass rounded-xl p-3'
      : 'spot-row rounded-xl p-3';

  return (
    <div className={rowClass} style={rowBg}>
      <div className="flex items-start justify-between">
        {/* Left info */}
        <div className="space-y-1 flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{ color: isOwned ? '#0C447C' : '#1A1D23' }}>
              Spot #{spot.id}
            </span>
            {isAvailable && (
              <>
                <span className="w-2 h-2 rounded-full flex-shrink-0 pulse" style={{ background: '#22C55E' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#16A34A' }}>Available</span>
              </>
            )}
            {isInUse && (
              <>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#DC2626' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#DC2626' }}>In Use</span>
              </>
            )}
          </div>

          {isAvailable && (
            <p className="text-xs" style={{ color: '#9CA3AF' }}>— unoccupied —</p>
          )}

          {isInUse && (
            <>
              <p className="text-xs font-medium" style={{ color: isOwned ? '#378ADD' : '#374151' }}>{spot.occupant}</p>
              {variant === 'sheet' ? (
                <div className="flex gap-3">
                  <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
                    To 100%:{' '}
                    <span className="font-medium" style={{ color: '#1A1D23' }}>{spot.timeToFull}</span>
                  </span>
                  <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
                    Started:{' '}
                    <span className="font-medium" style={{ color: '#1A1D23' }}>{spot.startTime}</span>
                  </span>
                </div>
              ) : (
                <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
                  To 100%:{' '}
                  <span className="font-medium" style={{ color: '#1A1D23' }}>{spot.timeToFull}</span>
                  {' · '}Started:{' '}
                  <span className="font-medium" style={{ color: '#1A1D23' }}>{spot.startTime}</span>
                </p>
              )}
            </>
          )}

          {isAvailable && variant === 'sheet' && (
            <div className="flex gap-3">
              <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
                To 100%: <span className="font-medium" style={{ color: '#1A1D23' }}>—</span>
              </span>
              <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
                Started: <span className="font-medium" style={{ color: '#1A1D23' }}>—</span>
              </span>
            </div>
          )}
        </div>

        {/* Right buttons */}
        <div className="flex flex-col gap-1.5 flex-shrink-0" style={isInUse ? { opacity: 1 } : undefined}>
          {isAvailable ? (
            <>
              <button
                onClick={onReserve}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg glass-inner"
                style={{ color: '#374151' }}
              >
                Reserve
              </button>
              <button
                onClick={() => onOccupy(spot.id)}
                disabled={disabled}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg${disabled ? ' opacity-40' : ''}`}
                style={{ background: '#1A1D23', color: '#fff' }}
              >
                Occupy
              </button>
            </>
          ) : (
            <>
              <button
                disabled
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-not-allowed"
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  color: '#C4C4C4',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                Reserve
              </button>
              <button
                disabled
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-not-allowed"
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  color: '#C4C4C4',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                Occupy
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
