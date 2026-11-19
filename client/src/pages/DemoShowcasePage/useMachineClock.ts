import { useEffect, useSyncExternalStore } from 'react';
import { cleaningMachineStore } from './cleaning-machine-store';
import { useDemo } from '../../demo/react';
import { cycleProgress, cycleSteps } from './machine-cycle';
import { getMachineModel, MACHINE_MODELS } from './machine-models';

export function useMachineClock() {
  const machine = useSyncExternalStore(cleaningMachineStore.subscribe, cleaningMachineStore.getSnapshot);
  const { active } = useDemo();
  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();
      for (const { id } of MACHINE_MODELS) {
        const state = cleaningMachineStore.get(id);
        if ((active && id === getMachineModel().id) || ['offline', 'error-df', 'error-af'].includes(state.presentation)) {
          if (state.runStartedAt) cleaningMachineStore.set({ runStartedAt: now }, id);
          continue;
        }
        if (state.scheduleAt && now >= state.scheduleAt) {
          cleaningMachineStore.set({ scheduleAt: null, cycleActive: true, isRunning: true, elapsedSeconds: 0, runStartedAt: now, lastUsedAt: now }, id);
        } else if (state.cycleActive && state.isRunning) {
          const elapsedSeconds = state.elapsedSeconds + Math.max(0, (now - (state.runStartedAt ?? now)) / 1000);
          const complete = cycleProgress(cycleSteps(state.selectedMode, state.customConfig), elapsedSeconds).complete;
          cleaningMachineStore.set({ elapsedSeconds, runStartedAt: complete ? null : now, isRunning: !complete }, id);
        }
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active]);
  return machine;
}
