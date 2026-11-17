import type { SubModeConfig, ModeConfig } from './demo-constants';
import { demoLocal } from '../../demo/storage';
import { isApp } from '../../runtime';

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

const saved = isApp ? demoLocal.get<Partial<CleaningMachineState>>('machine', {}) : {};
let state: CleaningMachineState = { ...DEFAULT_STATE, ...saved, presentation: 'normal' };
let listeners: Array<() => void> = [];

export const cleaningMachineStore = {
  getSnapshot: () => state,
  get(): CleaningMachineState {
    return { ...state };
  },

  set(partial: Partial<CleaningMachineState>) {
    state = { ...state, ...partial };
    if (isApp) demoLocal.set('machine', state);
    listeners.forEach(fn => fn());
  },

  isDeviceActive(): boolean {
    return state.cycleActive || state.scheduleAt !== null;
  },

  reset() {
    state = { ...DEFAULT_STATE };
    if (isApp) demoLocal.remove('machine');
    listeners.forEach(fn => fn());
  },

  subscribe(listener: () => void): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
