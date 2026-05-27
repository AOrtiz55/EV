export type SpotStatus = 'available' | 'in-use' | 'overtime' | 'reserved';

export interface Spot {
  id: number;
  name: string;
  station: string;
  level: string;
  status: SpotStatus;
  occupiedUntil?: string;
  minutesRemaining?: number;
  isCurrentUser?: boolean;
  overtimeMinutes?: number;
}

export interface ActiveSession {
  spotId: number;
  spotName: string;
  station: string;
  level: string;
  startTime: string;
  stopTime: string;
  remainingHours: number;
  consumptionKwh: number;
  chargePercent: number;
}

export interface ActivityItem {
  id: number;
  type: 'available' | 'occupied' | 'session-ended' | 'overtime';
  spotName: string;
  description: string;
  time: string;
}

export const initialSpots: Spot[] = [
  { id: 1, name: 'Spot #1', station: 'Station A', level: 'Level 2', status: 'in-use', occupiedUntil: '12:00 PM', minutesRemaining: 240, isCurrentUser: true },
  { id: 2, name: 'Spot #2', station: 'Station A', level: 'Level 2', status: 'in-use', occupiedUntil: '1:30 PM', minutesRemaining: 90 },
  { id: 3, name: 'Spot #3', station: 'Station A', level: 'Level 2', status: 'available' },
  { id: 4, name: 'Spot #4', station: 'Station A', level: 'Level 2', status: 'overtime', overtimeMinutes: 14 },
  { id: 5, name: 'Spot #5', station: 'Station B', level: 'Level 1', status: 'in-use', occupiedUntil: '2:00 PM', minutesRemaining: 120 },
  { id: 6, name: 'Spot #6', station: 'Station B', level: 'Level 1', status: 'in-use', occupiedUntil: '12:00 PM', minutesRemaining: 11 },
  { id: 7, name: 'Spot #7', station: 'Station B', level: 'Level 1', status: 'available' },
  { id: 8, name: 'Spot #8', station: 'Station B', level: 'Level 1', status: 'in-use', occupiedUntil: '3:00 PM', minutesRemaining: 180 },
  { id: 9, name: 'Spot #9', station: 'Station B', level: 'Level 1', status: 'available' },
];

export const initialSession: ActiveSession = {
  spotId: 1,
  spotName: 'Spot #1',
  station: 'Station A',
  level: 'Level 2',
  startTime: '8:00 AM',
  stopTime: '12:00 PM',
  remainingHours: 4,
  consumptionKwh: 3,
  chargePercent: 74,
};

export const activityItems: ActivityItem[] = [
  { id: 1, type: 'overtime', spotName: 'Spot #4', description: 'is in overtime — 14 min over', time: '11:44 AM' },
  { id: 2, type: 'available', spotName: 'Spot #9', description: 'now available', time: '10:30 AM' },
  { id: 3, type: 'session-ended', spotName: 'Spot #7', description: 'session ended', time: '10:30 AM' },
  { id: 4, type: 'occupied', spotName: 'Spot #1', description: 'occupied by you', time: '8:00 AM' },
  { id: 5, type: 'available', spotName: 'Spot #2', description: 'now in use', time: '7:55 AM' },
];
