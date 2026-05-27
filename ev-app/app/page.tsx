'use client';

import { useState, useCallback, useEffect } from 'react';
import { initialSpots, initialSession, activityItems } from '@/lib/data';
import type { Spot, ActiveSession } from '@/lib/data';

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import Topbar from '@/components/Topbar';
import StatsCards from '@/components/StatsCards';
import MySession from '@/components/MySession';
import Overview from '@/components/Overview';
import RecentActivity from '@/components/RecentActivity';
import SpotRow from '@/components/SpotRow';
import OvertimeCard from '@/components/OvertimeCard';
import OccupyModal from '@/components/OccupyModal';
import StopModal from '@/components/StopModal';

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>(initialSpots);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(initialSession);
  const [occupySpotId, setOccupySpotId] = useState<number | null>(null);
  const [showStopModal, setShowStopModal] = useState(false);
  const [reservedSpots, setReservedSpots] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  // Overtime lifted state
  const [overtimeOverlayOpen, setOvertimeOverlayOpen] = useState(false);
  const [overtimeResolved, setOvertimeResolved] = useState(false);
  const [nudgeLeft, setNudgeLeft] = useState(3);

  // Derived state
  const availableCount = spots.filter((s) => s.status === 'available').length;
  const inUseCount = spots.filter((s) => s.status === 'in-use' || s.status === 'overtime').length;
  const earliestFree = spots
    .filter((s) => s.minutesRemaining != null)
    .sort((a, b) => (a.minutesRemaining ?? 999) - (b.minutesRemaining ?? 999))[0];

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleOccupyById = useCallback((spotId: number) => {
    setOccupySpotId(spotId);
  }, []);

  const handleOccupyConfirm = useCallback((spotId: number, hours: number, minutes: number) => {
    const totalMinutes = hours * 60 + minutes;
    const now = new Date();
    now.setMinutes(now.getMinutes() + totalMinutes);
    const occupiedUntil = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    setSpots((prev) =>
      prev.map((s) =>
        s.id === spotId
          ? { ...s, status: 'in-use', occupiedUntil, minutesRemaining: totalMinutes }
          : s
      )
    );
    setOccupySpotId(null);
  }, []);

  const handleStopConfirm = useCallback(() => {
    setActiveSession(null);
    setSpots((prev) =>
      prev.map((s) =>
        s.id === 1
          ? { ...s, status: 'available', minutesRemaining: undefined, occupiedUntil: undefined, isCurrentUser: false }
          : s
      )
    );
    setShowStopModal(false);
  }, []);

  const handleReserveToggle = useCallback((spotId: number) => {
    setReservedSpots((prev) => {
      const next = new Set(prev);
      if (next.has(spotId)) {
        next.delete(spotId);
      } else {
        next.add(spotId);
      }
      return next;
    });
    showToast(`Spot #${spotId} ${reservedSpots.has(spotId) ? 'unreserved' : 'reserved'}`);
  }, [reservedSpots, showToast]);

  const availableSpots = spots.filter((s) => s.status === 'available');
  const overtimeSpots  = spots.filter((s) => s.status === 'overtime');
  const inUseSpots     = spots.filter((s) => s.status === 'in-use');

  return (
    <>
      {/* Modals — outside layout flow */}
      <OccupyModal
        open={occupySpotId !== null}
        spotId={occupySpotId}
        onConfirm={handleOccupyConfirm}
        onClose={() => setOccupySpotId(null)}
      />
      {showStopModal && (
        <StopModal
          session={activeSession}
          onConfirm={handleStopConfirm}
          onClose={() => setShowStopModal(false)}
        />
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="main">
        <Topbar onLogout={() => setShowStopModal(true)} />
        <div className="body-grid">
          <div className="left-col">
            <StatsCards
              available={availableCount}
              inUse={inUseCount}
              earliestFree={earliestFree}
            />
            <MySession session={activeSession} onStop={() => setShowStopModal(true)} />
            <Overview spots={spots} />
            <RecentActivity items={activityItems.slice(0, 3)} />
          </div>
          <div className="right-col">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'var(--text-tertiary)',
                }}
              >
                Charging Stations
              </span>
              <span
                style={{
                  background: 'rgba(34,197,94,0.1)', color: '#16A34A',
                  border: '1px solid rgba(34,197,94,0.22)',
                  borderRadius: 99, fontSize: 10, fontWeight: 500, padding: '2px 8px',
                }}
              >
                {availableCount} available
              </span>
              <span
                style={{
                  background: 'rgba(220,38,38,0.07)', color: '#DC2626',
                  border: '1px solid rgba(220,38,38,0.18)',
                  borderRadius: 99, fontSize: 10, fontWeight: 500, padding: '2px 8px',
                }}
              >
                {inUseCount} in use
              </span>
            </div>

            {/* Spot list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {availableSpots.map((spot) => (
                <SpotRow
                  key={spot.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  spot={spot as any}
                  variant="card"
                  onOccupy={handleOccupyById}
                  onReserve={() => handleReserveToggle(spot.id)}
                  disabled={!!activeSession}
                  isOwned={!!spot.isCurrentUser}
                />
              ))}

              {overtimeSpots.map((spot) => (
                <OvertimeCard
                  key={spot.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  spot={spot as any}
                  ctx="collapsed"
                  variant="card"
                  onOccupy={handleOccupyById}
                  onReserve={() => handleReserveToggle(spot.id)}
                  disabled={!!activeSession}
                  overlayOpen={overtimeOverlayOpen}
                  onToggleOverlay={() => setOvertimeOverlayOpen((o) => !o)}
                  resolved={overtimeResolved}
                  onResolve={() => setOvertimeResolved(true)}
                  nudgeLeft={nudgeLeft}
                  onNudgeLeftChange={setNudgeLeft}
                />
              ))}

              {inUseSpots.map((spot) => (
                <SpotRow
                  key={spot.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  spot={spot as any}
                  variant="card"
                  onOccupy={handleOccupyById}
                  onReserve={() => handleReserveToggle(spot.id)}
                  isOwned={!!spot.isCurrentUser}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile nav */}
      <MobileNav />
    </>
  );
}
