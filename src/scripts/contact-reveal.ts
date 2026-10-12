import { copyText } from './copy-text';

// Mirrors the KELSMADEIT contact reveal: the address is stored masked in the
// HTML, decoded only after a trusted click, and cleared again on close.
function decode(value: string) {
  const bytes = Uint8Array.from(atob(value), (byte) => byte.charCodeAt(0));
  const decoded = bytes.slice(16).map((byte, index) => byte ^ bytes[index % 16]);
  const destination = new TextDecoder().decode(decoded);
  if (new URL(destination).protocol !== 'mailto:') throw new Error('Invalid contact destination');
  return destination;
}

export function initContactReveal(root: HTMLElement, announce: (message: string) => void) {
  const toggle = root.querySelector<HTMLButtonElement>('[data-contact-toggle]');
  const options = root.querySelector<HTMLElement>('[data-contact-options]');
  const link = options?.querySelector<HTMLAnchorElement>('[data-contact-destination]');
  const label = options?.querySelector<HTMLElement>('[data-contact-address]');
  const copy = options?.querySelector<HTMLButtonElement>('[data-contact-copy]');
  if (!toggle || !options || !link || !label || !copy) return () => {};

  const fallbackLabel = label.textContent || 'Email me';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let open = false;
  let revision = 0;
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  const clearDestination = () => {
    clearTimeout(resetTimer);
    link.setAttribute('href', '#play-contact');
  };
  const address = () => decode(link.dataset.contactDestination || '');

  const activate = (event: MouseEvent) => {
    // Script-generated clicks do not materialize the address. Browser
    // automation can still produce trusted input; this is not a bot boundary.
    if (!event.isTrusted || !open) { event.preventDefault(); return; }
    try {
      link.href = address();
      clearTimeout(resetTimer);
      // Keep native navigation, middle clicks and Copy link working.
      resetTimer = setTimeout(clearDestination, event.type === 'contextmenu' ? 15_000 : 0);
    } catch {
      event.preventDefault();
      clearDestination();
    }
  };
  link.addEventListener('click', activate);
  link.addEventListener('auxclick', activate);
  link.addEventListener('contextmenu', activate);
  link.addEventListener('blur', clearDestination);

  copy.addEventListener('click', async (event) => {
    if (!event.isTrusted || !open) return;
    const copyLabel = copy.querySelector('[data-copy-label]');
    let text = '';
    try { text = address().slice('mailto:'.length); } catch { return; }
    const copied = await copyText(text);
    if (copyLabel) copyLabel.textContent = copied ? 'Copied' : 'Select it above';
    announce(copied ? 'The email address has been copied.' : 'Copying was blocked, so the email address is selected for you to copy.');
    if (!copied) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(label);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { if (copyLabel) copyLabel.textContent = 'Copy address'; }, 2400);
  });

  const setOpen = (nextOpen: boolean, animate: boolean, trusted = false) => {
    const currentRevision = ++revision;
    const wasOpen = open;
    open = nextOpen;
    options.dataset.animate = String(animate && !reducedMotion.matches);
    toggle.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-contact-open', open);
    options.inert = !open;
    options.setAttribute('aria-hidden', String(!open));

    if (open) {
      if (trusted) {
        try { label.textContent = address().slice('mailto:'.length); } catch { label.textContent = fallbackLabel; }
      }
      if (options.hidden) {
        options.dataset.open = 'false';
        options.hidden = false;
        // Commit the starting state before transitioning to the visible state.
        void options.offsetHeight;
      }
      options.dataset.open = 'true';
      announce('Email options are showing.');
      return;
    }

    options.dataset.open = 'false';
    clearDestination();
    if (wasOpen) toggle.focus({ preventScroll: true });
    const finish = () => {
      if (open || revision !== currentRevision) return;
      options.hidden = true;
      label.textContent = fallbackLabel;
    };
    if (!animate || reducedMotion.matches) { finish(); return; }
    // Retargetable CSS transitions reverse from the current frame. Keep the row
    // painted, but inert, until every exit completes; reopening invalidates this.
    const exits = options.getAnimations({ subtree: true });
    if (!exits.length) { finish(); return; }
    void Promise.allSettled(exits.map((animation) => animation.finished)).then(finish);
  };

  const onToggle = (event: MouseEvent) => setOpen(!open, event.detail > 0, event.isTrusted);
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open) setOpen(false, false);
  };
  const onMotion = () => setOpen(open, false, true);
  const onHidden = () => { if (document.hidden) clearDestination(); };
  toggle.addEventListener('click', onToggle);
  document.addEventListener('keydown', onKey);
  reducedMotion.addEventListener('change', onMotion);
  window.addEventListener('pagehide', clearDestination);
  document.addEventListener('visibilitychange', onHidden);

  return () => {
    toggle.removeEventListener('click', onToggle);
    document.removeEventListener('keydown', onKey);
    reducedMotion.removeEventListener('change', onMotion);
    window.removeEventListener('pagehide', clearDestination);
    document.removeEventListener('visibilitychange', onHidden);
  };
}
