import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.APP_URL ?? 'http://127.0.0.1:5185/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install({ time: new Date('2026-11-19T08:00:00Z') });
  await page.goto(`${base}#/app`);
  await page.locator('[data-model=bw05s]').waitFor();
  const seed = async updates => {
    await page.evaluate(updates => {
      for (const [id, patch] of Object.entries(updates)) {
        const key = `BW05S_app_v1:${id === 'bw05s' ? 'machine' : `models:${id}:machine`}`;
        const state = JSON.parse(localStorage.getItem(key));
        localStorage.setItem(key, JSON.stringify({ ...state, selectedMode: 'auto', cycleActive: true, isRunning: true, elapsedSeconds: 0, runStartedAt: Date.now(), ...patch }));
      }
    }, updates);
    await page.reload();
    await page.locator('[data-model=bw05s]').waitFor();
  };
  const status = id => page.locator(`[data-model=${id}] .device-status`);
  await seed({ bw05s: {}, bw05p: { isRunning: false, runStartedAt: null }, bw05a: { cycleActive: false, scheduleAt: Date.parse('2026-11-19T09:00:00Z') } });
  assert.match(await status('bw05s').innerText(), /93 min left/);
  assert.doesNotMatch(await status('bw05s').innerText(), /In Progress/);
  assert.match(await status('bw05p').innerText(), /Paused/);
  assert.match(await status('bw05a').innerText(), /Scheduled/);
  await page.clock.runFor(61000);
  assert.match(await status('bw05s').innerText(), /92 min left/);
  await mkdir('tests/artifacts/device-status', { recursive: true });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(await page.locator('.device-meta').evaluateAll(nodes => nodes.every(node => node.scrollWidth <= node.clientWidth)));
    await page.screenshot({ path: `tests/artifacts/device-status/running-${width}.png` });
  }
  await seed({ bw05s: { elapsedSeconds: 93 * 60 + 60 } });
  assert.match(await status('bw05s').innerText(), /保管中/);
  assert.match(await status('bw05s').innerText(), /72 h left/);
  assert.doesNotMatch(await status('bw05s').innerText(), /标准洗/);
  await seed({ bw05s: { elapsedSeconds: (93 + 72 * 60 - 59) * 60 } });
  assert.match(await status('bw05s').innerText(), /保管中/);
  assert.match(await status('bw05s').innerText(), /59 min left/);
  assert.doesNotMatch(await status('bw05s').innerText(), /标准洗/);
  await seed({ bw05s: { elapsedSeconds: (93 + 72 * 60) * 60, isRunning: false, runStartedAt: null } });
  assert.match(await status('bw05s').innerText(), /Done/);
  assert.doesNotMatch(await status('bw05s').innerText(), /0 min/);
  assert.deepEqual(errors, []);
  console.log('PASS: running remaining time excludes storage, updates on list, keeps paused/scheduled/done states, switches to storage remaining and fits 320/390px.');
} finally { await browser.close(); }
