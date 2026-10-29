// Measures when the page-load sheet starts to unfold versus when the first
// doodle starts drawing.
// Usage: node scripts/check-boot-timing.mjs [url] [screenshot.png]
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4323/';
const shot = process.argv[3];
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1366, height: 820 } });
await page.addInitScript(() => {
  const log = (window.__bootLog = {});
  const t = () => Math.round(performance.now());
  const tick = () => {
    const root = document.documentElement;
    const boot = root?.dataset.boot ?? 'none';
    log['boot:' + boot] ??= t();
    if (document.querySelector('[data-doodle-state="drawing"]')) log.doodleDrawing ??= t();
    if (!(log.doodleDrawing && log['boot:done'])) setTimeout(tick, 10);
  };
  tick();
});
await page.goto(url);
await page.waitForFunction(() => { const l = window.__bootLog; return l.doodleDrawing && l['boot:done']; }, null, { timeout: 20000 })
  .catch(() => console.log('timed out waiting for every milestone'));
const log = await page.evaluate(() => window.__bootLog);
console.log(JSON.stringify(log, null, 2));
const lift = log['boot:revealing'];
if (lift) console.log(`after lift starts: first doodle ${log.doodleDrawing - lift}ms`);
const footer = await page.locator('.play-footer').innerText();
console.log('footer text:', JSON.stringify(footer));
if (shot) await page.screenshot({ path: shot });
await browser.close();
