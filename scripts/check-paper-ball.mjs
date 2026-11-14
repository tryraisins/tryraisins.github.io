// End-to-end check of the page-load paper ball, on the real GPU.
// Usage: node scripts/check-paper-ball.mjs [dev url] [outDir]
//
// 1. Scrub: loads ?paper-seed&paper-scrub (dev server only), steps the sheet
//    through being balled up, its wait and every stage of the opening, checks
//    the first frame is the flat sheet the overlay starts on, and writes a contact
//    sheet plus the flat frame's rule alignment against the page.
// 2. Live: a normal load, timing the frames while the ball waits and opens,
//    and checking that paper:flat fires and the overlay leaves.
// 3. Fallbacks: reduced motion and a software renderer must both skip the
//    ball and still hand over the page.
// Writes report.json, contact.png and the frames to outDir.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] ?? 'http://localhost:4321/';
const out = process.argv[3] ?? 'output/playwright/paper-ball';
const seed = process.env.SEED ?? '7';
const [w, h] = (process.env.SIZE ?? '1440x900').split('x').map(Number);
const gpuArgs = (process.env.GPU_ARGS ?? '--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist').split(' ');
fs.mkdirSync(path.join(out, 'frames'), { recursive: true });

const report = { url, seed, size: `${w}x${h}`, checks: {} };
const pass = (name, ok, detail) => {
  report.checks[name] = { ok, ...detail };
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`, JSON.stringify(detail));
};

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', args: gpuArgs });

// 1. Scrub through the stages.
{
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`${url}?paper-seed=${seed}&paper-scrub`);
  const ok = await page.waitForFunction(() => window.__paperBall, null, { timeout: 5000 }).then(() => true, () => false);
  const renderer = await page.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'unknown';
  });
  pass('scrub hook ready', ok, { renderer, errors });
  if (ok) {
    // In scrub mode the overlay is renamed out of boot-overlay.ts's reach;
    // keep it shown whatever state the boot reaches meanwhile.
    await page.addStyleTag({ content: '#boot-overlay-scrub { display: block !important; animation: none !important; }' });
    // Let the still finish fading under the live ball.
    await page.waitForTimeout(300);
    const crumple = await page.evaluate(() => window.__paperBall.crumple);
    const frames = [
      ...[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((k) => [`crumple ${Math.round(k * crumple)}ms`, -1, Math.round(k * crumple)]),
      ['idle 0s', 0], ['idle 0.6s', 0.6], ['idle 1.2s', 1.2],
      ...[0, 80, 150, 230, 320, 420, 540, 660, 780, 900, 1020, 1140, 1260, 1380, 1500, 1600].map((ms) => [`${ms}ms`, 1.2, ms]),
    ];
    const shots = [];
    let missing = 0;
    for (const [label, idle, ms] of frames) {
      const shown = await page.evaluate(([i, m]) => {
        if (i < 0) window.__paperBall.crumpling(m);
        else window.__paperBall.pose(i, m ?? undefined);
        const c = document.querySelector('#boot-overlay-scrub .boot-ball');
        return !!c && getComputedStyle(c.parentElement).display !== 'none';
      }, [idle, ms ?? null]);
      if (!shown) missing++;
      const file = path.join(out, 'frames', `${String(shots.length).padStart(2, '0')}-${label.replace(/\W+/g, '')}.png`);
      await page.screenshot({ path: file });
      shots.push({ label, data: fs.readFileSync(file).toString('base64') });
    }
    pass('every scrub frame shows the paper', missing === 0, { frames: frames.length, missing });
    fs.copyFileSync(path.join(out, 'frames', '08-idle0s.png'), path.join(out, 'ball.png'));

    // Rules on the flat frame against the rules on the page: rows that are
    // clearly blue, sampled down a column clear of the hero.
    const flatShot = shots.at(-1).data;
    await page.evaluate(() => document.getElementById('boot-overlay-scrub')?.remove());
    await page.waitForTimeout(100);
    const pageShot = (await page.screenshot()).toString('base64');
    const rules = await page.evaluate(async ([a, b, w]) => {
      const rows = async (src) => {
        const img = new Image();
        img.src = `data:image/png;base64,${src}`;
        await img.decode();
        const c = new OffscreenCanvas(img.width, img.height);
        const x = c.getContext('2d');
        x.drawImage(img, 0, 0);
        const col = Math.round(w * 0.97);
        const d = x.getImageData(col - 4, 0, 8, img.height).data;
        const found = [];
        for (let y = 0; y < img.height; y++) {
          let blue = 0;
          for (let i = 0; i < 8; i++) {
            const k = (y * 8 + i) * 4;
            blue += d[k + 2] - d[k];
          }
          if (blue / 8 > 18 && !(found.length && y - found.at(-1) < 4)) found.push(y);
        }
        return found;
      };
      return { flat: await rows(a), page: await rows(b) };
    }, [flatShot, pageShot, w]);
    const offsets = rules.page.map((y) => Math.min(...rules.flat.map((f) => Math.abs(f - y))));
    const worst = Math.max(...offsets);
    pass('flat frame rules line up with the page', rules.page.length > 5 && worst <= 3, { pageRules: rules.page.length, flatRules: rules.flat.length, worstOffsetPx: worst });

    // The crumple's first frame against the sheet the overlay paints before
    // WebGL is ready: the canvas must take over from it without a jump.
    await page.goto(`${url}?paper-seed=${seed}&paper-scrub`);
    await page.waitForFunction(() => window.__paperBall, null, { timeout: 5000 });
    await page.addStyleTag({ content: '#boot-overlay-scrub { display: block !important; animation: none !important; } #boot-overlay-scrub::after { animation: none !important; } .boot-ball { visibility: hidden; }' });
    await page.waitForTimeout(100);
    const cssShot = (await page.screenshot()).toString('base64');
    const start = await page.evaluate(async ([a, b, w]) => {
      const load = async (src) => {
        const img = new Image();
        img.src = `data:image/png;base64,${src}`;
        await img.decode();
        const c = new OffscreenCanvas(img.width, img.height);
        const x = c.getContext('2d');
        x.drawImage(img, 0, 0);
        return x.getImageData(0, 0, img.width, img.height);
      };
      const [gl, css] = [await load(a), await load(b)];
      let sum = 0, far = 0;
      for (let i = 0; i < gl.data.length; i += 4) {
        const d = Math.max(Math.abs(gl.data[i] - css.data[i]), Math.abs(gl.data[i + 1] - css.data[i + 1]), Math.abs(gl.data[i + 2] - css.data[i + 2]));
        sum += d;
        if (d > 40) far++;
      }
      const px = gl.data.length / 4;
      return { meanDiff: +(sum / px).toFixed(2), farPixelsPct: +((100 * far) / px).toFixed(3) };
    }, [shots[0].data, cssShot, w]);
    // The 1.5px margin lines are antialiased differently by the two, which
    // on a phone is about half a percent of the screen; a margin in the
    // wrong place would be three times that, and misplaced rules far more.
    pass('crumple starts on the overlay\'s flat sheet', start.meanDiff < 4 && start.farPixelsPct < 1, start);

    // Contact sheet, four across.
    const sheet = await page.evaluate(async (list) => {
      const first = new Image();
      first.src = `data:image/png;base64,${list[0].data}`;
      await first.decode();
      const cols = first.width > first.height ? 4 : 7, pad = 26;
      const tw = first.width > first.height ? 480 : 240, th = Math.round((tw * first.height) / first.width);
      const c = document.createElement('canvas');
      c.width = cols * tw;
      c.height = Math.ceil(list.length / cols) * (th + pad);
      const x = c.getContext('2d');
      x.fillStyle = '#222';
      x.fillRect(0, 0, c.width, c.height);
      for (let i = 0; i < list.length; i++) {
        const img = new Image();
        img.src = `data:image/png;base64,${list[i].data}`;
        await img.decode();
        const cx = (i % cols) * tw, cy = Math.floor(i / cols) * (th + pad);
        x.drawImage(img, cx, cy + pad, tw, th);
        x.fillStyle = '#fff';
        x.font = '16px sans-serif';
        x.fillText(list[i].label, cx + 8, cy + 18);
      }
      return c.toDataURL('image/png').split(',')[1];
    }, shots);
    fs.writeFileSync(path.join(out, 'contact.png'), Buffer.from(sheet, 'base64'));
  }
  await page.close();
}

// 2. A normal load: frame gaps, paper:flat and the overlay leaving.
{
  const warm = await browser.newPage();
  await warm.evaluate(() => document.createElement('canvas').getContext('webgl2')?.clear(0));
  await warm.close();
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.addInitScript(() => {
    const s = (window.__paperLog = { gaps: { ball: [], opening: [] }, marks: {} });
    document.addEventListener('paper:flat', () => { s.marks.flat ??= Math.round(performance.now()); });
    document.addEventListener('boot:reveal', () => { s.marks.reveal ??= Math.round(performance.now()); });
    document.addEventListener('boot:done', () => { s.marks.done ??= Math.round(performance.now()); });
    let last = 0;
    const tick = (now) => {
      const paper = document.getElementById('boot-overlay')?.dataset.paper;
      if (paper) s.marks[paper] ??= Math.round(now);
      if (last && paper === 'ball') s.gaps[s.marks.reveal ? 'opening' : 'ball'].push(now - last);
      last = now;
      if (!s.marks.done) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto(url);
  const finished = await page.waitForFunction(() => window.__paperLog.marks.done, null, { timeout: 12000 }).then(() => true, () => false);
  const log = await page.evaluate(() => window.__paperLog);
  const overlayGone = await page.evaluate(() => !document.getElementById('boot-overlay'));
  const stat = (g) => {
    const s = [...g].sort((a, b) => a - b);
    return { frames: s.length, median: +(s[s.length >> 1] ?? 0).toFixed(1), p95: +(s[Math.floor(s.length * 0.95)] ?? 0).toFixed(1), worst: +(s.at(-1) ?? 0).toFixed(1) };
  };
  const opening = stat(log.gaps.opening);
  const flatAfter = log.marks.flat - log.marks.reveal;
  // The ball must have been made before it opens: the crumple and its rest.
  const ballFor = log.marks.reveal - log.marks.ball;
  pass('live load opens and hands over the page', finished && overlayGone && !!log.marks.ball && ballFor >= 900 && flatAfter >= 1500 && flatAfter < 2400 && errors.length === 0, {
    marks: log.marks, ballToRevealMs: ballFor, revealToFlatMs: flatAfter, waiting: stat(log.gaps.ball), opening, errors,
  });
  pass('opening holds frame rate', opening.median <= 20 && opening.p95 <= 34, opening);
  await page.close();
}

// 3. Fallbacks: no ball is drawn, and the page still arrives.
const fallback = async (name, ctx, extraBrowser) => {
  const page = await ctx.newPage({ viewport: { width: w, height: h } });
  try {
    // A software-rendered Chrome can take over 20s to load the dev server's
    // unbundled page on a slow machine, long before the overlay is involved.
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const done = await page.waitForFunction(() => document.documentElement.dataset.boot === 'done', null, { timeout: 30000 }).then(() => true, () => false);
    const canvas = await page.evaluate(() => !!document.querySelector('.boot-ball'));
    pass(name, done && !canvas, { bootDone: done, canvasMounted: canvas });
  } catch (e) {
    pass(name, false, { error: String(e).split('\n')[0] });
  }
  await page.close();
  if (extraBrowser) await extraBrowser.close();
};
const reduced = await browser.newContext({ reducedMotion: 'reduce' });
await fallback('reduced motion uses the still', reduced);
const soft = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
await fallback('software renderer uses the still', soft, soft);

await browser.close();
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
const failed = Object.entries(report.checks).filter(([, c]) => !c.ok).map(([n]) => n);
console.log(failed.length ? `FAILED: ${failed.join(', ')}` : 'all checks passed', `→ ${out}`);
process.exitCode = failed.length ? 1 : 0;
