import type { SubModeConfig, ModeConfig } from './demo-constants';
import { activateMachineModel, getMachineModel, MACHINE_MODELS, machineLocal, supportsMode, type MachineModelId } from './machine-models';
import { isApp } from '../../runtime';

export interface CleaningMachineState {
  activeScreen: string;
  selectedMode: string | null;
  isRunning: boolean;
  standby: boolean;
  customConfig: SubModeConfig[] | null;
  lastUsedMode: string | null;
  lastUsedAt: number | null;
  modeConfig: ModeConfig | null;
  cycleActive: boolean;
  scheduleAt: number | null;
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
  lastUsedAt: null,
  modeConfig: null,
  cycleActive: false,
  scheduleAt: null,
  elapsedSeconds: 0,
  runStartedAt: null,
  presentation: 'normal',
};

function sanitize(state: CleaningMachineState, id: MachineModelId): CleaningMachineState {
  if ((state.selectedMode && !supportsMode(state.selectedMode, id)) || (state.modeConfig && !supportsMode(state.modeConfig.modeId, id))) {
    state = { ...DEFAULT_STATE, lastUsedAt: state.lastUsedAt };
  }
  if (state.lastUsedMode && !supportsMode(state.lastUsedMode, id)) state = { ...state, lastUsedMode: null };
  if (state.activeScreen === 'smart-mode' && !supportsMode('smart', id)) state = { ...state, activeScreen: 'home' };
  if (id === 'bw05a' && state.presentation.startsWith('filter-')) state = { ...state, presentation: 'normal' };
  return state;
}
let states = Object.fromEntries(MACHINE_MODELS.map(({ id }) => {
  const saved = isApp ? machineLocal.get<Partial<CleaningMachineState>>('machine', {}, id) : {};
  const state = sanitize({ ...DEFAULT_STATE, ...saved, presentation: 'normal' }, id);
  if (isApp) machineLocal.set('machine', state, id);
  return [id, state];
})) as Record<MachineModelId, CleaningMachineState>;
let listeners: Array<() => void> = [];

export const cleaningMachineStore = {
  getSnapshot: () => states[getMachineModel().id],
  getAllSnapshot: () => states,
  selectModel(id: MachineModelId) {
    if (getMachineModel().id === id) return;
    activateMachineModel(id);
    listeners.forEach(fn => fn());
  },
  get(id: MachineModelId = getMachineModel().id): CleaningMachineState {
    return { ...states[id] };
  },

  set(partial: Partial<CleaningMachineState>, id: MachineModelId = getMachineModel().id) {
    const state = sanitize({ ...states[id], ...partial }, id);
    states = { ...states, [id]: state };
    if (isApp) machineLocal.set('machine', state, id);
    listeners.forEach(fn => fn());
  },

  isDeviceActive(): boolean {
    const state = states[getMachineModel().id];
    return state.cycleActive || state.scheduleAt !== null;
  },

  reset(all = false) {
    const ids = all ? MACHINE_MODELS.map(model => model.id) : [getMachineModel().id];
    for (const id of ids) {
      states = { ...states, [id]: { ...DEFAULT_STATE } };
      if (isApp) machineLocal.remove('machine', id);
    }
    listeners.forEach(fn => fn());
  },

  subscribe(listener: () => void): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
