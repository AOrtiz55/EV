# EV Parking — Spot Management App

A mobile-first web app for tracking and managing EV charging spots in a shared parking facility. Built as a frontend prototype with full interactivity — designed to be connected to a real backend (Keycloak auth, PostgreSQL, Redis, Node.js API) in a future phase.

---

## What It Does

- **Live spot tracking** — see which charging spots are available, in use, or in overtime at a glance
- **My Stats card** — logged-in user sees their active session (spot number, start/stop times, charge %, energy consumption)
- **Charging Stations card** — scrollable list of all spots with status badges
- **Full-screen sheet** — slide-up panel showing all 10 spots with detailed info
- **Overtime flow** — spots past their end time show an animated overtime badge; tap to open an overlay with a nudge button (sends a notification), a 20-minute cooldown timer, and a "They left" resolution action
- **Earliest Free panel** — shows which in-use spots will free up soonest, sorted by time
- **Occupy modal** — claim an available spot with custom hours/minutes or quick-select presets
- **Bottom navigation** — Home, Chat, History, Profile tabs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS (frosted glass) |
| Font | Inter via `next/font/google` |
| State | React hooks (`useState`, `useCallback`, `useRef`) |
| Data | Static mock data in `lib/data.ts` (API-ready) |

---

## Design

Frosted glassmorphism light theme — `backdrop-filter: blur()` on semi-transparent white surfaces over a grey gradient background. Status color system:

- **Available** — green `#22C55E / #16A34A`
- **In Use** — red `#DC2626`
- **Overtime** — orange `#EA580C`
- **CTAs / active states** — near-black `#1A1D23`

---

## Project Structure

```
ev-app/
├── app/
│   ├── globals.css          # Global styles + frosted glass classes + animations
│   ├── layout.tsx           # Root layout — Inter font, metadata
│   └── page.tsx             # Home page — owns all shared state
│
├── components/
│   ├── Header.tsx           # Logo, welcome text, logout, live tracking indicator
│   ├── MyStatsCard.tsx      # Active session card (spot, times, charge bar)
│   ├── SpotRow.tsx          # Individual spot row — available or in-use states
│   ├── OvertimeCard.tsx     # Overtime spot with overlay, nudge, cooldown timer
│   ├── ChargingStationsCard.tsx  # Home card with stat chips + spot list
│   ├── StationSheet.tsx     # Full-screen slide-up sheet (all 10 spots)
│   ├── BottomNav.tsx        # Tab bar navigation
│   ├── EarliestFreePanel.tsx     # Soonest-available popup panel
│   └── OccupyModal.tsx      # Occupy a spot modal with time input
│
└── lib/
    ├── types.ts             # TypeScript interfaces (Spot, SpotStatus, etc.)
    └── data.ts              # Mock data — swap for API calls when backend is ready
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The app is designed for a 390px mobile viewport. For the best experience, use browser DevTools in mobile emulation mode (iPhone 14 Pro or similar).

---

## Key Interactions to Test

| Action | How |
|---|---|
| Open spot sheet | Tap "View all spots" |
| Close sheet | Tap "Collapse" or swipe down |
| See overtime flow | Tap the orange Spot #2 card |
| Send a nudge | Open Spot #2 → tap "Nudge" (3 uses, 20-min cooldown each) |
| Mark as resolved | Open Spot #2 → tap "They left" |
| Occupy a spot | Tap "Occupy" on any available spot |
| See earliest free | Tap "11m Earliest Free ↑" chip |
| Switch nav tabs | Bottom navigation bar |

---

## Planned Backend

| Service | Purpose |
|---|---|
| Keycloak | Authentication + role-based access |
| PostgreSQL | Spot reservations, session history, user data |
| Redis | Real-time spot status pub/sub |
| Node.js API | REST endpoints consumed by this frontend |

When the backend is ready, replace the static exports in `lib/data.ts` with API calls — all components will continue to work without changes.

---

## Additional Files

- `LEARN.html` — interactive learning document explaining every component, React concept, and design decision. Open directly in a browser.
- `../mockup.html` — the original HTML/CSS mockup this React app was built from (frosted glass theme).
