import { machineLocal } from './machine-models';
import type { SubModeConfig } from './demo-constants';

export interface ModePreferences {
  names: Record<string, string>;
  steps: Record<string, SubModeConfig[]>;
  customIds: string[];
}

export function loadModePreferences(): ModePreferences {
  const saved = machineLocal.get<Partial<ModePreferences> | null>('mode-preferences', null);
  const customIds = ['custom', 'custom-2', 'custom-3'].filter(id => id === 'custom' || saved?.customIds?.includes(id));
  return { names: saved?.names ?? {}, steps: saved?.steps ?? {}, customIds };
}

export function saveModePreferences(preferences: ModePreferences) {
  machineLocal.set('mode-preferences', preferences);
}
