'use client';

import { useState } from 'react';

type NavKey = 'home' | 'chat' | 'history' | 'profile';

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill={active ? '#fff' : 'none'} stroke={active ? '#fff' : '#9e9b94'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {active
      ? <path d="M8 1.5L1.5 7v8.5H6V11h4v4.5h4.5V7L8 1.5z" fill="#fff" stroke="none" />
      : <path d="M8 1.5L1.5 7v8.5H6V11h4v4.5h4.5V7L8 1.5z" />}
  </svg>
);

const ChatIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke={active ? '#fff' : '#9e9b94'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M13.5 2h-11a1 1 0 00-1 1v7a1 1 0 001 1h3.5l2 2.5 2-2.5h3.5a1 1 0 001-1V3a1 1 0 00-1-1z" />
  </svg>
);

const HistoryIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke={active ? '#fff' : '#9e9b94'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v3.5l2.5 1.5" />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke={active ? '#fff' : '#9e9b94'} strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <circle cx="8" cy="5.5" r="2.5" />
    <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
  </svg>
);

const tabs: { key: NavKey; label: string; Icon: React.ComponentType<{ active: boolean }> }[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'chat', label: 'Chat', Icon: ChatIcon },
  { key: 'history', label: 'History', Icon: HistoryIcon },
  { key: 'profile', label: 'Profile', Icon: ProfileIcon },
];

export default function MobileNav() {
  const [active, setActive] = useState<NavKey>('home');

  const handleTab = (key: NavKey) => {
    setActive(key);
  };

  return (
    <nav className="mobile-nav">
      {tabs.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => handleTab(key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              fontFamily: 'inherit',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: isActive ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              <Icon active={isActive} />
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
