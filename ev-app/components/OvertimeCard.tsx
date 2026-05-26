'use client';

import { useRef, useState, useCallback } from 'react';
import type { Spot } from '@/lib/types';

interface OvertimeCardProps {
  spot: Spot;
  ctx: string;
  variant: 'card' | 'sheet';
  onOccupy: (spotId: number) => void;
  onReserve: () => void;
  // Shared state lifted up
  overlayOpen: boolean;
  onToggleOverlay: () => void;
  resolved: boolean;
  onResolve: () => void;
  nudgeLeft: number;
  onNudgeLeftChange: (n: number) => void;
}

const COOLDOWN_SECS = 20 * 60;

export default function OvertimeCard({
  spot,
  ctx,
  variant,
  onOccupy,
  onReserve,
  overlayOpen,
  onToggleOverlay,
  resolved,
  onResolve,
  nudgeLeft,
  onNudgeLeftChange,
}: OvertimeCardProps) {
  const [cooldownActive, setCooldownActive] = useState(false);
  const [remainingSecs, setRemainingSecs] = useState(COOLDOWN_SECS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleNudge = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (nudgeLeft <= 0 || cooldownActive) return;
      const newLeft = nudgeLeft - 1;
      onNudgeLeftChange(newLeft);
      setCooldownActive(true);
      setRemainingSecs(COOLDOWN_SECS);

      if (intervalRef.current) clearInterval(intervalRef.current);
      let secs = COOLDOWN_SECS;
      intervalRef.current = setInterval(() => {
        secs--;
        setRemainingSecs(secs);
        if (secs <= 0) {
          clearInterval(intervalRef.current!);
          if (newLeft > 0) setCooldownActive(false);
        }
      }, 1000);
    },
    [nudgeLeft, cooldownActive, onNudgeLeftChange]
  );

  const handleResolve = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (intervalRef.current) clearInterval(intervalRef.current);
      onResolve();
    },
    [onResolve]
  );

  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const rowBg =
    variant === 'card'
      ? { border: resolved ? '1px solid rgba(255,255,255,0.85)' : '1px solid rgba(234,88,12,0.35)' }
      : { border: resolved ? '1px solid rgba(255,255,255,0.85)' : '1px solid rgba(234,88,12,0.35)' };

  return (
    <div
      className={`relative rounded-xl transition-all duration-300 glass ${
        !resolved ? 'overtime-card' : ''
      }`}
      style={rowBg}
    >
      {/* Badge */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-200"
        style={{ opacity: overlayOpen ? 0 : 1, pointerEvents: overlayOpen ? 'none' : 'auto' }}
      >
        {resolved ? (
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              color: '#16A34A',
            }}
          >
            ✓ Resolved
          </span>
        ) : (
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{
              background: 'rgba(234,88,12,0.1)',
              border: '1px solid rgba(234,88,12,0.3)',
              color: '#EA580C',
            }}
          >
            ⏱ OVERTIME · {spot.overtimeMinutes} min past
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-3 pt-8">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: '#1A1D23' }}>Spot #{spot.id}</span>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: resolved ? '#22C55E' : '#EA580C' }} />
              <span className="text-[10px] font-semibold" style={{ color: resolved ? '#16A34A' : '#EA580C' }}>
                {resolved ? 'Available' : 'Unconfirmed'}
              </span>
            </div>
            <p className="text-xs font-medium" style={{ color: '#374151' }}>{spot.occupant}</p>
            <div className="flex gap-3">
              {!resolved && (
                <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
                  Finished:{' '}
                  <span className="font-medium" style={{ color: '#EA580C' }}>
                    {spot.overtimeMinutes} min ago
                  </span>
                </span>
              )}
              <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
                Started:{' '}
                <span className="font-medium" style={{ color: '#1A1D23' }}>{spot.startTime}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <div className="text-[10px] font-bold px-2.5 py-1 rounded-lg glass-inner opacity-25" style={{ color: '#374151' }}>
              Reserve
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleOverlay(); }}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
              style={{ background: '#1A1D23', color: '#fff' }}
            >
              Occupy
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {!resolved && (
        <div
          className={`ot-overlay ${overlayOpen ? 'ot-visible' : 'ot-hidden'} absolute top-0 left-0 right-0 rounded-xl`}
          style={{
            background: 'rgba(255,252,250,0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(234,88,12,0.2)',
          }}
        >
          {/* Overlay header */}
          <div
            className="flex items-start justify-between px-4 pt-4 pb-3"
            style={{ borderBottom: '1px solid rgba(234,88,12,0.12)' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">⏱</span>
                <p className="font-bold text-base" style={{ color: '#1A1D23' }}>Still there?</p>
              </div>
              <p className="text-xs" style={{ color: '#6B7280' }}>{spot.occupant} hasn&apos;t confirmed</p>
            </div>
            <button
              onClick={handleResolve}
              className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1.5 rounded-lg ml-2"
              style={{
                background: 'rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.1)',
                color: '#9CA3AF',
              }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              They left
            </button>
          </div>

          {/* Overlay body */}
          <div className="px-4 py-3 space-y-2.5">
            {/* Nudge button */}
            <button
              onClick={handleNudge}
              disabled={cooldownActive || nudgeLeft <= 0}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
              style={{
                background: cooldownActive ? 'rgba(0,0,0,0.04)' : 'rgba(234,88,12,0.07)',
                border: cooldownActive ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(234,88,12,0.28)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">👋</span>
                <div className="text-left">
                  <p className="text-sm font-bold" style={{ color: cooldownActive ? '#D1D5DB' : '#EA580C' }}>
                    Nudge
                  </p>
                  <p className="text-[10px]" style={{ color: cooldownActive ? '#E5E7EB' : 'rgba(234,88,12,0.6)' }}>
                    Send a notification
                  </p>
                </div>
              </div>
              {/* Pips */}
              <div className="flex items-center gap-1.5">
                {[3, 2, 1].map((pip) => (
                  <span
                    key={pip}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: nudgeLeft >= pip ? '#EA580C' : 'rgba(0,0,0,0.1)',
                      boxShadow: nudgeLeft >= pip ? '0 0 6px rgba(234,88,12,0.55)' : 'none',
                    }}
                  />
                ))}
              </div>
            </button>

            {/* Cooldown bar */}
            {cooldownActive && (
              <div className="px-1">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Resets in</span>
                  <span className="text-xs font-bold" style={{ color: '#EA580C' }}>
                    {formatTime(remainingSecs)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg,#1A1D23,#EA580C)',
                      width: `${(remainingSecs / COOLDOWN_SECS) * 100}%`,
                      transition: 'width 1s linear',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Reserve / Occupy */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onReserve(); }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm glass-inner"
                style={{ color: '#374151' }}
              >
                🔒 Reserve
              </button>
              <button
                onClick={() => onOccupy(spot.id)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#1A1D23', color: '#fff' }}
              >
                ⚡ Occupy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invisible tap target to toggle overlay */}
      {!resolved && (
        <button
          onClick={onToggleOverlay}
          className="absolute inset-0 w-full h-full opacity-0"
          style={{ zIndex: overlayOpen ? -1 : 0 }}
          aria-label="Toggle overtime overlay"
        />
      )}
    </div>
  );
}
