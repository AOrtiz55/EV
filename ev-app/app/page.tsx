'use client';

import { useState, useCallback, useRef } from 'react';
import { SPOTS } from '@/lib/data';
import type { Spot } from '@/lib/types';
import Header from '@/components/Header';
import MyStatsCard from '@/components/MyStatsCard';
import ChargingStationsCard from '@/components/ChargingStationsCard';
import StationSheet from '@/components/StationSheet';
import BottomNav, { NavTab } from '@/components/BottomNav';
import EarliestFreePanel from '@/components/EarliestFreePanel';
import OccupyModal from '@/components/OccupyModal';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [freePanelOpen, setFreePanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const [spots, setSpots] = useState<Spot[]>(SPOTS);

  // Occupy modal
  const [occupyOpen, setOccupyOpen] = useState(false);
  const [occupySpotId, setOccupySpotId] = useState<number | null>(null);

  // Overtime shared state (synced between home card and sheet)
  const [overtimeOverlayOpen, setOvertimeOverlayOpen] = useState(false);
  const [overtimeResolved, setOvertimeResolved] = useState(false);
  const [nudgeLeft, setNudgeLeft] = useState(3);

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === spotId
          ? { ...spot, status: 'in-use' as const, occupant: 'You', startTime: formatTime(now), stopTime: formatTime(end), timeToFull }
          : spot
      )
    );
  }, []);

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
  }, []);

  return (
    <div className="flex justify-center items-start" style={{ height: '100dvh', background: '#D8DADF' }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-60px',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.35)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(200,205,215,0.4)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      {/* App shell */}
      <div
        className="relative w-full max-w-[390px] flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(160deg,#E8EAEE 0%,#D8DADF 100%)',
          height: '100dvh',
          zIndex: 1,
        }}
      >
        <Header />

        {/* Main content */}
        <div
          className="flex-1 flex flex-col overflow-hidden px-4 pt-3 pb-20"
          style={{ gap: '12px' }}
        >
          <MyStatsCard />

          <ChargingStationsCard
            spots={spots}
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
          />
        </div>

        {/* Full-screen sheet */}
        <StationSheet
          spots={spots}
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
        />

        {/* Bottom nav */}
        <BottomNav active={activeTab} onSelect={setActiveTab} />

        {/* Earliest free panel */}
        <EarliestFreePanel
          open={freePanelOpen}
          sheetOpen={sheetOpen}
          onClose={() => setFreePanelOpen(false)}
          onReserve={handleReserve}
        />

        {/* Occupy modal */}
        <OccupyModal
          open={occupyOpen}
          spotId={occupySpotId}
          onClose={closeOccupy}
          onConfirm={handleConfirmOccupy}
        />

        {/* Toast */}
        <div
          className={`toast ${toastVisible ? 'toast-visible' : 'toast-hidden'} absolute bottom-24 left-1/2 z-[60]`}
          style={{
            background: 'rgba(26,29,35,0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}
        >
          Reserve — coming soon
        </div>
      </div>
    </div>
  );
}
