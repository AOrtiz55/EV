'use client';

import { useState, useCallback, useRef } from 'react';
import { SPOTS } from '@/lib/data';
import type { Spot } from '@/lib/types';

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import Topbar from '@/components/Topbar';
import StatsCards from '@/components/StatsCards';
import MyStatsCard from '@/components/MyStatsCard';
import Overview from '@/components/Overview';
import RecentActivity from '@/components/RecentActivity';
import ChargingStationsCard from '@/components/ChargingStationsCard';
import OccupyModal from '@/components/OccupyModal';
import StopModal from '@/components/StopModal';
import StationSheet from '@/components/StationSheet';
import EarliestFreePanel from '@/components/EarliestFreePanel';

interface ActivityItem {
  id: number; type: 'available' | 'occupied' | 'session-ended' | 'overtime';
  spotName: string; description: string; time: string;
}

const activityItems: ActivityItem[] = [
  { id: 1, type: 'overtime',      spotName: 'Spot #2', description: 'is in overtime — 8 min over', time: '11:44 AM' },
  { id: 2, type: 'available',     spotName: 'Spot #9', description: 'now available',               time: '10:30 AM' },
  { id: 3, type: 'session-ended', spotName: 'Spot #7', description: 'session ended',               time: '10:30 AM' },
  { id: 4, type: 'occupied',      spotName: 'Spot #1', description: 'occupied by you',             time: '8:00 AM'  },
  { id: 5, type: 'available',     spotName: 'Spot #2', description: 'now in use',                  time: '7:55 AM'  },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function Home() {
  const [displayName] = useState('Aaron');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [freePanelOpen, setFreePanelOpen] = useState(false);

  const [spots, setSpots] = useState<Spot[]>(SPOTS);
  const hasActiveSession = spots.some((s) => s.occupant === displayName && s.status === 'in-use');
  const activeSpot = spots.find((s) => s.occupant === displayName && s.status === 'in-use') ?? null;

  // Occupy modal
  const [occupyOpen, setOccupyOpen] = useState(false);
  const [occupySpotId, setOccupySpotId] = useState<number | null>(null);

  // Overtime shared state
  const [overtimeOverlayOpen, setOvertimeOverlayOpen] = useState(false);
  const [overtimeResolved, setOvertimeResolved] = useState(false);
  const [nudgeLeft, setNudgeLeft] = useState(3);

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Desktop-only: stop confirmation modal
  const [showStopModal, setShowStopModal] = useState(false);

  const openOccupy = useCallback((spotId: number) => {
    setOccupySpotId(spotId);
    setOccupyOpen(true);
  }, []);

  const closeOccupy = useCallback(() => {
    setOccupyOpen(false);
  }, []);

  const handleConfirmOccupy = useCallback((spotId: number, hours: number, minutes: number) => {
    const now = new Date();
    const end = new Date(now.getTime() + (hours * 60 + minutes) * 60 * 1000);
    const timeToFull = hours > 0 ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${minutes} min`;
    const totalHours = (hours * 60 + minutes) / 60;
    const consumption = (totalHours * 3).toFixed(1) + ' kWh';
    setSpots((prev) => {
      if (prev.find((s) => s.id === spotId)?.status === 'overtime') {
        setOvertimeOverlayOpen(false);
      }
      return prev.map((spot) =>
        spot.id === spotId
          ? { ...spot, status: 'in-use' as const, occupant: displayName, startTime: formatTime(now), stopTime: formatTime(end), timeToFull, consumption, startMs: now.getTime(), stopMs: end.getTime(), startTimeRaw: now, stopTimeRaw: end }
          : spot
      );
    });
  }, [displayName]);

  const handleStop = useCallback(() => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.occupant === displayName && spot.status === 'in-use'
          ? { ...spot, status: 'available' as const, occupant: undefined, startTime: undefined, stopTime: undefined, timeToFull: undefined }
          : spot
      )
    );
    setShowStopModal(false);
  }, [displayName]);

  const handleReserve = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000);
  }, []);

  const toggleFreePanel = useCallback(() => {
    setFreePanelOpen((v) => !v);
  }, []);

  const toggleOvertimeOverlay = useCallback(() => {
    if (overtimeResolved) return;
    setOvertimeOverlayOpen((v) => !v);
  }, [overtimeResolved]);

  const resolveOvertime = useCallback(() => {
    setOvertimeResolved(true);
    setOvertimeOverlayOpen(false);
    setSpots((prev) =>
      prev.map((spot) =>
        spot.status === 'overtime'
          ? { ...spot, status: 'available' as const, occupant: undefined, startTime: undefined, overtimeMinutes: undefined }
          : spot
      )
    );
  }, []);

  return (
    <>
      {/* Fixed overlay layer — z-200 so it sits above sidebar (z-100) and all content.
          pointer-events:none on the wrapper lets the layout beneath receive events;
          children with pointer-events:auto/all (buttons, backdrop) still fire normally. */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: 'none', overflow: 'hidden' }}>
        <EarliestFreePanel
          open={freePanelOpen}
          sheetOpen={sheetOpen}
          onClose={() => setFreePanelOpen(false)}
          onReserve={handleReserve}
        />
      </div>

      {/* Modals */}
      <OccupyModal
        open={occupyOpen}
        spotId={occupySpotId}
        onConfirm={handleConfirmOccupy}
        onClose={closeOccupy}
      />
      {showStopModal && (
        <StopModal
          activeSpot={activeSpot}
          onConfirm={handleStop}
          onClose={() => setShowStopModal(false)}
        />
      )}

      {/* Toast */}
      <div className={`toast ${toastVisible ? 'toast-visible' : 'toast-hidden'}`}>
        Reserve — coming soon
      </div>

      <Sidebar />

      <main className="main">
        <Topbar onLogout={() => setShowStopModal(true)} />
        <div className="body-grid">
          <div className="left-col">
            <StatsCards spots={spots} />
            <MyStatsCard activeSpot={activeSpot} displayName={displayName} onStop={() => setShowStopModal(true)} />
            <Overview spots={spots} />
            <RecentActivity items={activityItems.slice(0, 3)} />
          </div>
          <div className="right-col">
            <ChargingStationsCard
              spots={spots}
              hasActiveSession={hasActiveSession}
              onOpenSheet={() => setSheetOpen(true)}
              onToggleFreePanel={toggleFreePanel}
              onOccupy={openOccupy}
              onReserve={handleReserve}
              overtimeOverlayOpen={overtimeOverlayOpen}
              onToggleOvertimeOverlay={toggleOvertimeOverlay}
              overtimeResolved={overtimeResolved}
              onOvertimeResolve={resolveOvertime}
              nudgeLeft={nudgeLeft}
              onNudgeLeftChange={setNudgeLeft}
              displayName={displayName}
            />
            <StationSheet
              spots={spots}
              hasActiveSession={hasActiveSession}
              open={sheetOpen}
              onClose={() => setSheetOpen(false)}
              onToggleFreePanel={toggleFreePanel}
              onOccupy={openOccupy}
              onReserve={handleReserve}
              overtimeOverlayOpen={overtimeOverlayOpen}
              onToggleOvertimeOverlay={toggleOvertimeOverlay}
              overtimeResolved={overtimeResolved}
              onOvertimeResolve={resolveOvertime}
              nudgeLeft={nudgeLeft}
              onNudgeLeftChange={setNudgeLeft}
              displayName={displayName}
            />
          </div>
        </div>
      </main>

      <MobileNav />
    </>
  );
}
