const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 14H2.5V2H6" />
    <path d="M10.5 5.5l3 2.5-3 2.5M6.5 8h7" />
  </svg>
);

interface TopbarProps {
  onLogout: () => void;
}

export default function Topbar({ onLogout }: TopbarProps) {
  const date = new Date(2026, 4, 26); // May 26, 2026
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="topbar">
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
          Dashboard
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{dateStr}</p>
      </div>
      <button
        className="btn btn-outline topbar-logout"
        style={{ fontSize: 12, gap: 6 }}
        onClick={onLogout}
      >
        <LogoutIcon />
        Logout
      </button>
    </header>
  );
}
