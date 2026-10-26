// Drives the moving doodles through real collisions on the home page. Each
// scenario pins the two hero drawings with ?doodles=, samples every figure's
// state, mode, effect and position, and checks the agreed outcome.
// Usage: node scripts/check-doodle-world.mjs [base-url] [scenario...]
// Writes output/doodles/<scenario>.json and a few screenshots per scenario.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4321/';
const only = process.argv.slice(3);
const out = new URL('../output/doodles/', import.meta.url);
await mkdir(out, { recursive: true });

// Every state change on a hero figure, caught by a MutationObserver so short
// states such as the gap after a drawing leaves are never missed by sampling.
const stateSeen = (events, index, state, before = Infinity) => events.some((e) => e.index === index && e.state === state && e.ms < before);
const fxSeen = (timeline, sketch, fx) => timeline.some((frame) => frame.figures.some((f) => f.sketch === sketch && f.fx === fx));
const maxShift = (timeline, sketch) => Math.max(0, ...timeline.flatMap((frame) => frame.figures.filter((f) => f.sketch === sketch && f.cycle === 0).map((f) => Math.hypot(f.tx, f.ty))));

const scenarios = [
  { name: 'rhino-ko-on-house', pins: 'rhino,house', seconds: 18,
    check: (t) => [['rhino knocked out', fxSeen(t, 'rhino', 'ko')], ['house stays put (shake only)', maxShift(t, 'house') < 6]] },
  { name: 'rhino-spills-coffee', pins: 'rhino,coffee', seconds: 24,
    check: (t) => [['coffee spills', fxSeen(t, 'coffee', 'spill')], ['rhino runs off and a new turn starts',
      stateSeen(t.events, 0, 'gone') && t.some((frame) => frame.figures[0].cycle > 0)]] },
  { name: 'rocket-leaves-top', pins: 'rocket,tree', seconds: 16,
    check: (t) => [['rocket flies up', t.some((frame) => frame.figures[0].sketch === 'rocket' && frame.figures[0].ty < -150)],
      ['turn ends early once it is gone', stateSeen(t.events, 0, 'gone', 15000)]] },
  { name: 'cat-bats-fish', pins: 'cat,fish', seconds: 22,
    check: (t) => [['fish batted away', fxSeen(t, 'fish', 'flung')]] },
  { name: 'robot-carries-flower', pins: 'robot,flower', seconds: 22,
    check: (t) => [['robot picks the flower up', fxSeen(t, 'flower', 'carried') && fxSeen(t, 'robot', 'carrying')]] },
  { name: 'planet-captures-fish', pins: 'fish,planet', seconds: 28,
    check: (t) => [['fish captured into orbit', fxSeen(t, 'fish', 'orbiting')], ['then flung off', t.some((frame) => frame.figures.some((f) => f.sketch === 'fish' && f.mode === 'flung'))]] },
  { name: 'whale-slaps-tree', pins: 'tree,whale', seconds: 24,
    check: (t) => [['whale tail-slaps', fxSeen(t, 'whale', 'slap')], ['tree only shakes', maxShift(t, 'tree') < 6]] },
  { name: 'bicycle-tips-on-house', pins: 'bicycle,house', seconds: 20,
    check: (t) => [['bicycle tips over', fxSeen(t, 'bicycle', 'tipped')]] },
  { name: 'reduced-motion', pins: 'rhino,house', seconds: 12, reducedMotion: 'reduce',
    check: (t) => [['nothing moves', t.every((frame) => frame.figures.every((f) => f.tx === 0 && f.ty === 0))]] },
  { name: 'hidden-tab-resumes', pins: 'rhino,house', seconds: 16, hideAt: 6000, hideFor: 4000,
    check: (t) => {
      // The hide window is recorded in the page's own clock.
      const { from, to } = t.hide ?? {};
      const at = (ms) => t.find((frame) => frame.ms >= ms)?.figures[0];
      const start = at(from + 250), end = t.filter((frame) => frame.ms <= to - 50).pop()?.figures[0], later = at(to + 2500);
      const frozen = Boolean(start && end) && start.cycle === end.cycle && start.state === end.state && Math.hypot(end.tx - start.tx, end.ty - start.ty) < 2;
      const resumed = Boolean(end && later) && (later.state !== end.state || later.fx !== end.fx || Math.hypot(later.tx - end.tx, later.ty - end.ty) > 10);
      return [['turn is frozen while hidden', frozen], ['and picks up again afterwards', resumed]];
    } },
  // Phone width and the other two sections. Slots are pinned in page order:
  // 0-1 hero, 2-4 work desk, 5-6 contact. These check that drawings travel,
  // meet something or leave, and that every new sketch starts inside its section.
  { name: 'phone-hero-rhino', pins: 'rhino,house', seconds: 22, phone: true, check: (t) => roams(t, 'rhino') },
  { name: 'phone-hero-rocket', pins: 'rocket,tree', seconds: 16, phone: true,
    check: (t) => [['rocket leaves early', stateSeen(t.events, 0, 'gone', 15000)], ...roams(t, 'rocket')] },
  { name: 'phone-contact-rhino', pins: ',,,,,rhino,coffee', seconds: 24, phone: true, layer: 'contact', check: (t) => roams(t, 'rhino') },
  { name: 'desk-rhino', pins: ',,rhino,coffee,house', seconds: 24, layer: 'desk', check: (t) => roams(t, 'rhino') },
  { name: 'desk-bicycle', pins: ',,house,bicycle,flower', seconds: 24, layer: 'desk', check: (t) => roams(t, 'bicycle') },
  { name: 'contact-rhino', pins: ',,,,,rhino,coffee', seconds: 24, layer: 'contact', check: (t) => roams(t, 'rhino') },
];

