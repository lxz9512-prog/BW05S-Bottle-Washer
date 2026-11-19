import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.APP_URL ?? 'http://127.0.0.1:5185/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const models = ['bw05s', 'bw05p', 'bw05a'];
  for (const experience of ['demo', 'app']) {
    const screen = page.locator(experience === 'app' ? '[data-app-screen]' : '[data-device-screen]');
    const names = Object.fromEntries(models.map(id => [id, id.toUpperCase()]));
    for (const model of models) {
      await page.goto(`${base}#/${experience}/cleaning-machine/models/${model}/home`);
      await screen.locator('.bw-header h1').waitFor();
      assert.equal(await screen.locator('.bw-header h1').innerText(), names[model]);
      await screen.getByRole('button', { name: '设备设置', exact: true }).click();
      assert.equal(await screen.locator('.bw-device-info').innerText(), names[model]);
      await screen.locator('.bw-device-info').click();
      await screen.getByRole('button', { name: /设备名称/ }).click();
      const name = `${experience === 'app' ? '移动' : '桌面'}${model.toUpperCase()}奶瓶清洗机`;
      names[model] = name;
      await screen.getByRole('textbox').fill(name);
      await screen.getByRole('button', { name: '保存设备名称', exact: true }).click();
      await screen.getByRole('textbox').waitFor({ state: 'hidden' });
      await screen.getByRole('button', { name: '返回', exact: true }).click();
      assert.equal(await screen.locator('.bw-device-info').innerText(), name);
      await screen.getByRole('button', { name: '返回', exact: true }).click();
      assert.equal(await screen.locator('.bw-header h1').innerText(), name);
      await screen.locator('[data-mode=auto] .bw-mode-open').click();
      await screen.getByRole('button', { name: '开始清洗', exact: true }).click();
      await screen.locator('.bw-progress').waitFor();
      assert.equal(await screen.locator('.bw-header h1').innerText(), name);
      await screen.getByRole('button', { name: '返回', exact: true }).click();
      await screen.locator('[data-model=bw05s]').waitFor();
      for (const id of models) assert.equal(await screen.locator(`[data-model=${id}] .device-title`).innerText(), names[id]);
      await page.reload();
      await screen.locator(`[data-model=${model}]`).click();
      await screen.locator('.bw-header h1').waitFor();
      if (experience === 'app') await screen.locator('.bw-progress').waitFor();
      assert.equal(await screen.locator('.bw-header h1').innerText(), name);
    }
  }
  await page.goto(`${base}#/app/cleaning-machine/models/bw05p/device-info`);
  await page.getByRole('button', { name: /设备名称/ }).click();
  await page.getByRole('textbox').fill('ABCDEFGHIJKLMNOPQRST');
  await page.getByRole('button', { name: '保存设备名称', exact: true }).click();
  await page.getByRole('textbox').waitFor({ state: 'hidden' });
  await page.goto(`${base}#/app/cleaning-machine/models/bw05p/home`);
  await page.locator('.bw-header h1').waitFor();
  await page.setViewportSize({ width: 320, height: 844 });
  assert.equal(await page.locator('.bw-header h1').innerText(), 'ABCDEFGHIJKLMNOPQRST');
  assert.ok(await page.locator('.bw-header h1').evaluate(node => node.scrollWidth <= node.clientWidth && node.getBoundingClientRect().height <= node.closest('header').clientHeight));
  await page.goto(`${base}#/demo/cleaning-machine/models/bw05p/home`);
  await page.locator('.bw-header h1').waitFor();
  assert.equal(await page.locator('.bw-header h1').innerText(), '桌面BW05P奶瓶清洗机');
  assert.deepEqual(errors, []);
  console.log('PASS: settings rename follows selection, running, settings entry and device list; refresh, three-model and experience isolation; long names fit 320px.');
} finally { await browser.close(); }
