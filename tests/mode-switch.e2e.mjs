import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.APP_URL ?? 'http://127.0.0.1:5185/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('tests/artifacts/mode-switch', { recursive: true });
try {
  for (const experience of ['app', 'demo']) {
    for (const model of ['bw05s', 'bw05p', 'bw05a']) {
      const context = await browser.newContext({ viewport: experience === 'app' ? { width: 320, height: 568 } : { width: 1512, height: 1100 } });
      const page = await context.newPage();
      page.setDefaultTimeout(60000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}#/${experience}/cleaning-machine/models/${model}/home`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.locator('[data-mode=auto]').waitFor();
      const product = page.locator('.bw-product img');
      assert.equal(await product.count(), 1);
      assert.equal((await product.getAttribute('src')).includes('device-bw05s-gray'), model === 'bw05s', 'only BW05S uses the historical gray artwork');
      await product.evaluate(node => node.complete ? undefined : new Promise(resolve => { node.onload = node.onerror = resolve; }));
      assert.ok(await product.evaluate(node => node.complete && node.naturalWidth > 0), 'product artwork loads');
      const modes = await page.locator('[data-mode]').evaluateAll(nodes => nodes.map(node => node.dataset.mode));
      assert.equal(modes.includes('intensive'), model === 'bw05p');
      await page.locator(`[data-mode=${modes[0]}] .bw-mode-open`).click();
      const dialog = page.getByRole('dialog');
      const selected = () => dialog.locator('.bw-mode-switch').getAttribute('data-mode-id');
      for (const mode of modes) {
        assert.equal(await selected(), mode);
        assert.equal(await dialog.locator('.bw-mode-name').count(), mode === 'custom' ? 1 : 0);
        assert.ok(await dialog.locator('.bw-mode-switch').evaluate(node => node.scrollWidth <= node.clientWidth));
        await dialog.getByRole('button', { name: '下一个模式', exact: true }).click();
      }
      assert.equal(await selected(), modes[0], 'next wraps to first mode');
      await dialog.getByRole('button', { name: '上一个模式', exact: true }).click();
      assert.equal(await selected(), 'custom', 'previous wraps to last mode');
      await dialog.locator('.bw-mode-name').click();
      assert.equal(await dialog.locator('.bw-mode-name').evaluate(node => node === document.activeElement), true);
      assert.equal(await dialog.locator('.bw-mode-name').evaluate(node => getComputedStyle(node).textAlign), 'center');
      assert.equal(await dialog.locator('.bw-mode-name-field > svg').count(), 0);
      await dialog.locator('.bw-mode-name').fill('自定义奶瓶清洗');
      await dialog.locator('.bw-cycle-section').getByRole('checkbox').first().click();
      await dialog.getByRole('textbox', { name: '清洗 时长', exact: true }).fill('33');
      await dialog.getByRole('textbox', { name: '清洗 时长', exact: true }).blur();
      await dialog.getByRole('button', { name: '下一个模式', exact: true }).click();
      await dialog.getByRole('button', { name: '上一个模式', exact: true }).click();
      assert.equal(await dialog.locator('.bw-mode-name').inputValue(), '自定义奶瓶清洗');
      assert.equal(await dialog.getByRole('textbox', { name: '清洗 时长', exact: true }).inputValue(), '33');
      await page.screenshot({ path: `tests/artifacts/mode-switch/${experience}-${model}-custom.png` });
      await dialog.getByRole('button', { name: '收起浮窗', exact: true }).click();
      await dialog.waitFor({ state: 'hidden' });
      await page.getByRole('button', { name: '添加自定义模式', exact: true }).click();
      assert.equal(await selected(), 'custom-2');
      await dialog.locator('.bw-mode-name').fill('第二套');
      await dialog.getByRole('button', { name: '上一个模式', exact: true }).click();
      assert.equal(await dialog.locator('.bw-mode-name').inputValue(), '自定义奶瓶清洗');
      await dialog.getByRole('button', { name: '下一个模式', exact: true }).click();
      assert.equal(await dialog.locator('.bw-mode-name').inputValue(), '第二套');
      await dialog.getByRole('button', { name: '收起浮窗', exact: true }).click();
      await dialog.waitFor({ state: 'hidden' });
      if (model === 'bw05s') {
        await page.locator('[data-mode=baby] .bw-mode-open').click();
        await dialog.locator('.bw-options button').first().click();
        await dialog.getByRole('button', { name: '下一个模式', exact: true }).click();
        assert.equal(await dialog.getByRole('button', { name: '开始清洗', exact: true }).isDisabled(), true, 'switch resets quantity selection');
      } else if (model === 'bw05p') {
        await page.locator('[data-mode=intensive] .bw-mode-open').click();
        assert.equal(await dialog.getByRole('heading').innerText(), '强力洗');
        assert.equal(await dialog.locator('.bw-preset-step').first().isDisabled(), true);
        await page.waitForTimeout(300);
        await page.screenshot({ path: `tests/artifacts/mode-switch/${experience}-${model}-intensive.png` });
        await dialog.getByRole('button', { name: '开始清洗', exact: true }).click();
        await page.locator('.bw-progress').waitFor();
        assert.equal(await page.locator('.bw-run-title').innerText(), '强力洗');
        await page.getByRole('button', { name: '暂停或继续清洗', exact: true }).click();
        await page.getByRole('button', { name: '编辑', exact: true }).click();
        assert.equal(await page.getByRole('dialog').getByRole('checkbox').first().isDisabled(), true);
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  }
  console.log('PASS: P-only intensive wash, all-model PC/mobile arrows, wraparound, custom names/parameters and slots, quantity reset, intensive launch and paused editing.');
} finally { await browser.close(); }
