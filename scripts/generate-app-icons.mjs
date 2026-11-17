import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

const image = await readFile(new URL('../client/src/assets/device-bw05s.png', import.meta.url));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  for (const [file, size] of [['app-icon-192.png', 192], ['app-icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
    const png = await page.evaluate(async ({ source, size }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${source}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#edf3fa'; ctx.fillRect(0, 0, size, size);
      ctx.drawImage(image, 0, size * .2, size, size * .5625);
      ctx.fillStyle = '#244e7c'; ctx.font = `600 ${size * .09}px system-ui`;
      ctx.textAlign = 'center'; ctx.fillText('BW05S', size / 2, size * .83);
      return canvas.toDataURL('image/png').split(',')[1];
    }, { source: image.toString('base64'), size });
    await writeFile(new URL(`../client/public/${file}`, import.meta.url), Buffer.from(png, 'base64'));
  }
} finally { await browser.close(); }
