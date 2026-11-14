// Renders src/components/boot-ball.webp, the still that stands in for the
// paper ball with reduced motion. It is the live ball as it first comes to
// rest at 1440x900 for one fixed seed, cropped to the square
// BootOverlay.astro sizes it to (1.4x the ball's diameter).
// Needs the dev server (the seed hook is dev only) and a real GPU: the ball
// refuses software renderers.
// Usage: node scripts/render-boot-ball.mjs [dev url] [seed]
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:4321/';
const seed = process.argv[3] ?? '7';
const [w, h] = [1440, 900];
const size = 600;

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', args: (process.env.GPU_ARGS ?? '--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist').split(' ') });
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto(`${url}?paper-seed=${seed}&paper-scrub`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__paperBall, null, { timeout: 15000 });
await page.addStyleTag({ content: '#boot-overlay-scrub { display: block !important; animation: none !important; } #boot-overlay-scrub::after { display: none; } .boot-status { display: none; }' });
await page.evaluate(() => window.__paperBall.pose(0));
await page.waitForTimeout(400);

const diameter = (Math.min(w, h) * 0.17 + 40) * 2;
const crop = Math.round(diameter * 1.4);
const png = await page.screenshot({ clip: { x: (w - crop) / 2, y: (h - crop) / 2, width: crop, height: crop } });
const webp = await page.evaluate(async ([src, size]) => {
  const img = new Image();
  img.src = `data:image/png;base64,${src}`;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = c.height = size;
  c.getContext('2d').drawImage(img, 0, 0, size, size);
  return c.toDataURL('image/webp', 0.82).split(',')[1];
}, [png.toString('base64'), size]);
await browser.close();

const out = new URL('../src/components/boot-ball.webp', import.meta.url);
fs.writeFileSync(out, Buffer.from(webp, 'base64'));
console.log(`wrote ${out.pathname} (${Math.round(Buffer.byteLength(webp, 'base64') / 1024)} KB, seed ${seed})`);
