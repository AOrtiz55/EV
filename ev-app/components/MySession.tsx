'use client';

import { useState, useEffect } from 'react';
import type { Spot } from '@/lib/types';

const StopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <circle cx="8" cy="8" r="6" />
    <path d="M6 6l4 4M10 6l-4 4" />
  </svg>
);

interface MySessionProps {
  activeSpot: Spot | null;
  displayName: string;
  onStop: () => void;
}

export default function MySession({ activeSpot, displayName, onStop }: MySessionProps) {
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

  if (!isActive) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>No active session</p>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
          Occupy a spot to start charging
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p className="col-title">MY STATS</p>
          <span className="badge badge-green">Active</span>
        </div>
        <button className="btn btn-red-outline btn-sm" onClick={onStop} style={{ gap: 5 }}>
          <StopIcon />
          Stop
        </button>
      </div>

      {/* Spot identifier */}
      <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
        Spot #{activeSpot.id}
      </p>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3, marginBottom: 14 }}>
        Your active session · Started {activeSpot.startTime}
      </p>

      {/* Time grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'START',     value: activeSpot.startTime ?? '--' },
          { label: 'STOP',      value: activeSpot.stopTime  ?? '--' },
          { label: 'REMAINING', value: remain },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.75)',
              borderRadius: 8,
              padding: '9px 8px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)', display: 'block' }}>
              {value}
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2, display: 'block' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Consumption + charge % */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.75)', borderRadius: 8, padding: '9px 12px' }}>
          <p style={{ fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>⚡ Consumption</p>
          <p style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--mono)' }}>
            {activeSpot.consumption ?? '--'}
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.75)', borderRadius: 8, padding: '9px 12px' }}>
          <p style={{ fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Charge %</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 99 }}>
              <div className="charge-bar" style={{ width: `${chargePercent}%`, height: '100%', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)', flexShrink: 0 }}>
              {chargePercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
