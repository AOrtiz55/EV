# EV Parking App — Learning Guide

This document walks through everything built in this project.
It explains **why** decisions were made, **what** each file does, and **how** the React/Next.js concepts work.
Read this alongside the code.

---

## Table of Contents

1. [Big Picture — What is Next.js?](#1-big-picture--what-is-nextjs)
2. [Folder Structure — Why Each Folder Exists](#2-folder-structure--why-each-folder-exists)
3. [Key React Concepts You Will See Everywhere](#3-key-react-concepts-you-will-see-everywhere)
4. [File-by-File Walkthrough](#4-file-by-file-walkthrough)
   - [globals.css](#globalscss)
   - [layout.tsx](#layouttsx)
   - [page.tsx](#pagetsx)
   - [lib/types.ts](#libtypests)
   - [lib/data.ts](#libdatats)
   - [components/Header.tsx](#componentsheadertsx)
   - [components/MyStatsCard.tsx](#componentsmystatscardtsx)
   - [components/SpotRow.tsx](#componentsspotrrowtsx)
   - [components/OvertimeCard.tsx](#componentsovertimecardtsx)
   - [components/ChargingStationsCard.tsx](#componentschargingstationscardtsx)
   - [components/StationSheet.tsx](#componentsstationsheettsx)
   - [components/BottomNav.tsx](#componentsbottomnavtsx)
   - [components/EarliestFreePanel.tsx](#componentsearliestfreepaneltsx)
   - [components/OccupyModal.tsx](#componentsoccupymodaltsx)
5. [How State Flows Through the App](#5-how-state-flows-through-the-app)
6. [Concepts Cheat Sheet for Your Test](#6-concepts-cheat-sheet-for-your-test)

---

## 1. Big Picture — What is Next.js?

**React** is a JavaScript library for building user interfaces. It lets you break a webpage into small reusable pieces called **components**. Each component is just a function that returns HTML-like code (called JSX).

**Next.js** is a framework built on top of React. It adds things React alone does not give you:
- A file-based routing system (your file path = your URL)
- A way to run server-side code alongside your frontend
- Automatic optimization (code splitting, image handling, fonts)

In this project we use Next.js's **App Router**, which is the modern way to structure Next.js apps (introduced in Next.js 13). The App Router uses a folder called `app/` where every `page.tsx` file becomes a URL route.

---

## 2. Folder Structure — Why Each Folder Exists

```
ev-app/
├── app/                  ← Next.js App Router lives here
│   ├── globals.css       ← CSS that applies to the ENTIRE app
│   ├── layout.tsx        ← The outer "shell" wrapping every page
│   └── page.tsx          ← The home page (URL: /)
│
├── components/           ← Reusable UI building blocks
│   ├── Header.tsx
│   ├── MyStatsCard.tsx
│   ├── SpotRow.tsx
│   ├── OvertimeCard.tsx
│   ├── ChargingStationsCard.tsx
│   ├── StationSheet.tsx
│   ├── BottomNav.tsx
│   ├── EarliestFreePanel.tsx
│   └── OccupyModal.tsx
│
├── lib/                  ← Non-UI logic: data, types, utilities
│   ├── types.ts          ← TypeScript type definitions
│   └── data.ts           ← Static mock data (will become API calls later)
│
├── public/               ← Static files (images, icons) — created by Next.js
├── node_modules/         ← All installed packages — never touch this
├── package.json          ← Lists the project's dependencies and scripts
├── tsconfig.json         ← TypeScript configuration
├── next.config.ts        ← Next.js configuration
└── postcss.config.mjs    ← Needed for Tailwind CSS to work
```

### Why `app/` and not `pages/`?

Older Next.js projects used a `pages/` folder. The newer App Router uses `app/`. We used App Router because it is the current standard and supports the latest React features (like Server Components).

### Why `components/`?

React is all about breaking UI into small, reusable pieces. Instead of putting everything in one giant file (like the mockup.html), we split each visual section into its own file. This means:
- Each piece is easier to read and understand
- You can reuse a component in multiple places
- When something breaks, you know exactly which file to look in

### Why `lib/`?

`lib/` (short for library) holds code that is not a visual component. Types and data don't render anything — they just describe the shape of information. Keeping them separate from components is a convention that keeps your project organized.

---

## 3. Key React Concepts You Will See Everywhere

Before reading the file walkthroughs, understand these core ideas:

### Components

A component is a **function that returns JSX**. JSX looks like HTML but it's actually JavaScript.

```tsx
// This is a component
function Greeting() {
  return <p>Hello, world!</p>
}
```

By convention, component names start with a capital letter.

### Props

Props (short for properties) are how you **pass data into a component** from its parent. Think of them like arguments to a function.

```tsx
// The component accepts props
function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>
}

// The parent passes the prop
<Greeting name="Aaron" />
```

### State (`useState`)

State is data that can **change over time**. When state changes, React automatically re-renders the component to show the new value.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // count starts at 0

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

`useState` always returns two things:
1. The current value (`count`)
2. A function to update it (`setCount`)

### `useCallback`

`useCallback` is a hook that **memoizes a function** — meaning it prevents the function from being recreated on every render. You use it when you're passing a function as a prop to a child component, to avoid unnecessary re-renders.

```tsx
const handleClick = useCallback(() => {
  doSomething();
}, []); // the [] means: only create this function once
```

### `useRef`

`useRef` gives you a way to hold a value that **persists across renders but does NOT cause a re-render when it changes**. It's commonly used to store timer IDs.

```tsx
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
timerRef.current = setInterval(() => { ... }, 1000);
clearInterval(timerRef.current);
```

### `'use client'`

In Next.js App Router, components are **Server Components by default** — they run on the server and cannot use browser features like `useState`, `useEffect`, or event handlers (`onClick`).

When you write `'use client'` at the top of a file, you're telling Next.js: "this component runs in the browser and can use React hooks and events."

**Rule of thumb:** Add `'use client'` whenever your component uses `useState`, `useCallback`, `useRef`, or any event handler.

### TypeScript Interfaces

TypeScript lets you define the **shape of your data** so mistakes are caught before the app runs.

```ts
interface Spot {
  id: number;
  status: 'available' | 'in-use' | 'overtime';
  occupant?: string; // the ? means this field is optional
}
```

---

## 4. File-by-File Walkthrough

---

### `globals.css`

**Why it exists:** This file holds CSS that applies globally to the entire app. Tailwind's base styles are imported here, and we add our custom classes that Tailwind cannot express on its own.

**Key parts of the code:**

```css
@import "tailwindcss";
```
This line loads all of Tailwind's utility classes into the project. Without it, classes like `flex`, `rounded-xl`, and `text-sm` would not work.

```css
.glass {
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  background: rgba(255,255,255,0.58);
  border: 1px solid rgba(255,255,255,0.85);
  box-shadow: 0 4px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95);
}
```
`backdrop-filter: blur()` is the CSS that creates the frosted glass effect. It blurs whatever is behind the element. The `-webkit-` prefix is needed for Safari browsers. `rgba(255,255,255,0.58)` is white at 58% opacity, which lets the blur show through. Tailwind does not have a built-in class for `backdrop-filter` with this level of control, so we write it as custom CSS.

```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1;   box-shadow: 0 0 6px rgba(34,197,94,0.8); }
  50%       { opacity: 0.5; box-shadow: 0 0 0px rgba(34,197,94,0); }
}
.pulse { animation: pulse-dot 2s ease-in-out infinite; }
```
This is a CSS animation. `@keyframes` defines the steps of the animation (from fully visible to half-visible and back). The `.pulse` class applies it. This creates the breathing green dot on available spots.

```css
.sheet-collapsed { transform: translateY(100%); }
.sheet-expanded  { transform: translateY(0%); }
```
`translateY(100%)` moves an element down by 100% of its own height — effectively hiding it below the screen. When we swap the class to `sheet-expanded`, it slides back up. This is how the "View all spots" sheet animates open and closed.

---

### `layout.tsx`

**Why it exists:** In Next.js, `layout.tsx` is a special file that wraps **every page** in your app. It's the outermost shell. Think of it as the frame around a picture — every page gets placed inside it automatically.

```tsx
import { Inter } from "next/font/google";
```
Next.js has a built-in `next/font` system that downloads Google Fonts at build time and serves them from your own server. This is faster than loading from Google's CDN and avoids a flash of unstyled text. Here we load the Inter typeface.

```tsx
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
```
`subsets: ["latin"]` means only download the Latin character set (not Chinese, Arabic, etc.) to keep the font file small. `variable: "--font-inter"` creates a CSS custom property we can reference elsewhere.

```tsx
export const metadata: Metadata = {
  title: "EV Parking",
  description: "EV parking spot management",
};
```
`metadata` is a Next.js App Router feature. Exporting it from a layout or page file automatically sets the `<title>` and `<meta description>` tags in the browser. You don't write the `<head>` tag yourself.

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```
`children` is a special React prop that represents whatever is rendered inside this component. When Next.js renders your home page (`page.tsx`), it wraps it in this layout, passing the page as `children`. `React.ReactNode` is the TypeScript type for "anything React can render."

---

### `page.tsx`

**Why it exists:** In the Next.js App Router, any file named `page.tsx` inside the `app/` folder becomes a URL route. `app/page.tsx` maps to the root URL `/`. If you created `app/history/page.tsx`, it would map to `/history`.

**Why `'use client'` is at the top:**
This page manages state (`useState`) and passes functions as event handlers, so it must run in the browser.

**The state variables:**

```tsx
const [sheetOpen, setSheetOpen] = useState(false);
```
Controls whether the "Charging Stations" full-screen sheet is visible. `false` = collapsed, `true` = expanded.

```tsx
const [freePanelOpen, setFreePanelOpen] = useState(false);
```
Controls the "Earliest Free" popup panel.

```tsx
const [occupyOpen, setOccupyOpen] = useState(false);
const [occupySpotId, setOccupySpotId] = useState<number | null>(null);
```
Two pieces of state that work together for the Occupy modal. `occupySpotId` tracks *which* spot number was clicked so the modal can display "Occupy Spot #3" or whichever number.

```tsx
const [overtimeOverlayOpen, setOvertimeOverlayOpen] = useState(false);
const [overtimeResolved, setOvertimeResolved] = useState(false);
const [nudgeLeft, setNudgeLeft] = useState(3);
```
These three pieces of state are shared between the overtime card in the home view AND the overtime card inside the sheet. Because both cards represent the same real spot (Spot #2), their state must be shared. The only way to share state between two sibling components is to **lift it up** to their common parent — which is this page.

**`useCallback` on handlers:**

```tsx
const openOccupy = useCallback((spotId: number) => {
  setOccupySpotId(spotId);
  setOccupyOpen(true);
}, []);
```
This function is created once and passed down to multiple child components (`ChargingStationsCard`, `StationSheet`). `useCallback` with an empty `[]` dependency array means: create this function once when the page first loads, then reuse the same function reference forever. This avoids unnecessary re-renders in child components.

**The JSX structure:**

```tsx
<div>  {/* App shell — max width 390px, full height */}
  <Header />
  <div>  {/* Main scrollable content area */}
    <MyStatsCard />
    <ChargingStationsCard ... />
  </div>
  <StationSheet ... />   {/* Slides up from below */}
  <BottomNav ... />
  <EarliestFreePanel ... />
  <OccupyModal ... />
</div>
```
The sheet, nav, panel, and modal are all positioned `absolute` (they float over the content). They're placed at the page level rather than inside the cards because they need to cover the entire screen.

---

### `lib/types.ts`

**Why it exists:** TypeScript types describe the **shape of your data**. By defining types in one place, every file that imports them gets automatic error checking. If you try to use a property that doesn't exist on a `Spot`, TypeScript will warn you before the app runs.

```ts
export type SpotStatus = 'available' | 'in-use' | 'overtime';
```
This is a **union type**. It means a `SpotStatus` value can only ever be one of those three strings — nothing else. If you accidentally type `'Available'` (capital A) or `'free'`, TypeScript will show an error.

```ts
export interface Spot {
  id: number;
  status: SpotStatus;
  occupant?: string;
  startTime?: string;
  stopTime?: string;
  timeToFull?: string;
  overtimeMinutes?: number;
}
```
The `?` after a field name means it is optional. Available spots don't have an occupant, so `occupant?` is optional. In-use spots don't have `overtimeMinutes`, so that's optional too.

---

### `lib/data.ts`

**Why it exists:** Right now the app uses hardcoded data (static arrays). When you connect a real backend later, you'll replace this file's contents with API calls — but all the components that import from here will continue to work without any changes. Isolating data in one place makes that future swap easy.

```ts
export const SPOTS: Spot[] = [ ... ]
```
`Spot[]` means "an array of Spot objects." `export` makes the variable available to other files that import it.

```ts
export const EARLIEST_FREE = [ ... ]
export const MY_STATS = { ... }
```
Similarly, the earliest-free list and the current user's session data are exported from here. Components import exactly what they need.

---

### `components/Header.tsx`

**Why it exists:** The header (logo, welcome text, logout, live tracking) appears once at the top of the home screen. Isolating it in its own file means if you ever want to change the header, you only touch one file.

**No `'use client'` — why?**
This component has no state and no interactive event handlers (the logout button has `onMouseOver`/`onMouseOut` for hover color, but those are passive style changes). Actually — it does use `onMouseOver` which is a browser event, so it needs to be a client component. But it works without `'use client'` here because it's imported into `page.tsx` which already marks its subtree as client. Parent `'use client'` propagates down to children.

**Code explanation:**

```tsx
<div style={{ background: 'linear-gradient(160deg, #EAECF0 0%, #DDE0E6 100%)' }} />
```
The header background is a CSS gradient from a lighter grey to a slightly darker grey. We use inline `style` here instead of Tailwind because Tailwind doesn't have a utility for custom gradient values at specific angles — you'd need to configure them in `tailwind.config`.

```tsx
<div style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(255,255,255,0.6) 0%, transparent 70%)' }} />
```
This creates the soft white "light bloom" effect at the top of the header. A radial gradient positioned just above the top edge (`at 50% -10%`) gives the impression of light shining down from above.

```tsx
<span className="w-2 h-2 rounded-full pulse" style={{ background: '#22C55E' }} />
```
`w-2 h-2` = 8px × 8px. `rounded-full` makes it a circle. `pulse` applies our custom CSS animation from `globals.css`. `#22C55E` is the green color.

---

### `components/MyStatsCard.tsx`

**Why it exists:** The "My Stats" section shows the logged-in user's current charging session. It's a read-only display component — it shows data but doesn't manage any interactive state (the Stop button doesn't do anything yet, that's for the real backend).

**Why no props?**
This component directly imports `MY_STATS` from `lib/data.ts`. It doesn't receive data from its parent via props. This is fine for now because there's only one "my stats" section. When connected to a real API, you'd pass the session data as a prop instead.

**Code explanation:**

```tsx
const s = MY_STATS;
```
Just a shorthand alias so we don't type `MY_STATS.spotId`, `MY_STATS.startTime` etc. everywhere.

```tsx
{[
  { label: 'Start',  value: s.startTime },
  { label: 'Stop',   value: s.stopTime },
  { label: 'Remain', value: s.remain },
].map(({ label, value }) => (
  <div key={label} className="glass-inner rounded-xl p-2 text-center">
    ...
  </div>
))}
```
Instead of copy-pasting the same `<div>` block three times, we create an array of objects and use `.map()` to render one `<div>` per item. This is one of the most common patterns in React. `key={label}` is required by React whenever you render a list — it helps React track which item is which when the list changes.

```tsx
<div className="charge-bar h-full rounded-full" style={{ width: `${s.chargePercent}%` }} />
```
The charge bar width is set as an inline style using a template literal. The backtick syntax `` `${s.chargePercent}%` `` inserts the JavaScript value into the string. So if `chargePercent` is 74, the result is the string `"74%"`.

---

### `components/SpotRow.tsx`

**Why it exists:** There are 9 non-overtime spots (4 available, 5 in-use). Rather than copy-pasting HTML for each one, we create one `SpotRow` component that handles all three states. The parent passes a `spot` object and the component decides how to render based on `spot.status`.

**The props:**

```tsx
interface SpotRowProps {
  spot: Spot;
  variant: 'card' | 'sheet';
  onOccupy: (spotId: number) => void;
}
```
- `spot` — the data for this specific parking spot
- `variant` — whether this row appears in the home card (`'card'`) or the full-screen sheet (`'sheet'`). The sheet version uses `.glass` class and shows more detail.
- `onOccupy` — a function passed down from the parent. When the user clicks "Occupy", this function is called with the spot's ID. The component doesn't know what to do with the ID — that's the parent's job. This is called **lifting state up**.

**Code explanation:**

```tsx
const isAvailable = spot.status === 'available';
const isInUse = spot.status === 'in-use';
```
Two simple boolean flags for conditional rendering below.

```tsx
const rowBg =
  variant === 'sheet'
    ? undefined
    : isAvailable
    ? { background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.7)' }
    : { background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.6)' };
```
This is a **nested ternary** (a chain of if/else in one line). If we're in the sheet, no inline styles (the sheet version uses the `.glass` class instead). Otherwise, available spots are slightly brighter than in-use spots.

```tsx
{isAvailable && (
  <span className="w-2 h-2 rounded-full flex-shrink-0 pulse" style={{ background: '#22C55E' }} />
)}
```
`&&` is the conditional rendering pattern in React. If `isAvailable` is true, render the green dot. If false, render nothing. It's equivalent to `if (isAvailable) { return <span/> }`.

```tsx
<button onClick={() => onOccupy(spot.id)} ...>Occupy</button>
```
When clicked, calls the `onOccupy` function that was passed down as a prop, with this spot's ID as the argument. The component doesn't manage any state — it just reports the click upward.

---

### `components/OvertimeCard.tsx`

**Why it exists:** Spot #2 is in overtime and has the most complex behavior of any spot — it has a toggle-able overlay, a nudge button with a cooldown timer, progress bar, and a "They left" resolution flow. All of this logic lives here.

**Why `'use client'`?**
This component uses `useState`, `useRef`, and `useCallback` — all browser-only React hooks. It must be a client component.

**Why are some pieces of state local and some are props?**

```tsx
// Local state — only affects THIS component's display
const [cooldownActive, setCooldownActive] = useState(false);
const [remainingSecs, setRemainingSecs] = useState(COOLDOWN_SECS);

// Shared state — passed from the page via props
overlayOpen: boolean;
onToggleOverlay: () => void;
nudgeLeft: number;
onNudgeLeftChange: (n: number) => void;
```
`cooldownActive` and `remainingSecs` are local because they only affect the visual display of the timer inside THIS card instance. But `overlayOpen` and `nudgeLeft` are shared props because the home-card version and the sheet version of Spot #2 must stay in sync. If you nudge from the sheet, the home card should also show the pip used up. Shared state lives in the parent (`page.tsx`) and flows down as props.

**Code explanation:**

```tsx
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
```
`useRef` stores the interval ID returned by `setInterval`. We need to keep this reference so we can `clearInterval` later (when the timer ends or when "They left" is clicked). If we stored this in `useState` instead, updating it would cause a re-render — we don't want that. `useRef` persists across renders silently.

`ReturnType<typeof setInterval>` is TypeScript saying "whatever type `setInterval` returns" — which is a number in browsers. The `| null` means it can also be null (before the timer starts).

```tsx
const handleNudge = useCallback(
  (e: React.MouseEvent) => {
    e.stopPropagation();
    ...
  },
  [nudgeLeft, cooldownActive, onNudgeLeftChange]
);
```
`e.stopPropagation()` prevents the click from "bubbling up" to the transparent button behind the overlay (which would accidentally close the overlay). The dependency array `[nudgeLeft, cooldownActive, onNudgeLeftChange]` tells React: recreate this function whenever these values change.

```tsx
intervalRef.current = setInterval(() => {
  secs--;
  setRemainingSecs(secs);
  if (secs <= 0) {
    clearInterval(intervalRef.current!);
    if (newLeft > 0) setCooldownActive(false);
  }
}, 1000);
```
`setInterval` runs the callback every 1000 milliseconds (1 second). Each tick: decrement `secs`, update the displayed time with `setRemainingSecs`. When it hits zero, clear the interval and unlock the nudge button (if nudges remain). The `!` after `intervalRef.current` is TypeScript's "non-null assertion" — telling TypeScript "I know this isn't null here."

**The pip dots:**
```tsx
{[3, 2, 1].map((pip) => (
  <span
    key={pip}
    style={{
      background: nudgeLeft >= pip ? '#EA580C' : 'rgba(0,0,0,0.1)',
    }}
  />
))}
```
We render 3 pips. The condition `nudgeLeft >= pip` determines if a pip should be orange (filled) or grey (used). When `nudgeLeft = 2`, pip 3 is grey (2 >= 3 is false), pips 1 and 2 are orange (2 >= 1 and 2 >= 2 are both true). This creates the visual "used up" effect.

---

### `components/ChargingStationsCard.tsx`

**Why it exists:** This is the "Charging Stations" card on the home screen. It's essentially a container that shows the stat chips (Available/In Use/Earliest Free) and the spot list. It receives all its interaction handlers as props from `page.tsx`.

**Why are `available` and `inUse` computed outside the component?**

```tsx
const available = SPOTS.filter((s) => s.status === 'available').length;
const inUse = SPOTS.filter((s) => s.status === 'in-use').length;
```
These are computed once at module load time (outside the function) rather than inside the component function. Since the data is static, there's no need to recompute it on every render. When connected to a real API, these would become derived values inside the component, computed from live data.

**`filter()`:**
`.filter()` creates a new array containing only the elements that pass the test. `.length` gives you the count. So `SPOTS.filter(s => s.status === 'available').length` = number of available spots.

**Passing props down:**
```tsx
<OvertimeCard
  spot={overtimeSpot}
  ctx="collapsed"
  overlayOpen={overtimeOverlayOpen}
  onToggleOverlay={onToggleOvertimeOverlay}
  ...
/>
```
Every piece of shared overtime state gets passed through this component to `OvertimeCard`. This is called **prop drilling** — passing props through an intermediate component that doesn't use them itself, just passes them further down. It's acceptable for small apps. For larger apps, you'd use React Context or a state management library to avoid this.

---

### `components/StationSheet.tsx`

**Why it exists:** This is the full-screen slide-up panel that shows all 10 spots. It's structurally almost identical to `ChargingStationsCard` but uses `.glass` classes on each spot row and has a header with a drag handle and collapse button.

**Why is it a separate component and not just ChargingStationsCard?**
Because they have different visual styles and different structural elements (the sheet has a drag handle, a header bar, scrolls differently, and each spot row uses `.glass` instead of a transparent background). Combining them into one component with lots of conditional logic would make it harder to read and maintain.

**How the slide animation works:**

```tsx
className={`sheet-transition ${open ? 'sheet-expanded' : 'sheet-collapsed'}`}
```
When `open` is `false`, the class `sheet-collapsed` is applied, which sets `transform: translateY(100%)` — pushing it off the bottom of the screen. When `open` becomes `true`, `sheet-expanded` applies `transform: translateY(0%)` — bringing it back to normal position. The `sheet-transition` class has `transition: transform 0.4s cubic-bezier(...)` which makes the movement animate smoothly.

```tsx
style={{ background: 'linear-gradient(160deg,#E8EAEE 0%,#D8DADF 100%)' }}
```
The sheet has its own background gradient so it covers the home content behind it when open.

---

### `components/BottomNav.tsx`

**Why it exists:** The bottom navigation bar with Home, Chat, History, and Profile tabs. Separating it into its own component keeps `page.tsx` clean and makes the nav easy to find and modify.

**The tab definitions:**

```tsx
const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <svg>...</svg> },
  ...
]
```
Instead of writing each tab button manually, we define an array of tab objects and map over them. `React.ReactNode` is the type for "anything renderable" — here it's the SVG icon for each tab. This array-driven approach makes adding a new tab as simple as adding one object to the array.

**`export type NavTab`:**

```tsx
export type NavTab = 'home' | 'chat' | 'history' | 'profile';
```
This type is exported so `page.tsx` can import and use it. This keeps the valid tab names defined in one place — if you add a new tab here, TypeScript will flag anywhere in the app that doesn't handle it.

**Active tab styling:**

```tsx
className={`flex flex-col items-center gap-1 ${isActive ? '' : 'opacity-35'}`}
```
Inactive tabs get `opacity-35` (35% opacity — muted). The active tab gets the full opacity, plus a dark circle background on its icon.

---

### `components/EarliestFreePanel.tsx`

**Why it exists:** The "Soonest Available" popup panel that appears when you tap "11m Earliest Free ↑". It shows a sorted list of spots that will free up soon.

**The positioning logic:**

```tsx
const panelPosition = sheetOpen
  ? { top: '50%', transform: 'translateY(-50%)', bottom: 'auto' }
  : { bottom: '90px', top: 'auto', transform: 'none' };
```
When the sheet is open, the panel centers itself vertically on screen (`top: 50%, transform: translateY(-50%)` is the standard CSS trick for vertical centering). When the sheet is closed, it sits 90px above the bottom (just above the nav bar). This matches the original mockup behavior.

**The backdrop:**

```tsx
<div
  style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none' }}
  onClick={onClose}
/>
```
A dark semi-transparent overlay behind the panel. When you click it, `onClose` is called — closing the panel. `pointerEvents: none` when hidden means you can still click through it to the content below, even though the element technically still exists in the DOM.

---

### `components/OccupyModal.tsx`

**Why it exists:** The "Occupy Spot" modal that slides in when you tap an Occupy button. It has time inputs, quick-select buttons, and a confirm button.

**Why `'use client'`?**
It uses `useState` to track the hours and minutes the user types in.

**Local state:**
```tsx
const [hours, setHours] = useState('');
const [minutes, setMinutes] = useState('');
```
These values only matter inside this modal — no other component needs to know what the user typed. So they're local state, not lifted up to the page.

**`setTime` function:**
```tsx
const setTime = (h: number, m: number) => {
  setHours(h === 0 ? '' : String(h));
  setMinutes(m === 0 ? '00' : String(m));
};
```
The quick-select buttons call this. It programmatically fills the inputs. `h === 0 ? '' : String(h)` means: if hours is 0, show an empty input (so placeholder text shows). `String(h)` converts the number to a string because `<input>` values are strings.

**`confirm` function:**
```tsx
const confirm = () => {
  if (!hours && !minutes) {
    alert('Please enter a charge time.');
    return;
  }
  onClose();
};
```
Basic validation before closing. `!hours` is true when hours is an empty string. `return` exits the function early — this is called an **early return** and prevents the rest of the function from running.

**`handleClose` resets state:**
```tsx
const handleClose = () => {
  setHours('');
  setMinutes('');
  onClose();
};
```
When the modal closes, the inputs are cleared. This means if you open it again for a different spot, you start fresh. This is important UX — without this, the previous spot's time would still be in the inputs.

---

## 5. How State Flows Through the App

This diagram shows which component owns each piece of state and how it flows down:

```
page.tsx (owns all shared state)
│
│── sheetOpen → StationSheet (controls visibility)
│── freePanelOpen → EarliestFreePanel (controls visibility)
│── occupyOpen + occupySpotId → OccupyModal (controls visibility + which spot)
│── overtimeOverlayOpen ──┐
│── overtimeResolved      ├── ChargingStationsCard → OvertimeCard (ctx="collapsed")
│── nudgeLeft             ┘
│                         └── StationSheet → OvertimeCard (ctx="sheet")
│
└── activeTab → BottomNav (which tab is highlighted)
```

**The key insight:** `OvertimeCard` appears twice — once inside `ChargingStationsCard` and once inside `StationSheet`. But both instances share the same state from `page.tsx`. That's why nudging in the sheet also uses up a pip in the home card.

---

## 6. Concepts Cheat Sheet for Your Test

| Concept | What It Is | When You Use It |
|---|---|---|
| **Component** | A function that returns JSX | Every UI element |
| **Props** | Data passed into a component | When a parent needs to configure a child |
| **State (`useState`)** | Data that changes over time, triggers re-render | Interactive UI (open/closed, counts, inputs) |
| **`useCallback`** | Memoizes a function so it isn't recreated every render | When passing functions as props to children |
| **`useRef`** | Holds a value that persists without triggering re-render | Timer IDs, DOM references |
| **`'use client'`** | Marks a component as browser-only | Whenever you use hooks or event handlers |
| **Lifting state up** | Moving state to a common parent so siblings can share it | When two components need the same data |
| **Prop drilling** | Passing props through intermediary components | Small apps — acceptable |
| **Conditional rendering** | `{condition && <Component />}` | Showing/hiding UI based on state |
| **`.map()` in JSX** | Renders a list of items from an array | Spot rows, nav tabs, quick-select buttons |
| **`key` prop** | Required on list items so React can track them | Always when using `.map()` in JSX |
| **TypeScript interface** | Defines the shape of an object | Props, data models |
| **Union type** | `'a' \| 'b' \| 'c'` — one of these specific values | Status fields, tab names |
| **Early return** | `if (bad) return;` — exit a function before finishing | Form validation |
| **`@/`** | Import alias for the project root (`lib/`, `components/`) | Cleaner import paths |

---

*This document was written specifically for the EV Parking app built in this project. All code examples reference real files in this codebase.*
