// Writing sits on the blue rules. The paper repeats a 36px tile whose ink line
// starts 35px down, and every written line is 36px tall (or a multiple), so one
// nudge per block puts all of its lines on the rules. The nudge uses the
// `translate` property, which never moves anything else on the page, and
// positions are read from layout (offsetTop), so running it again is harmless.
//
// Without this script the text keeps its natural position, a few pixels off.

const RULE = 36;
const INK = 35;

interface Options {
  /** Blocks of text written directly on the ruled paper. */
  selector: string;
  /** The element whose background paints the rules behind a block. */
  paperFor: (block: HTMLElement) => HTMLElement;
  /** Attribute changes that swap which paper a block sits on. */
  watch?: { target: Element; attributes: string[] }[];
}

const pageTop = (element: HTMLElement) => {
  let top = 0;
  for (let node: Element | null = element; node instanceof HTMLElement; node = node.offsetParent) top += node.offsetTop;
  return top;
};

// The rendered baseline of a text node's first line, in viewport pixels. A
// zero-size inline-block sits exactly on the baseline. The text is wrapped
// with it for a moment, so the probe shares its line even when the parent is a
// flex container, then unwrapped.
const baselineOf = (text: Text) => {
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
// badge (a circled number has its own box and baseline).
const firstText = (element: HTMLElement): Text | null => {
  const own = [...element.childNodes].find((node): node is Text => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim());
  if (own) return own;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (node.textContent?.trim() && !node.parentElement?.closest('[aria-hidden="true"]') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });
  return walker.nextNode() as Text | null;
};

// Text inside a sticky element (other than the paper itself) slides over the
// rules as the page scrolls, so it cannot stay on them and is left alone.
const ridesOver = (block: HTMLElement, paper: HTMLElement) => {
  for (let node = block.parentElement; node && node !== paper; node = node.parentElement) {
    if (getComputedStyle(node).position === 'sticky') return true;
  }
  return false;
};

export function mountRules(root: HTMLElement, { selector, paperFor, watch = [] }: Options): () => void {
  let frame = 0;

  const align = () => {
    frame = 0;
    // Queried each time: the skills library adds and hides entries as it filters.
    const blocks = [...root.querySelectorAll<HTMLElement>(selector)];
    const moves = blocks.map((block) => {
      if (!block.offsetHeight) return null;
      const paper = paperFor(block);
      if (ridesOver(block, paper)) return '';
      const text = firstText(block);
      if (!text) return null;
      const box = block.getBoundingClientRect();
      // Carousel prints are scaled while they swipe; measure in unscaled pixels.
      const scale = box.height / block.offsetHeight || 1;
      const baseline = (baselineOf(text) - box.top) / scale;
      const y = pageTop(block) - pageTop(paper) + baseline;
      let shift = (((INK - y) % RULE) + RULE) % RULE;
      if (shift > RULE / 2) shift -= RULE;
      return `0 ${shift.toFixed(2)}px`;
    });
    // The nudges are applied after every block is measured; `translate` does
    // not change layout, so measuring one block never moves another.
    blocks.forEach((block, i) => {
      const move = moves[i];
      if (move === '') block.style.removeProperty('translate');
      else if (move !== null) block.style.translate = move;
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(align);
  };

  const resize = new ResizeObserver(schedule);
  resize.observe(root);
  const mutations = new MutationObserver(schedule);
  watch.forEach(({ target, attributes }) => mutations.observe(target, { attributes: true, attributeFilter: attributes }));
  document.fonts?.ready.then(schedule);
  document.fonts?.addEventListener?.('loadingdone', schedule);
  schedule();

  return () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    mutations.disconnect();
    document.fonts?.removeEventListener?.('loadingdone', schedule);
    root.querySelectorAll<HTMLElement>(selector).forEach((block) => block.style.removeProperty('translate'));
  };
}
