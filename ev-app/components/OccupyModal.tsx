'use client';

import { useState } from 'react';

interface OccupyModalProps {
  open: boolean;
  spotId: number | null;
  onClose: () => void;
  onConfirm: (spotId: number, hours: number, minutes: number) => void;
}

const QUICK_TIMES = [
  { label: '30m', h: 0, m: 30 },
  { label: '1 hr', h: 1, m: 0 },
  { label: '2 hr', h: 2, m: 0 },
  { label: '4 hr', h: 4, m: 0 },
];

export default function OccupyModal({ open, spotId, onClose, onConfirm }: OccupyModalProps) {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const setTime = (h: number, m: number) => {
    setHours(h === 0 ? '' : String(h));
    setMinutes(m === 0 ? '00' : String(m));
  };

  const confirm = () => {
    if (!hours && !minutes) {
      alert('Please enter a charge time.');
      return;
    }
    if (spotId !== null) {
      onConfirm(spotId, parseInt(hours) || 0, parseInt(minutes) || 0);
    }
    onClose();
  };

  const handleClose = () => {
    setHours('');
    setMinutes('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-40 transition-opacity duration-200"
        style={{
          background: 'rgba(0,0,0,0.28)',
          backdropFilter: open ? 'blur(6px)' : 'none',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`occupy-modal ${open ? 'occupy-visible' : 'occupy-hidden'} absolute left-4 right-4 z-50 rounded-2xl p-5`}
        style={{
          top: '50%',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base" style={{ color: '#1A1D23' }}>
              Occupy Spot #{spotId}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
              Enter your estimated charge time
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="#6B7280" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Time inputs */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: '#9CA3AF' }}>
              Hours
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={12}
                placeholder="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full outline-none font-bold text-xl text-center py-3 rounded-xl glass-inner appearance-none"
                style={{ color: '#1A1D23' }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#9CA3AF' }}>hr</span>
            </div>
          </div>
          <div className="flex items-end pb-3">
            <span className="font-bold text-xl" style={{ color: '#9CA3AF' }}>:</span>
          </div>
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: '#9CA3AF' }}>
              Minutes
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={59}
                placeholder="00"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full outline-none font-bold text-xl text-center py-3 rounded-xl glass-inner appearance-none"
                style={{ color: '#1A1D23' }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#9CA3AF' }}>min</span>
            </div>
          </div>
        </div>

        {/* Quick select */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#9CA3AF' }}>
            Quick select
          </p>
          <div className="grid grid-cols-4 gap-2">
            {QUICK_TIMES.map((qt) => (
              <button
                key={qt.label}
                onClick={() => setTime(qt.h, qt.m)}
                className="text-xs font-semibold py-2 rounded-xl glass-inner"
                style={{ color: '#6B7280' }}
              >
                {qt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm */}
        <button
          onClick={confirm}
          className="w-full active:scale-95 font-bold py-3.5 rounded-2xl text-sm text-white transition-all"
          style={{ background: '#1A1D23', boxShadow: '0 4px 16px rgba(26,29,35,0.35)' }}
        >
          Confirm Occupy
        </button>
      </div>
    </>
  );
}
