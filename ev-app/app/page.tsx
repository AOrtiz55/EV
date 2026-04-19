'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import MyStatsCard from '@/components/MyStatsCard';
import ChargingStationsCard from '@/components/ChargingStationsCard';
import StationSheet from '@/components/StationSheet';
import BottomNav, { NavTab } from '@/components/BottomNav';
import EarliestFreePanel from '@/components/EarliestFreePanel';
import OccupyModal from '@/components/OccupyModal';

export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [freePanelOpen, setFreePanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Occupy modal
  const [occupyOpen, setOccupyOpen] = useState(false);
  const [occupySpotId, setOccupySpotId] = useState<number | null>(null);

  // Overtime shared state (synced between home card and sheet)
  const [overtimeOverlayOpen, setOvertimeOverlayOpen] = useState(false);
  const [overtimeResolved, setOvertimeResolved] = useState(false);
  const [nudgeLeft, setNudgeLeft] = useState(3);

  const openOccupy = useCallback((spotId: number) => {
    setOccupySpotId(spotId);
    setOccupyOpen(true);
  }, []);

  const closeOccupy = useCallback(() => {
    setOccupyOpen(false);
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
            onOpenSheet={() => setSheetOpen(true)}
            onToggleFreePanel={toggleFreePanel}
            onOccupy={openOccupy}
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
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onToggleFreePanel={toggleFreePanel}
          onOccupy={openOccupy}
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
        />

        {/* Occupy modal */}
        <OccupyModal
          open={occupyOpen}
          spotId={occupySpotId}
          onClose={closeOccupy}
        />
      </div>
    </div>
  );
}
