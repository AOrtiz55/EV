import { EARLIEST_FREE } from '@/lib/data';

interface EarliestFreePanelProps {
  open: boolean;
  sheetOpen: boolean;
  onClose: () => void;
}

export default function EarliestFreePanel({ open, sheetOpen, onClose }: EarliestFreePanelProps) {
  const panelPosition = sheetOpen
    ? { top: '50%', transform: 'translateY(-50%)', bottom: 'auto' }
    : { bottom: '90px', top: 'auto', transform: 'none' };

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-30 transition-opacity duration-200"
        style={{
          background: 'rgba(0,0,0,0.18)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`free-panel ${open ? 'fp-visible' : 'fp-hidden'} absolute left-4 right-4 z-40 rounded-2xl overflow-hidden`}
        style={{
          ...panelPosition,
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
        >
          <div>
            <p className="font-bold text-sm" style={{ color: '#1A1D23' }}>Soonest Available</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>Sorted by earliest free time</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center glass-inner"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Spot list */}
        <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
          {EARLIEST_FREE.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 glass-inner">
                  <span className="text-xs font-bold" style={{ color: '#1A1D23' }}>#{item.id}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1A1D23' }}>Spot #{item.id}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-bold" style={{ color: '#1A1D23' }}>
                      {item.minutesUntilFree} min
                    </span>
                    <span className="text-[10px]" style={{ color: '#D1D5DB' }}>·</span>
                    <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
                      Free at{' '}
                      <span className="font-medium" style={{ color: '#1A1D23' }}>{item.freeAt}</span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg glass-inner"
                style={{ color: '#374151' }}
              >
                Reserve
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
