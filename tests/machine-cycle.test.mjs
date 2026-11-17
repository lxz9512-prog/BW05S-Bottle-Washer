import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync } from 'node:fs';

const load = path => ts.transpile(readFileSync(new URL(path, import.meta.url), 'utf8'), { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 });
const asUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const constantsUrl = asUrl(load('../client/src/pages/DemoShowcasePage/demo-constants.ts'));
const { DEFAULT_CUSTOM_MODES } = await import(constantsUrl);
const { cycleSteps, cycleProgress, normalizeDuration, lockedCycleSteps } = await import(asUrl(load('../client/src/pages/DemoShowcasePage/machine-cycle.ts').replace('./demo-constants', constantsUrl)));

test('custom starts unchecked and duration ranges match the design', () => {
  assert.ok(DEFAULT_CUSTOM_MODES.every(step => !step.enabled));
  assert.deepEqual(DEFAULT_CUSTOM_MODES.map(({ min, max, duration, step }) => [min, max, duration, step]), [[19, 45, 29, 1], [7, 10, 9, 1], [40, 70, 55, 5], [10, 72, 72, 1]]);
});
test('numeric edits clamp bounds and empty input restores original default', () => {
  const wash = { ...DEFAULT_CUSTOM_MODES[0], duration: 40 };
  assert.deepEqual(normalizeDuration('', wash), { value: 29, invalid: false });
  assert.deepEqual(normalizeDuration('99', wash), { value: 45, invalid: true });
  assert.deepEqual(normalizeDuration('1', wash), { value: 19, invalid: true });
  assert.equal(normalizeDuration('abc', wash).invalid, true);
});
test('progress advances in order, excludes disabled stages and counts keep warm separately', () => {
  const steps = cycleSteps('auto', null);
  assert.equal(cycleProgress(steps, 0).remaining, 93 * 60);
  assert.deepEqual(cycleProgress(steps, 29 * 60).statuses.map(s => s.status), ['completed', 'active', 'pending', 'pending']);
  assert.equal(cycleProgress(steps, 93 * 60).complete, false);
  assert.equal(cycleProgress(steps, 93 * 60).totalRemaining, 72 * 3600);
  assert.equal(cycleProgress(steps, 93 * 60 + 72 * 3600).complete, true);
  assert.deepEqual(cycleProgress(cycleSteps('self-clean', null), 0).statuses.map(s => s.status), ['active', 'off', 'off', 'off']);
});
test('paused edits lock earlier skipped stages as well as current and completed stages', () => {
  const steps = DEFAULT_CUSTOM_MODES.map((step, index) => ({ ...step, enabled: index > 0 }));
  assert.deepEqual(lockedCycleSteps(steps, 1), { wash: 'off', sterilize: 'active' });
  assert.equal(lockedCycleSteps(steps, 9 * 60).dry, 'active');
  assert.equal(lockedCycleSteps(steps, 9 * 60)['keep-warm'], undefined);
});
