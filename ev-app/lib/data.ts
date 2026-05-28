import type { Spot } from './types';

export type { Spot } from './types';

export interface ActiveSession {
  spotId: number; spotName: string; station: string; level: string;
  startTime: string; stopTime: string; remainingHours: number;
  consumptionKwh: number; chargePercent: number;
}

export interface ActivityItem {
  id: number; type: 'available' | 'occupied' | 'session-ended' | 'overtime';
  spotName: string; description: string; time: string;
}

export const SPOTS: Spot[] = [
  { id: 1,  status: 'available' },
  { id: 2,  status: 'overtime',  occupant: 'Maria G.',  startTime: '8:00 AM', overtimeMinutes: 8 },
  { id: 3,  status: 'available' },
  { id: 4,  status: 'in-use',    occupant: 'James T.',  startTime: '9:15 AM', timeToFull: '42 min' },
  { id: 5,  status: 'in-use',    occupant: 'Lisa K.',   startTime: '7:30 AM', timeToFull: '1h 05m' },
  { id: 6,  status: 'available' },
  { id: 7,  status: 'in-use',    occupant: 'David R.',  startTime: '10:00 AM', timeToFull: '28 min' },
  { id: 8,  status: 'in-use',    occupant: 'Sarah M.',  startTime: '8:45 AM', timeToFull: '11 min' },
  { id: 9,  status: 'available' },
  { id: 10, status: 'in-use',    occupant: 'Chris P.',  startTime: '9:00 AM', timeToFull: '55 min' },
];

export const EARLIEST_FREE = [
  { id: 8,  minutesUntilFree: 11, freeAt: '8:11 PM' },
  { id: 2,  minutesUntilFree: 19, freeAt: '8:19 PM' },
  { id: 7,  minutesUntilFree: 28, freeAt: '8:28 PM' },
  { id: 4,  minutesUntilFree: 42, freeAt: '8:42 PM' },
  { id: 10, minutesUntilFree: 55, freeAt: '8:55 PM' },
];

export const MY_STATS = {
  spotId: 1,
  station: 'Station A · Level 2',
  startTime: '8:00 AM',
  stopTime: '12:00 PM',
  remain: '4 hr',
  consumption: '3 kWh',
  chargePercent: 74,
};
