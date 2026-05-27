'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    setDisplayName(localStorage.getItem('user_name') ?? '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    router.push('/login');
  };

  return (
    <div className="relative h-44 flex-shrink-0 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #EAECF0 0%, #DDE0E6 100%)' }}
      />
      {/* Light bloom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(255,255,255,0.6) 0%, transparent 70%)',
        }}
      />

      {/* Top row */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-5">
        {/* Logo */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: '#1A1D23',
            boxShadow: '0 2px 12px rgba(26,29,35,0.25)',
            padding: '2px',
          }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{ background: '#2D3139' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Name */}
        <div className="text-center">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#9098A8' }}>
            Welcome back
          </p>
          <p className="font-bold text-base tracking-wide" style={{ color: '#1A1D23' }}>
            {displayName}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full glass-inner transition-colors"
          style={{ color: '#6B7280' }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#DC2626')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#6B7280')}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          Logout
        </button>
      </div>

      {/* Subtitle row */}
      <div className="relative z-10 px-4 mt-4">
        <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#9CA3AF' }}>
          EV Parking Management
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="w-2 h-2 rounded-full pulse"
            style={{ background: '#22C55E' }}
          />
          <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>
            Live tracking active
          </span>
        </div>
      </div>
    </div>
  );
}
