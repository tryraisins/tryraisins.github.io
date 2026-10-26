// Below 901px the projects are a native scroll-snap rail. This adds the parts a
// carousel needs on top of it: a visible "3 of 7" position, previous and next
// buttons, arrow keys, and a single tab stop on the print in view. Swiping is
// left entirely to the browser. Without this script the rail still scrolls and
// snaps, and every card stays reachable with Tab.

const NARROW = '(max-width: 900px)';

export function mountRail(root, announce = () => {}) {
  const grid = root.querySelector('[data-play-grid]');
  const controls = root.querySelector('[data-rail-controls]');
  const prev = controls?.querySelector('[data-rail-prev]');
  const next = controls?.querySelector('[data-rail-next]');
  const counter = controls?.querySelector('[data-rail-count]');
  if (!(grid instanceof HTMLElement && controls instanceof HTMLElement && prev instanceof HTMLButtonElement && next instanceof HTMLButtonElement && counter)) return () => {};

  const tiles = [...grid.querySelectorAll('[data-play-tile]')];
  const cards = tiles.map((tile) => tile.querySelector('a, .play-card'));
  const count = tiles.length;
  const narrow = window.matchMedia(NARROW);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let on = false;
  let current = -1;
  let frame = 0;
  // While a button or key is scrolling the rail, the counter already shows the
  // destination; passing prints must not flick it back.
  let steer = -1;
  let steerTimer = 0;

  // The print whose centre is closest to the rail's centre is the current one.
  const nearest = () => {
    const middle = grid.scrollLeft + grid.clientWidth / 2;
    let best = 0;
    let gap = Infinity;
    tiles.forEach((tile, i) => {
      const distance = Math.abs(tile.offsetLeft + tile.offsetWidth / 2 - middle);
      if (distance < gap) {
        gap = distance;
        best = i;
      }
    });
    return best;
  };

  const setCurrent = (index) => {
    if (index === current) return;
    current = index;
    grid.dataset.railCurrent = String(index);
    counter.textContent = `${index + 1} of ${count}`;
    prev.disabled = index === 0;
    next.disabled = index === count - 1;
    // One tab stop: the print in view. The others are still read in order by a
    // screen reader, and the buttons and arrow keys move between them.
    cards.forEach((card, i) => {
      if (!(card instanceof HTMLAnchorElement)) return;
      if (i === index) card.removeAttribute('tabindex');
      else card.setAttribute('tabindex', '-1');
    });
  };

  const go = (index, focus = false) => {
    const target = Math.max(0, Math.min(count - 1, index));
    const tile = tiles[target];
    const left = tile.offsetLeft - (grid.clientWidth - tile.offsetWidth) / 2;
    grid.scrollTo({ left, behavior: reduced.matches ? 'auto' : 'smooth' });
    steer = target;
    clearTimeout(steerTimer);
    steerTimer = setTimeout(() => { steer = -1; }, 700);
    setCurrent(target);
    const card = cards[target];
    if (focus && card instanceof HTMLElement && card.matches('a')) card.focus({ preventScroll: true });
    announce(`Project ${target + 1} of ${count}: ${tile.querySelector('strong')?.textContent ?? ''}`);
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      const index = nearest();
      if (steer >= 0) {
        if (index !== steer) return;
        steer = -1;
      }
      setCurrent(index);
    });
  };
  const onPrev = () => go(current - 1);
  const onNext = () => go(current + 1);
  const onKey = (event) => {
    const keys = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: count - 1 };
    if (!(event.key in keys) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    go(keys[event.key], true);
  };

  const apply = () => {
    // reel.js owns the desk on wide screens; this only runs on the rail.
    const wanted = narrow.matches;
    if (wanted === on) return;
    on = wanted;
    controls.hidden = !on;
    if (on) {
      current = -1;
      setCurrent(nearest());
      grid.addEventListener('scroll', onScroll, { passive: true });
      grid.addEventListener('keydown', onKey);
      return;
    }
    grid.removeEventListener('scroll', onScroll);
    grid.removeEventListener('keydown', onKey);
    cards.forEach((card) => card instanceof HTMLElement && card.removeAttribute('tabindex'));
    delete grid.dataset.railCurrent;
    current = -1;
  };

  prev.addEventListener('click', onPrev);
  next.addEventListener('click', onNext);
  narrow.addEventListener('change', apply);
  apply();

  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(steerTimer);
    narrow.removeEventListener('change', apply);
    prev.removeEventListener('click', onPrev);
    next.removeEventListener('click', onNext);
    grid.removeEventListener('scroll', onScroll);
    grid.removeEventListener('keydown', onKey);
    cards.forEach((card) => card instanceof HTMLElement && card.removeAttribute('tabindex'));
  };
}
