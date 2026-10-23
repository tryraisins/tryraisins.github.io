// The project prints pin to the viewport on wide, tall screens and are turned
// over by scrolling. The script only writes one number per print, `--frame`:
// 0 while the print sits in the middle of the sheet, negative once it has been
// lifted away, positive while it is still waiting below. CSS turns that number
// into transform and opacity. Without this script, with reduced motion, on a
// short window or on a phone, the desk stays a static grid or swipe rail.

const STEP = .62; // scroll distance per print, as a share of the stage height
const FAR = 1.2; // prints past their neighbours park here and are not painted
const HOLD = .18; // share of each step a print rests in the middle
const WIDE = '(min-width: 901px) and (min-height: 621px) and (min-width: 56.3125em) and (min-height: 38.8125em)';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const settle = (t) => {
  const s = clamp((t - HOLD) / (1 - HOLD * 2), 0, 1);
  return s * s * (3 - 2 * s);
};
// Document offset without transforms, so the reveal nudge never skews it.
const pageTop = (element) => {
  let top = 0;
  for (let node = element; node instanceof HTMLElement; node = node.offsetParent) top += node.offsetTop;
  return top;
};

export function mountReel(root, announce = () => {}) {
  const reel = root.querySelector('[data-reel]');
  const stage = reel?.querySelector('[data-reel-stage]');
  const grid = stage?.querySelector('[data-play-grid]');
  const section = reel?.closest('section');
  if (!(reel instanceof HTMLElement && stage instanceof HTMLElement && grid instanceof HTMLElement && section)) return () => {};

  const tiles = [...grid.querySelectorAll('[data-play-tile]')];
  const buttons = [...root.querySelectorAll('[data-reel-index] button')];
  const toggle = root.querySelector('[data-reel-toggle]');
  const count = tiles.length;
  const wide = window.matchMedia(WIDE);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const frames = tiles.map(() => '');

  let pinned = false;
  let spread = false;
  let dirty = true;
  let frame = 0;
  let active = -1;
  let step = 0;
  let travel = 0;
  let trackTop = 0;
  let lastTail = '';

  const measure = () => {
    const next = Math.round(stage.offsetHeight * STEP);
    if (next !== step) {
      step = next;
      reel.style.setProperty('--reel-step', `${step}px`);
    }
    travel = step * (count - 1);
    trackTop = pageTop(reel);
  };

  const target = (index) => trackTop + travel * (index / (count - 1));

  const setActive = (index) => {
    if (index === active) return;
    active = index;
    reel.dataset.reelActive = String(index);
    tiles.forEach((tile, i) => tile.toggleAttribute('data-reel-current', i === index));
    buttons.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  };

  const render = () => {
    const raw = travel > 0 ? clamp((window.scrollY - trackTop) / travel, 0, 1) : 0;
    const position = raw * (count - 1);
    const base = Math.min(Math.floor(position), count - 2);
    const eased = base + settle(position - base);
    tiles.forEach((tile, i) => {
      const offset = clamp(i - eased, -FAR, FAR);
      // Parked prints get the exact limit so the CSS style query can hide them.
      const value = Math.abs(offset) >= FAR ? String(Math.sign(offset) * FAR) : offset.toFixed(3);
      if (frames[i] === value) return;
      frames[i] = value;
      tile.style.setProperty('--frame', value);
    });
    setActive(clamp(Math.round(eased), 0, count - 1));
    // Only write when the rounded value changes: a scroll of a few pixels
    // should not invalidate style on every frame.
    const progress = raw.toFixed(3);
    if (reel.dataset.reelProgress !== progress) reel.dataset.reelProgress = progress;
    const tail = clamp((position - (count - 1.5)) / .5, 0, 1).toFixed(3);
    if (lastTail !== tail) {
      lastTail = tail;
      stage.style.setProperty('--reel-tail', tail);
    }
  };

  const update = () => {
    frame = 0;
    if (!pinned) return;
    if (dirty) {
      dirty = false;
      measure();
    }
    render();
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const remeasure = () => {
    dirty = true;
    schedule();
  };

  const jump = (index, behavior) => {
    // `behavior: 'instant'` throws on older Safari, and 'auto' would inherit
    // `scroll-behavior: smooth` from the root, so turn smooth off for the jump.
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    if (behavior !== 'smooth') html.style.scrollBehavior = 'auto';
    window.scrollTo({ top: target(index), behavior: behavior === 'smooth' ? 'smooth' : 'auto' });
    if (behavior !== 'smooth') {
      html.style.scrollBehavior = previous;
      render();
    }
  };

  const apply = () => {
    const capable = count > 1 && wide.matches && !reduced.matches;
    if (toggle instanceof HTMLButtonElement) {
      toggle.hidden = !capable;
      toggle.textContent = spread ? 'Stack them up' : 'Spread them out';
    }
    const next = capable && !spread;
    if (next === pinned) return;
    pinned = next;
    if (pinned) {
      section.dataset.reelMode = 'pinned';
      measure();
      dirty = false;
      render();
      return;
    }
    section.removeAttribute('data-reel-mode');
    tiles.forEach((tile, i) => {
      tile.style.removeProperty('--frame');
      tile.removeAttribute('data-reel-current');
      frames[i] = '';
    });
    buttons.forEach((button) => button.removeAttribute('aria-current'));
    stage.style.removeProperty('--reel-tail');
    reel.style.removeProperty('--reel-step');
    delete reel.dataset.reelActive;
    delete reel.dataset.reelProgress;
    active = -1;
    step = 0;
  };

  const onScroll = () => {
    if (pinned) schedule();
  };
  const onFocus = (event) => {
    if (!pinned) return;
    const tile = event.target instanceof Element ? event.target.closest('[data-play-tile]') : null;
    const index = tiles.indexOf(tile);
    // Tabbing must never land on a print that is still turned away.
    if (index >= 0 && Math.abs(window.scrollY - target(index)) > 2) jump(index, 'auto');
  };
  const onToggle = () => {
    if (!(toggle instanceof HTMLButtonElement)) return;
    if (pinned) {
      // Keep the button where it was on screen, so the grid opens right below it.
      const before = toggle.getBoundingClientRect().top;
      spread = true;
      apply();
      const html = document.documentElement;
      const previous = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollBy({ top: toggle.getBoundingClientRect().top - before, behavior: 'auto' });
      html.style.scrollBehavior = previous;
      announce('The prints are spread out as a grid.');
      return;
    }
    const middle = window.innerHeight / 2;
    let nearest = 0;
    let distance = Infinity;
    tiles.forEach((tile, i) => {
      const box = tile.getBoundingClientRect();
      const gap = Math.abs(box.top + box.height / 2 - middle);
      if (gap < distance) {
        distance = gap;
        nearest = i;
      }
    });
    spread = false;
    apply();
    if (pinned) jump(nearest, 'auto');
    announce('The prints are stacked again. Scroll to turn through them.');
  };
  const buttonHandlers = buttons.map((button, index) => {
    const handler = () => { if (pinned) jump(index, 'smooth'); };
    button.addEventListener('click', handler);
    return handler;
  });

  const resizeObserver = new ResizeObserver(remeasure);
  resizeObserver.observe(root);
  resizeObserver.observe(stage);
  window.addEventListener('scroll', onScroll, { passive: true });
  grid.addEventListener('focusin', onFocus);
  toggle?.addEventListener('click', onToggle);
  wide.addEventListener('change', apply);
  reduced.addEventListener('change', apply);
  apply();

  return () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    window.removeEventListener('scroll', onScroll);
    grid.removeEventListener('focusin', onFocus);
    toggle?.removeEventListener('click', onToggle);
    wide.removeEventListener('change', apply);
    reduced.removeEventListener('change', apply);
    buttons.forEach((button, index) => button.removeEventListener('click', buttonHandlers[index]));
  };
}
