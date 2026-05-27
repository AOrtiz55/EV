export type SpotStatus = 'available' | 'in-use' | 'overtime';

export interface Spot {
  id: number;
  status: SpotStatus;
  occupant?: string;
  startTime?: string;
  stopTime?: string;
  timeToFull?: string;
  overtimeMinutes?: number;
  consumption?: string;
  startMs?: number;
  stopMs?: number;
}

export interface NudgeState {
  left: number;
  cooldownActive: boolean;
  remainingSecs: number;
}

export interface OvertimeCardState {
  overlayOpen: boolean;
  nudge: NudgeState;
  resolved: boolean;
}
