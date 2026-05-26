import type { Spot } from '@/lib/types';
import SpotRow from './SpotRow';
import OvertimeCard from './OvertimeCard';

interface ChargingStationsCardProps {
  spots: Spot[];
  onOpenSheet: () => void;
  onToggleFreePanel: () => void;
  onOccupy: (spotId: number) => void;
  onReserve: () => void;
  // Overtime shared state
  overtimeOverlayOpen: boolean;
  onToggleOvertimeOverlay: () => void;
  overtimeResolved: boolean;
  onOvertimeResolve: () => void;
  nudgeLeft: number;
  onNudgeLeftChange: (n: number) => void;
}

export default function ChargingStationsCard({
  spots,
  onOpenSheet,
  onToggleFreePanel,
  onOccupy,
  onReserve,
  overtimeOverlayOpen,
  onToggleOvertimeOverlay,
  overtimeResolved,
  onOvertimeResolve,
  nudgeLeft,
  onNudgeLeftChange,
}: ChargingStationsCardProps) {
  const available    = spots.filter((s) => s.status === 'available').length;
  const inUse        = spots.filter((s) => s.status === 'in-use').length;
  const overtimeSpot = spots.find((s) => s.status === 'overtime');

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-sm tracking-widest uppercase" style={{ color: '#1A1D23' }}>
          Charging Stations
        </h2>
      </div>

      <div className="flex-1 flex flex-col min-h-0 rounded-2xl overflow-hidden glass">
        {/* View all button */}
        <button
          onClick={onOpenSheet}
          className="w-full flex items-center justify-between px-4 py-3 transition-colors"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center glass-inner">
              <svg className="w-3 h-3" fill="none" stroke="#1A1D23" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xs font-semibold" style={{ color: '#1A1D23' }}>View all spots</span>
          </div>
          <svg className="w-4 h-4" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-2 p-4 pb-3">
          <div
            className="rounded-xl p-2.5 text-center"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.22)' }}
          >
            <p className="font-bold text-lg leading-none" style={{ color: '#16A34A' }}>{available}</p>
            <p className="text-[10px] mt-1 font-medium" style={{ color: 'rgba(22,163,74,0.65)' }}>Available</p>
          </div>
          <div
            className="rounded-xl p-2.5 text-center"
            style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)' }}
          >
            <p className="font-bold text-lg leading-none" style={{ color: '#DC2626' }}>{inUse}</p>
            <p className="text-[10px] mt-1 font-medium" style={{ color: 'rgba(220,38,38,0.55)' }}>In Use</p>
          </div>
          <button
            onClick={onToggleFreePanel}
            className="rounded-xl p-2.5 text-center active:scale-95 transition-all glass-inner"
          >
            <p className="font-bold text-lg leading-none" style={{ color: '#1A1D23' }}>11m</p>
            <p className="text-[10px] mt-1 font-medium" style={{ color: '#9CA3AF' }}>Earliest Free ↑</p>
          </button>
        </div>

        {/* Spot list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5">
          {spots.filter((s) => s.status === 'available').map((spot) => (
            <SpotRow key={spot.id} spot={spot} variant="card" onOccupy={onOccupy} onReserve={onReserve} />
          ))}

          {overtimeSpot && (
            <OvertimeCard
              spot={overtimeSpot}
              ctx="collapsed"
              variant="card"
              onOccupy={onOccupy}
              onReserve={onReserve}
              overlayOpen={overtimeOverlayOpen}
              onToggleOverlay={onToggleOvertimeOverlay}
              resolved={overtimeResolved}
              onResolve={onOvertimeResolve}
              nudgeLeft={nudgeLeft}
              onNudgeLeftChange={onNudgeLeftChange}
            />
          )}

          {spots.filter((s) => s.status === 'in-use').map((spot) => (
            <SpotRow key={spot.id} spot={spot} variant="card" onOccupy={onOccupy} onReserve={onReserve} />
          ))}
        </div>
      </div>
    </div>
  );
}
