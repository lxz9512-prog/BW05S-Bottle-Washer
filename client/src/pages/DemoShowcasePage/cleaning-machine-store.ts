import type { SubModeConfig, ModeConfig } from './demo-constants';

export interface CleaningMachineState {
  activeScreen: string;
  selectedMode: string | null;
  isRunning: boolean;
  standby: boolean;
  customConfig: SubModeConfig[] | null;
  lastUsedMode: string | null;
  modeConfig: ModeConfig | null;
  cycleActive: boolean;
  scheduleAt: number | null;
  childLocked: boolean;
  elapsedSeconds: number;
  runStartedAt: number | null;
  presentation: 'normal' | 'offline' | 'error-df' | 'error-af' | 'filter-soon' | 'filter-expired';
}

const DEFAULT_STATE: CleaningMachineState = {
  activeScreen: 'home',
  selectedMode: null,
  isRunning: true,
  standby: false,
  customConfig: null,
  lastUsedMode: null,
  modeConfig: null,
  cycleActive: false,
  scheduleAt: null,
  childLocked: false,
  elapsedSeconds: 0,
  runStartedAt: null,
  presentation: 'normal',
};

let state: CleaningMachineState = { ...DEFAULT_STATE };
let listeners: Array<() => void> = [];

export const cleaningMachineStore = {
  getSnapshot: () => state,
  get(): CleaningMachineState {
    return { ...state };
  },

  set(partial: Partial<CleaningMachineState>) {
    state = { ...state, ...partial };
    listeners.forEach(fn => fn());
  },

  isDeviceActive(): boolean {
    return state.cycleActive || state.scheduleAt !== null;
  },

  reset() {
    state = { ...DEFAULT_STATE };
    listeners.forEach(fn => fn());
  },

  subscribe(listener: () => void): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
