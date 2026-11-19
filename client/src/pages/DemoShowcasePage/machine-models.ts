import deviceImage from '../../assets/device-bw05s.png';
import grayDeviceImage from '../../assets/device-bw05s-gray.png';
import { demoLocal } from '../../demo/storage';
import { entryPath } from '../../runtime';

export type MachineModelId = 'bw05s' | 'bw05p' | 'bw05a';
const dailyModes = ['auto', 'rapid', 'sterilize-dry', 'self-clean', 'custom', 'custom-2', 'custom-3'];
export const MACHINE_MODELS = [
  { id: 'bw05s', name: 'BW05S', image: grayDeviceImage, modes: ['smart', ...dailyModes, 'baby', 'bottles', 'food-bowl', 'delicate-wash'], consumables: ['water', 'hepa'] },
  { id: 'bw05p', name: 'BW05P', image: deviceImage, modes: ['intensive', ...dailyModes], consumables: ['water', 'hepa'] },
  { id: 'bw05a', name: 'BW05A', image: deviceImage, modes: dailyModes, consumables: ['hepa'] },
] as const;
export type MachineModel = typeof MACHINE_MODELS[number];
export function findMachineModel(id: string | undefined) { return MACHINE_MODELS.find(model => model.id === id); }
let activeId: MachineModelId = findMachineModel(window.location.hash.match(/\/cleaning-machine\/models\/([^/?]+)/)?.[1])?.id ?? 'bw05s';
export function getMachineModel(): MachineModel { return findMachineModel(activeId)!; }
export function activateMachineModel(id: MachineModelId) { activeId = id; }
export function supportsMode(mode: string | null, id: MachineModelId = activeId) { return mode !== null && (findMachineModel(id)!.modes as readonly string[]).includes(mode); }
export function machinePath(screen = 'home', id: MachineModelId = activeId) {
  return entryPath(id === 'bw05s' ? `/cleaning-machine/${screen}` : `/cleaning-machine/models/${id}/${screen}`);
}
export function machineStorageKey(key: string, id: MachineModelId = activeId) { return id === 'bw05s' ? key : `models:${id}:${key}`; }
export const machineLocal = {
  get<T>(key: string, fallback: T, id?: MachineModelId) { return demoLocal.get(machineStorageKey(key, id), fallback); },
  set(key: string, value: unknown, id?: MachineModelId) { demoLocal.set(machineStorageKey(key, id), value); },
  remove(key: string, id?: MachineModelId) { demoLocal.remove(machineStorageKey(key, id)); },
};

export function getDeviceName(id: MachineModelId = activeId) {
  const saved = machineLocal.get<unknown>('device-name', null, id);
  return typeof saved === 'string' && saved.trim() ? saved.trim() : findMachineModel(id)!.name;
}
