'use client';

import { useState, useEffect } from 'react';
import type { Spot } from '@/lib/types';

interface MyStatsCardProps {
  activeSpot: Spot | null;
  onStop: () => void;
  displayName?: string;
}

export default function MyStatsCard({ activeSpot, onStop, displayName }: MyStatsCardProps) {
  const isActive = activeSpot !== null;
  const [chargePercent, setChargePercent] = useState(0);
  const [remain, setRemain] = useState('--');

  useEffect(() => {
    if (!activeSpot?.stopTimeRaw || !activeSpot?.startTimeRaw) {
      setRemain('--');
      setChargePercent(0);
      return;
    }
    const tick = () => {
      const now = new Date();
      const totalMs = activeSpot.stopTimeRaw!.getTime() - activeSpot.startTimeRaw!.getTime();
      const remainMs = Math.max(0, activeSpot.stopTimeRaw!.getTime() - now.getTime());
      const elapsedMs = totalMs - remainMs;
      const remainHrs = Math.floor(remainMs / 3600000);
      const remainMins = Math.floor((remainMs % 3600000) / 60000);
      const pct = Math.min(100, Math.round((elapsedMs / totalMs) * 100));
      setRemain(remainHrs + 'h ' + String(remainMins).padStart(2, '0') + 'm');
      setChargePercent(pct);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [activeSpot]);

  return (
    <div className="flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-sm tracking-widest uppercase" style={{ color: '#1A1D23' }}>
          My Stats
        </h2>
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full glass-inner"
          style={{ color: isActive ? '#16A34A' : '#9CA3AF' }}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="glass rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center glass-inner">
              <svg className="w-3.5 h-3.5" fill="none" stroke="#1A1D23" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#1A1D23' }}>
                {isActive ? `Spot #${activeSpot.id}` : '—'}
              </p>
              <p className="text-[10px]" style={{ color: '#9CA3AF' }}>
                {isActive ? (displayName ?? 'Your active session') : 'No active session'}
              </p>
            </div>
          </div>
          {isActive && (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors active:scale-95"
              style={{
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.22)',
                color: '#DC2626',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10h6v4H9z" />
              </svg>
              Stop
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          {[
            { label: 'Start',  value: isActive ? activeSpot.startTime  : '--' },
            { label: 'Stop',   value: isActive ? activeSpot.stopTime   : '--' },
            { label: 'Remain', value: remain },
          ].map(({ label, value }) => (
            <div key={label} className="glass-inner rounded-xl p-2 text-center">
              <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#9CA3AF' }}>
                {label}
              </p>
              <p className="font-semibold text-xs" style={{ color: '#1A1D23' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="glass-inner rounded-xl p-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 glass-inner">
              <svg className="w-3 h-3" fill="none" stroke="#1A1D23" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Consumption</p>
              <p className="font-semibold text-xs" style={{ color: '#1A1D23' }}>
                {isActive ? activeSpot.consumption : '--'}
              </p>
            </div>
          </div>
          <div className="glass-inner rounded-xl p-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Charge %</p>
              <span className="font-bold text-xs" style={{ color: '#1A1D23' }}>
                {isActive ? `${chargePercent}%` : '--%'}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
              <div className="charge-bar h-full rounded-full" style={{ width: `${chargePercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
