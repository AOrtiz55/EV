export type NavTab = 'home' | 'chat' | 'history' | 'profile';

interface BottomNavProps {
  active: NavTab;
  onSelect: (tab: NavTab) => void;
}

const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

export default function BottomNav({ active, onSelect }: BottomNavProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 pt-2"
      style={{ background: 'linear-gradient(to top,#D8DADF 60%,transparent)' }}
    >
      <div className="glass rounded-2xl px-4 py-2.5 flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`flex flex-col items-center gap-1 ${isActive ? '' : 'opacity-35'}`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={
                  isActive
                    ? { background: '#1A1D23', boxShadow: '0 4px 12px rgba(26,29,35,0.25)' }
                    : {}
                }
              >
                {tab.icon}
              </div>
              <span
                className={`text-[10px] ${isActive ? 'font-bold' : 'font-semibold'}`}
                style={{ color: isActive ? '#1A1D23' : '#9CA3AF' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