function roams(t, mover) {
  const moved = Math.max(0, ...t.flatMap((frame) => frame.figures.filter((f) => f.sketch === mover).map((f) => Math.hypot(f.tx, f.ty))));
  const outcome = [...new Set(t.flatMap((frame) => frame.figures.map((f) => f.fx && `${f.sketch}:${f.fx}`)).filter(Boolean))];
  const left = t.events.some((e) => e.state === 'gone');
  const restarts = t.flatMap((frame) => frame.figures.filter((f) => f.cycle > 0 && f.state === 'drawing'));
  return [
    [`${mover} travels (${Math.round(moved)}px)`, moved > 40],
    [`something happens (${outcome.join(', ') || (left ? 'left the section' : 'nothing')})`, outcome.length > 0 || left],
    [`new sketches start inside the section (${restarts.length} samples)`, restarts.every((f) => f.inside)],
  ];
}

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let failures = 0;
for (const scenario of scenarios.filter((s) => !only.length || only.includes(s.name))) {
  const layer = `.play-doodle-layer-${scenario.layer ?? 'hero'}`;
  const page = await browser.newPage({
    viewport: scenario.phone ? { width: 390, height: 844 } : { width: 1366, height: 820 },
    isMobile: Boolean(scenario.phone), hasTouch: Boolean(scenario.phone),
    reducedMotion: scenario.reducedMotion ?? 'no-preference',
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(new URL(`?doodles=${scenario.pins}`, base).href, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.play-doodle-layer-hero [data-doodle][data-doodle-state]', { timeout: 20000 });
  // Only drawings on screen are drawn, so scroll the section under test into view.
  if (scenario.layer) {
    await page.evaluate((selector) => document.querySelector(selector).closest('section').scrollIntoView({ block: 'start' }), layer);
    await page.waitForSelector(`${layer} [data-doodle][data-doodle-state]`, { timeout: 20000 });
  }
  // Sampling runs inside the page: round trips from here take seconds while
  // the three.js tops render in software, which would miss whole collisions.
  await page.evaluate((selector) => {
    const started = performance.now();
    window.__doodleStart = started;
    window.__doodleLog = [];
    window.__doodleEvents = [];
    const layer = document.querySelector(selector);
    const figures = [...layer.querySelectorAll('[data-doodle]')];
    new MutationObserver((records) => records.forEach((record) => {
      window.__doodleEvents.push({ ms: Math.round(performance.now() - started), index: figures.indexOf(record.target), state: record.target.dataset.doodleState });
    })).observe(layer, { subtree: true, attributeFilter: ['data-doodle-state'] });
    setInterval(() => {
      const ms = Math.round(performance.now() - started);
      const bounds = layer.getBoundingClientRect();
      window.__doodleLog.push({ ms, figures: figures.map((node) => {
        const [tx = 0, ty = 0] = (node.style.translate || '0px 0px').split(' ').map((part) => parseFloat(part) || 0);
        const box = node.getBoundingClientRect(), cx = box.left + box.width / 2, cy = box.top + box.height / 2;
        return { ms, sketch: node.dataset.doodleSketch, state: node.dataset.doodleState, cycle: Number(node.dataset.doodleCycle || 0),
          mode: node.dataset.doodleMode || 'idle', fx: node.dataset.doodleFx || '', tx, ty, rotate: node.style.rotate || '',
          inside: cx >= bounds.left && cx <= bounds.right && cy >= bounds.top && cy <= bounds.bottom };
      }) });
    }, 100);
  }, layer);
  const started = Date.now();
  let shot = 0;
  while (Date.now() - started < scenario.seconds * 1000) {
    const ms = Date.now() - started;
    if (scenario.hideAt && ms >= scenario.hideAt && !scenario.hidden) {
      scenario.hidden = true;
      await page.evaluate(() => { window.__hide = { from: performance.now() - window.__doodleStart }; Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
      await page.waitForTimeout(scenario.hideFor);
      await page.evaluate(() => { window.__hide.to = performance.now() - window.__doodleStart; delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    }
    if (ms >= shot * 4000) {
      await page.screenshot({ path: fileURLToPath(new URL(`${scenario.name}-${String(shot).padStart(2, '0')}.png`, out)) });
      shot += 1;
    }
    await page.waitForTimeout(250);
  }
  const recorded = await page.evaluate(() => ({ log: window.__doodleLog, events: window.__doodleEvents, hide: window.__hide }));
  const timeline = Object.assign(recorded.log, { events: recorded.events, hide: recorded.hide });
  const results = [...scenario.check(timeline), ['no page errors', errors.length === 0]];
  const passed = results.every(([, ok]) => ok);
  if (!passed) failures += 1;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${scenario.name}`);
  results.forEach(([label, ok]) => console.log(`  ${ok ? 'ok ' : 'NO '} ${label}`));
  if (errors.length) console.log('  errors:', errors);
  await writeFile(new URL(`${scenario.name}.json`, out), JSON.stringify({ scenario: scenario.name, pins: scenario.pins, results, errors, hide: timeline.hide, events: timeline.events, timeline }, null, 1));
  await page.close();
}
await browser.close();
console.log(failures ? `${failures} scenario(s) failed` : 'all scenarios passed');
process.exit(failures ? 1 : 0);
