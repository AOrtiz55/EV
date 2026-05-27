'use client';

import { useState } from 'react';

type NavKey = 'home' | 'chat' | 'history' | 'profile';

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M8 1.5L1.5 7v8.5H6V11h4v4.5h4.5V7L8 1.5z" />
  </svg>
);

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M13.5 2h-11a1 1 0 00-1 1v7a1 1 0 001 1h3.5l2 2.5 2-2.5h3.5a1 1 0 001-1V3a1 1 0 00-1-1z" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v3.5l2.5 1.5" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <circle cx="8" cy="5.5" r="2.5" />
    <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 14H2.5V2H6" />
    <path d="M10.5 5.5l3 2.5-3 2.5M6.5 8h7" />
  </svg>
);

export default function Sidebar() {
  const [active, setActive] = useState<NavKey>('home');

  return (
    <aside className="sidebar">
      {/* Profile */}
      <div style={{ padding: '20px 14px 16px', flexShrink: 0 }}>
        <p className="col-title sidebar-section-label" style={{ marginBottom: 12 }}>
          WELCOME BACK
        </p>
        <div className="sidebar-avatar-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#1a1916',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div className="sidebar-profile">
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>Aaron</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>EV Parking Mgmt</p>
          </div>
        </div>
        <div
          className="badge badge-green sidebar-badge"
          style={{ fontSize: 11, gap: 4 }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          Live tracking active
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', margin: '0 14px' }} />

      {/* Main nav */}
      <div style={{ padding: '12px 8px 4px' }}>
        <p className="col-title sidebar-section-label" style={{ padding: '0 6px', marginBottom: 4 }}>MAIN</p>
        <button
          className={`sidebar-nav-item ${active === 'home' ? 'active' : ''}`}
          onClick={() => setActive('home')}
        >
          <HomeIcon />
          <span className="sidebar-text">Home</span>
        </button>
        <button
          className={`sidebar-nav-item ${active === 'chat' ? 'active' : ''}`}
          onClick={() => setActive('chat')}
        >
          <ChatIcon />
          <span className="sidebar-text">Chat</span>
        </button>
      </div>

      {/* Account nav */}
      <div style={{ padding: '8px 8px 4px' }}>
        <p className="col-title sidebar-section-label" style={{ padding: '0 6px', marginBottom: 4 }}>ACCOUNT</p>
        <button
          className={`sidebar-nav-item ${active === 'history' ? 'active' : ''}`}
          onClick={() => setActive('history')}
        >
          <HistoryIcon />
          <span className="sidebar-text">History</span>
        </button>
        <button
          className={`sidebar-nav-item ${active === 'profile' ? 'active' : ''}`}
          onClick={() => setActive('profile')}
        >
          <ProfileIcon />
          <span className="sidebar-text">Profile</span>
        </button>
      </div>

      {/* Logout */}
      <div
        className="sidebar-logout"
        style={{
          marginTop: 'auto',
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.85)',
          fontSize: 12,
          color: 'var(--text-tertiary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--red)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)')}
      >
        <LogoutIcon />
        <span className="sidebar-text">Logout</span>
      </div>
    </aside>
  );
}
