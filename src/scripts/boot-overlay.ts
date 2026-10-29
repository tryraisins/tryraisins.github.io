// Drives the page-load sheet from BootOverlay.astro. The inline bootstrap in that
// component sets <html data-boot="pending"> on homepage loads; paper-ball.ts
// starts with a crumpled ball, and this module decides when it opens.
//
// Milliseconds. `max` and `min` are measured from the moment the sheet first
// painted (the bootstrap's timestamp), not from when this module happened to run.
// `lift` is how long the reveal takes: for the ball, PAPER_TIMING.unfold in
// paper-ball.ts. The ball's overlay leaves once the paper reports it is flat
// (`paper:flat`) and the overlay's `fade` in BootOverlay.astro has run, or at
// `liftCap` if a slow machine never gets there. `enter` is the beat between
// starting the reveal and releasing the hero entrance, so the hero is writing
// itself in as the flattened sheet fades away. `holdCap` bounds how long work
// registered with holdBoot can keep the sheet up; it stays under the bootstrap
// failsafe in BootOverlay.astro.
const TIMING = { fontsCap: 1400, holdCap: 6000, min: 600, max: 1400, enter: 1000, lift: 1150, liftCap: 2600, fade: 400 };
// Reduced motion, or no WebGL2: the crumpled still fades once.
const FLAT_TIMING = { fontsCap: 1400, holdCap: 6000, min: 200, max: 800, enter: 0, lift: 150, liftCap: 150, fade: 0 };

// Page work the sheet should cover, such as heavy decorative scripts.
const holds: Promise<unknown>[] = [];

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Settles when the work settles, or after `cap`, whichever comes first.
// A rejection counts as settled: a missing font must never hold the page.
const settleWithin = (work: Promise<unknown>, cap: number) =>
  Promise.race([work.then(() => {}, () => {}), wait(cap)]);

// readyState is already 'interactive' while module scripts run, before the
// page's own scripts have registered their holds, so it cannot answer whether
// DOMContentLoaded has fired. This module always evaluates before that event.
let contentLoaded = document.readyState === 'complete';
document.addEventListener('DOMContentLoaded', () => { contentLoaded = true; }, { once: true });
const domReady = () =>
  contentLoaded
    ? Promise.resolve()
    : new Promise<void>((resolve) => document.addEventListener('DOMContentLoaded', () => resolve(), { once: true }));

async function boot(): Promise<void> {
  const root = document.documentElement;
  // No sheet on this load (the bootstrap did not run): nothing to wait for, and
  // the sheet should not linger in the DOM.
  if (root.dataset.boot !== 'pending') {
    document.getElementById('boot-overlay')?.remove();
    return;
  }

  // paper-ball.ts mounts before this runs and marks the overlay "loading"
  // while its shaders compile, then "ball" once it draws.
  const paper = document.getElementById('boot-overlay')?.dataset.paper;
  const ball = paper === 'loading' || paper === 'ball';
  const timing = ball ? TIMING : FLAT_TIMING;
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
  // Module scripts have all run by DOMContentLoaded, so every hold is registered.
  await settleWithin(Promise.all(holds), Math.max(0, timing.holdCap - visibleFor()));
  await wait(Math.max(0, timing.min - visibleFor()));

  // The failsafe in the bootstrap may have already dismissed the sheet.
  if (root.dataset.boot !== 'pending') return;

  // The ball hands back to the still if the machine cannot draw it
  // smoothly, so the reveal reads what is on screen now.
  const unfolding = document.getElementById('boot-overlay')?.dataset.paper === 'ball';
  const reveal = unfolding ? TIMING : FLAT_TIMING;
  const flat = unfolding
    ? new Promise<void>((resolve) => document.addEventListener('paper:flat', () => resolve(), { once: true }))
    : wait(reveal.lift);
  root.dataset.boot = 'revealing';
  document.dispatchEvent(new CustomEvent('boot:reveal'));
  void settleWithin(flat.then(() => wait(reveal.fade)), reveal.liftCap).then(() => {
    root.dataset.boot = 'done';
    delete root.dataset.bootT0;
    document.getElementById('boot-overlay')?.remove();
    document.dispatchEvent(new CustomEvent('boot:done'));
  });
  // The promise whenBootRevealed listens to settles after `enter`, not at once.
  await wait(reveal.enter);
}

// Keeps the sheet up until `work` settles, within TIMING.holdCap. Returns
// whether this load has a sheet at all, so callers can skip the wait otherwise.
export function holdBoot(work: Promise<unknown>): boolean {
  const boot = document.documentElement.dataset.boot;
  if (boot !== 'pending') return false;
  holds.push(work);
  return true;
}

let booted: Promise<void> | undefined;

// Idempotent: every importer shares one run. Resolves `enter` ms after the sheet
// starts to unfold (or immediately when there is no sheet), not when it has
// finished leaving.
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
// when this load has no sheet. Heavy decorative work (the doodles) belongs
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
