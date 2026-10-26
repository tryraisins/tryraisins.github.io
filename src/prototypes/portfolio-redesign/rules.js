// Handwriting sits on the blue rules. The paper repeats a 36px tile whose ink
// line starts 35px down, and every written line is 36px tall, so one nudge per
// block puts all of its lines on the rules. The nudge uses the `translate`
// property, which never moves anything else on the page, and measurements read
// layout positions (offsetTop), so running it again is harmless.
//
// Without this script the text keeps its natural position, a few pixels off.

const RULE = 36;
const INK = 35;
const WRITTEN = [
  '.play-hero-index',
  '.play-hero-links a',
  '.play-hero-kicker',
  '.play-hero h1 > span',
  '.play-intro p',
  '.play-eyebrow',
  '.play-desk h2',
  '.play-rail-hint',
  '.play-copy-meta',
  '.play-copy strong',
  '.play-copy p',
  '.play-project-footer',
  '.play-footer p',
  '.play-footer a',
].join(', ');

const pageTop = (element) => {
  let top = 0;
  for (let node = element; node instanceof HTMLElement; node = node.offsetParent) top += node.offsetTop;
  return top;
};

// The rendered baseline of a text node's first line, in viewport pixels. A
// zero-size inline-block sits exactly on the baseline. The text is wrapped
// with it for a moment, so the probe shares its line even when the parent is a
// flex container, then unwrapped.
const baselineOf = (text) => {
  const wrap = document.createElement('span');
  const probe = document.createElement('span');
  probe.style.cssText = 'display:inline-block;width:0;height:0';
  text.before(wrap);
  wrap.append(probe, text);
  const y = probe.getBoundingClientRect().top;
  wrap.replaceWith(text);
  return y;
};

// The first written text in a block, preferring its own text over a nested
// badge (the circled project number has its own box and baseline).
const firstText = (element) => {
  const own = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (own) return own;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (node.textContent.trim() && !node.parentElement.closest('[aria-hidden="true"]') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });
  return walker.nextNode();
};

export function mountRules(root) {
  const blocks = [...root.querySelectorAll(WRITTEN)];
  const section = root.querySelector('[data-reel]')?.closest('section');
  const stage = root.querySelector('[data-reel-stage]');
  let frame = 0;

  const align = () => {
    frame = 0;
    // While the desk is pinned, its stage is a separate sheet that paints its
    // own rules from its own top edge.
    const pinned = section?.dataset.reelMode === 'pinned';
    const moves = blocks.map((block) => {
      if (!block.offsetHeight) return null;
      const text = firstText(block);
      if (!text) return null;
      const box = block.getBoundingClientRect();
      // Rail prints are scaled while they swipe; measure in unscaled pixels.
      const scale = box.height / block.offsetHeight || 1;
      const baseline = (baselineOf(text) - box.top) / scale;
      const paper = pinned && stage?.contains(block) ? stage : root;
      const y = pageTop(block) - pageTop(paper) + baseline;
      let shift = (((INK - y) % RULE) + RULE) % RULE;
      if (shift > RULE / 2) shift -= RULE;
      return `0 ${shift.toFixed(2)}px`;
    });
    // The nudges are applied after every block is measured; `translate` does
    // not change layout, so measuring one block never moves another.
    blocks.forEach((block, i) => {
      if (moves[i] !== null) block.style.translate = moves[i];
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(align);
  };

  const resize = new ResizeObserver(schedule);
  resize.observe(root);
  if (stage) resize.observe(stage);
  const mode = new MutationObserver(schedule);
  if (section) mode.observe(section, { attributes: true, attributeFilter: ['data-reel-mode'] });
  document.fonts?.ready.then(schedule);
  document.fonts?.addEventListener?.('loadingdone', schedule);
  schedule();

  return () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    mode.disconnect();
    document.fonts?.removeEventListener?.('loadingdone', schedule);
    blocks.forEach((block) => block.style.removeProperty('translate'));
  };
}
