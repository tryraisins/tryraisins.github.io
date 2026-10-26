// Drives the first-visit loading sheet from BootOverlay.astro. The inline
// bootstrap in that component decides whether the sheet shows at all by setting
// <html data-boot="pending">; this module decides when it lifts.
const STORAGE_KEY = 'tryraisins:boot';

// Milliseconds. `max` and `min` are measured from the moment the sheet first
// painted (the bootstrap's timestamp), not from when this module happened to run.
// `hold` is the beat between starting the sheet's lift and the transform moving:
// the hero entrance starts at the same moment, so it rises behind a sheet that
// still covers the page instead of appearing after the page has been uncovered.
const TIMING = { fontsCap: 1400, min: 700, max: 1600, hold: 200, lift: 620 };
const REDUCED_TIMING = { fontsCap: 1400, min: 200, max: 800, hold: 0, lift: 150 };

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Settles when the work settles, or after `cap`, whichever comes first.
// A rejection counts as settled: a missing font must never hold the page.
const settleWithin = (work: Promise<unknown>, cap: number) =>
  Promise.race([work.then(() => {}, () => {}), wait(cap)]);

const domReady = () =>
  document.readyState === 'loading'
    ? new Promise<void>((resolve) => document.addEventListener('DOMContentLoaded', () => resolve(), { once: true }))
    : Promise.resolve();

async function boot(): Promise<void> {
  const root = document.documentElement;
  // Repeat visit, a hash link, or no script: nothing to wait for, and the sheet
  // should not linger in the DOM.
  if (root.dataset.boot !== 'pending') {
    document.getElementById('boot-overlay')?.remove();
    return;
  }

  const timing = matchMedia('(prefers-reduced-motion: reduce)').matches ? REDUCED_TIMING : TIMING;
  const shownAt = Number(root.dataset.bootT0) || 0;
  const visibleFor = () => performance.now() - shownAt;

  // Only the faces visible on the first screen gate the sheet. The mono and
  // marker faces live in the desk and prints below the fold, so waiting on them
  // held the sheet for up to a second longer than the page needed.
  const firstScreenFaces = () => {
    // Both pages are handwritten in Caveat (one variable file covers every
    // weight); only the skills pages also open on printed DM Sans.
    const faces = ['700 1em "Caveat"'];
    if (!document.querySelector('.play-hero')) faces.push('400 1em "DM Sans"');
    return faces;
  };

  const fontsReady = () =>
    document.fonts
      ? Promise.all(firstScreenFaces().map((face) => document.fonts.load(face)))
      : Promise.resolve();

  // Fonts are the only asset the sheet waits on: they decide whether the page
  // beneath swaps its type the moment it is uncovered. Covers have their own
  // decode fade and must never hold the sheet.
  const ready = Promise.all([
    settleWithin(fontsReady(), timing.fontsCap),
    domReady(),
  ]);
  await Promise.race([ready, wait(Math.max(0, timing.max - visibleFor()))]);
  await wait(Math.max(0, timing.min - visibleFor()));

  // The failsafe in the bootstrap may have already dismissed the sheet.
  if (root.dataset.boot !== 'pending') return;

  root.dataset.boot = 'revealing';
  document.dispatchEvent(new CustomEvent('boot:reveal'));
  setTimeout(() => {
    root.dataset.boot = 'done';
    delete root.dataset.bootT0;
    document.getElementById('boot-overlay')?.remove();
    document.dispatchEvent(new CustomEvent('boot:done'));
    try { sessionStorage.setItem(STORAGE_KEY, 'seen'); } catch { /* private mode */ }
  }, timing.hold + timing.lift);
}

let booted: Promise<void> | undefined;

// Idempotent: every importer shares one run. Resolves when the sheet starts to
// lift (or immediately when there is no sheet), not when it has finished leaving.
export function initBootOverlay(): Promise<void> {
  booted ??= boot();
  return booted;
}

export function whenBootRevealed(callback: () => void): void {
  // A rejected boot must still let the page enter; the inline failsafes cover
  // the sheet itself.
  void initBootOverlay().then(callback, callback);
}

// Fires once the sheet has finished lifting and left the DOM, or immediately
// when this load has no sheet. Heavy decorative work (doodles, three.js) belongs
// here: mounting it during the lift blocks the first frame of the entrance while
// the sheet keeps moving on the compositor, which leaves a blank page behind it.
export function whenBootDone(callback: () => void): void {
  const root = document.documentElement;
  const boot = root.dataset.boot;
  if (boot !== 'pending' && boot !== 'revealing') {
    callback();
    return;
  }
  document.addEventListener('boot:done', () => callback(), { once: true });
}
