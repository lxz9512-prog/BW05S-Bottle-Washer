import { DEFAULT_CUSTOM_MODES, type SubModeConfig } from './demo-constants';

export function cycleSteps(mode: string | null, custom: SubModeConfig[] | null): SubModeConfig[] {
  if (mode === 'custom') return (custom ?? DEFAULT_CUSTOM_MODES).map(step => ({ ...step }));
  return DEFAULT_CUSTOM_MODES.map(step => ({
    ...step,
    enabled: mode === 'self-clean' ? step.id === 'wash' : true,
    duration: step.id === 'wash' && mode === 'rapid' ? 19 : step.duration,
  }));
}

export function stepSeconds(step: SubModeConfig) {
  return step.duration * (step.unit === 'h' ? 3600 : 60);
}

export function cycleProgress(steps: SubModeConfig[], elapsed: number) {
  let cursor = 0;
  const statuses = steps.map(step => {
    if (!step.enabled) return { status: 'off' as const, remaining: 0 };
    const start = cursor;
    cursor += stepSeconds(step);
    return {
      status: elapsed >= cursor ? 'completed' as const : elapsed >= start ? 'active' as const : 'pending' as const,
      remaining: Math.max(0, cursor - Math.max(elapsed, start)),
    };
  });
  const washSeconds = steps.filter(step => step.enabled && step.unit !== 'h').reduce((total, step) => total + stepSeconds(step), 0);
  return { statuses, complete: elapsed >= cursor, remaining: Math.max(0, washSeconds - elapsed), totalRemaining: Math.max(0, cursor - elapsed) };
}

export function normalizeDuration(value: string, step: SubModeConfig) {
  const fallback = DEFAULT_CUSTOM_MODES.find(item => item.id === step.id)?.duration ?? step.duration;
  const parsed = value.trim() === '' ? fallback : Number(value);
  const valid = Number.isFinite(parsed) ? Math.round(parsed) : step.duration;
  return { value: Math.max(step.min, Math.min(step.max, valid)), invalid: !Number.isFinite(parsed) || valid < step.min || valid > step.max };
}

export function lockedCycleSteps(steps: SubModeConfig[], elapsed: number) {
  const { statuses } = cycleProgress(steps, elapsed);
  const current = statuses.findIndex(item => item.status === 'active');
  const last = current < 0 ? steps.length - 1 : current;
  return Object.fromEntries(steps.flatMap((step, index) => index <= last ? [[step.id, statuses[index].status]] : []));
}
