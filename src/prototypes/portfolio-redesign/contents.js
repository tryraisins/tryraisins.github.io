// The projects desk is a contents page. On wide screens with a mouse, every
// print shares one spot beside the list and only the item marked
// data-current shows its print. This moves that mark to the entry being
// pointed at or tabbed to, and lets the arrow keys walk the list. The mark
// stays put when the pointer leaves, so the last print looked at stays out.
// Without this script the first print shows and every entry is still a link;
// on narrow or touch screens CSS stacks the items as cards and this is idle.

const CONTENTS = '(min-width: 901px) and (hover: hover) and (pointer: fine)';

export function mountContents(root) {
  const list = root.querySelector('[data-play-grid]');
  if (!(list instanceof HTMLElement)) return () => {};

  const tiles = [...list.querySelectorAll('[data-play-tile]')];
  const entries = tiles.map((tile) => tile.querySelector('.play-entry'));
  const wide = window.matchMedia(CONTENTS);
  let current = tiles.findIndex((tile) => tile.hasAttribute('data-current'));

  const show = (index) => {
    if (index === current || index < 0) return;
    current = index;
    tiles.forEach((tile, i) => tile.toggleAttribute('data-current', i === index));
  };
  const indexOf = (event) => (event.target instanceof Element ? tiles.indexOf(event.target.closest('[data-play-tile]')) : -1);

  // A pointer heading from an entry to its print may cross other entries on
  // the way, so an entry only takes over once the pointer rests on it briefly.
  let pending = 0;
  const onPointer = (event) => {
    if (!wide.matches || event.pointerType !== 'mouse') return;
    clearTimeout(pending);
    // Only the entries and the visible print take pointer events, so this is
    // always the item under the pointer.
    const index = indexOf(event);
    if (!(event.target instanceof Element && event.target.closest('.play-entry'))) return;
    pending = setTimeout(() => show(index), 90);
  };
  const onFocus = (event) => {
    if (event.target instanceof Element && event.target.matches('.play-entry')) show(indexOf(event));
  };
  const onKey = (event) => {
    if (!wide.matches || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const from = entries.indexOf(event.target);
    if (from < 0) return;
    // Suspended projects have no link, so focus skips over them.
    const focusable = entries.map((entry, i) => (entry instanceof HTMLAnchorElement ? i : -1)).filter((i) => i >= 0);
    const at = focusable.indexOf(from);
    const keys = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: focusable.length - 1 };
    if (!(event.key in keys)) return;
    const next = focusable[Math.max(0, Math.min(focusable.length - 1, keys[event.key]))];
    event.preventDefault();
    entries[next]?.focus();
  };

  list.addEventListener('pointerover', onPointer);
  list.addEventListener('focusin', onFocus);
  list.addEventListener('keydown', onKey);

  return () => {
    clearTimeout(pending);
    list.removeEventListener('pointerover', onPointer);
    list.removeEventListener('focusin', onFocus);
    list.removeEventListener('keydown', onKey);
  };
}
