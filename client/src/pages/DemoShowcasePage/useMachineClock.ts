import { useEffect, useSyncExternalStore } from 'react';
import { cleaningMachineStore } from './cleaning-machine-store';
import { useDemo } from '../../demo/react';
import { cycleProgress, cycleSteps } from './machine-cycle';

export function useMachineClock() {
  const machine = useSyncExternalStore(cleaningMachineStore.subscribe, cleaningMachineStore.getSnapshot);
  const { active } = useDemo();
  useEffect(() => {
    const timer = window.setInterval(() => {
      const state = cleaningMachineStore.get();
      const now = Date.now();
      if (active || ['offline', 'error-df', 'error-af'].includes(state.presentation)) {
        if (state.runStartedAt) cleaningMachineStore.set({ runStartedAt: now });
        return;
      }
      if (state.scheduleAt && now >= state.scheduleAt) {
        cleaningMachineStore.set({ scheduleAt: null, cycleActive: true, isRunning: true, elapsedSeconds: 0, runStartedAt: now,
          activeScreen: state.activeScreen === 'settings' ? 'settings' : state.selectedMode === 'smart' ? 'smart-mode' : 'run-control' });
      } else if (state.cycleActive && state.isRunning) {
        const elapsedSeconds = state.elapsedSeconds + Math.max(0, (now - (state.runStartedAt ?? now)) / 1000);
        const complete = cycleProgress(cycleSteps(state.selectedMode, state.customConfig), elapsedSeconds).complete;
        cleaningMachineStore.set({ elapsedSeconds, runStartedAt: complete ? null : now, isRunning: !complete });
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active]);
  return machine;
}
