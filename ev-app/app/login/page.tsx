'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    localStorage.setItem('user_name', displayName.trim());
    localStorage.setItem('user_email', email.trim());
    router.push('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(160deg, #E8EAEE 0%, #D8DADF 100%)' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
          style={{ background: '#1A1D23', boxShadow: '0 4px 16px rgba(26,29,35,0.3)' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="font-bold text-lg tracking-wide" style={{ color: '#1A1D23' }}>EV Charge</p>
        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>EV Parking Management</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm p-6"
        style={{
          background: '#ffffff',
          border: '1.5px solid #d1d5db',
          borderRadius: '24px',
          boxShadow: 'none',
        }}
      >
        <h2 className="font-bold text-xl mb-1" style={{ color: '#1A1D23' }}>Sign in</h2>
        <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>Enter your details to continue</p>

        <div className="space-y-3">
          {/* Display Name */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Shown on your spot card"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full pl-9 pr-3 py-3 text-sm outline-none"
              style={{
                background: '#f5f5f7',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '10px',
                color: '#1A1D23',
              }}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-3 text-sm outline-none"
              style={{
                background: '#f5f5f7',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '10px',
                color: '#1A1D23',
              }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-3 text-sm outline-none"
              style={{
                background: '#f5f5f7',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '10px',
                color: '#1A1D23',
              }}
            />
          </div>
        </div>

        {error && (
          <p className="text-xs mt-3" style={{ color: '#DC2626' }}>{error}</p>
        )}

        <button
          onClick={handleSignIn}
          className="w-full mt-5 font-bold py-3.5 rounded-xl text-sm text-white active:scale-95 transition-all"
          style={{ background: '#1A1D23', boxShadow: '0 4px 16px rgba(26,29,35,0.35)' }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
