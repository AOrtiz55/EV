import type { Spot } from '@/lib/types';
import SpotRow from './SpotRow';
import OvertimeCard from './OvertimeCard';

interface StationSheetProps {
  spots: Spot[];
  open: boolean;
  onClose: () => void;
  onToggleFreePanel: () => void;
  onOccupy: (spotId: number) => void;
  // Overtime shared state
  overtimeOverlayOpen: boolean;
  onToggleOvertimeOverlay: () => void;
  overtimeResolved: boolean;
  onOvertimeResolve: () => void;
  nudgeLeft: number;
  onNudgeLeftChange: (n: number) => void;
}

export default function StationSheet({
  spots,
  open,
  onClose,
  onToggleFreePanel,
  onOccupy,
  overtimeOverlayOpen,
  onToggleOvertimeOverlay,
  overtimeResolved,
  onOvertimeResolve,
  nudgeLeft,
  onNudgeLeftChange,
}: StationSheetProps) {
  const available    = spots.filter((s) => s.status === 'available').length;
  const inUse        = spots.filter((s) => s.status === 'in-use').length;
  const overtimeSpot = spots.find((s) => s.status === 'overtime');

  return (
    <div
      className={`sheet-transition ${open ? 'sheet-expanded' : 'sheet-collapsed'} absolute inset-x-0 top-0 bottom-0 z-20 flex flex-col`}
      style={{ background: 'linear-gradient(160deg,#E8EAEE 0%,#D8DADF 100%)' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 glass" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }} />
        </div>

        {/* Title + Collapse */}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h3 className="font-bold text-base" style={{ color: '#1A1D23' }}>Charging Stations</h3>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>All 10 spots</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl glass-inner"
            style={{ color: '#374151' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            Collapse
          </button>
        </div>

        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          <div
            className="rounded-xl p-2 text-center"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.22)' }}
          >
            <p className="font-bold text-base leading-none" style={{ color: '#16A34A' }}>{available}</p>
            <p className="text-[10px] mt-1 font-medium" style={{ color: 'rgba(22,163,74,0.65)' }}>Available</p>
          </div>
          <div
            className="rounded-xl p-2 text-center"
            style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)' }}
          >
            <p className="font-bold text-base leading-none" style={{ color: '#DC2626' }}>{inUse}</p>
            <p className="text-[10px] mt-1 font-medium" style={{ color: 'rgba(220,38,38,0.55)' }}>In Use</p>
          </div>
          <button
            onClick={onToggleFreePanel}
            className="rounded-xl p-2 text-center active:scale-95 glass-inner"
          >
            <p className="font-bold text-base leading-none" style={{ color: '#1A1D23' }}>11m</p>
            <p className="text-[10px] mt-1 font-medium" style={{ color: '#9CA3AF' }}>Earliest Free ↑</p>
          </button>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 pb-24">
        {spots.filter((s) => s.status === 'available').map((spot) => (
          <SpotRow key={spot.id} spot={spot} variant="sheet" onOccupy={onOccupy} />
        ))}

        {overtimeSpot && (
          <OvertimeCard
            spot={overtimeSpot}
            ctx="sheet"
            variant="sheet"
            onOccupy={onOccupy}
            overlayOpen={overtimeOverlayOpen}
            onToggleOverlay={onToggleOvertimeOverlay}
            resolved={overtimeResolved}
            onResolve={onOvertimeResolve}
            nudgeLeft={nudgeLeft}
            onNudgeLeftChange={onNudgeLeftChange}
          />
        )}

        {spots.filter((s) => s.status === 'in-use').map((spot) => (
          <SpotRow key={spot.id} spot={spot} variant="sheet" onOccupy={onOccupy} />
        ))}
      </div>
    </div>
  );
}
