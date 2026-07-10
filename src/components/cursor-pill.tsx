'use client';

import { useEffect, useRef, useState } from 'react';

type Mode = 'default' | 'link' | 'text';

// A chunky follow-cursor that morphs based on what's under it.
// - default: 24px flame-tinted dot
// - link:    120px pill labeled "OPEN →"
// - text:    thin I-beam
// Magnetic pull toward the hovered element's centerpoint.
// Hidden on touch and reduced-motion.
export default function CursorPill() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<Mode>('default');
  const [label, setLabel] = useState('OPEN →');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);

    const dot = dotRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let tx = mx;
    let ty = my;
    let raf = 0;

    const loop = () => {
      // Ease toward the target; a touch of magnetism happens by moving the
      // target itself in the pointerover handler.
      mx += (tx - mx) * 0.22;
      my += (ty - my) * 0.22;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    // Delegated hover — walk up the tree to find a governing element
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const linkable = target.closest('a, button, [data-cursor="link"]') as HTMLElement | null;
      if (linkable) {
        setMode('link');
        const l = linkable.getAttribute('data-cursor-label');
        setLabel(l || (linkable.tagName === 'BUTTON' ? 'TAP' : 'OPEN →'));
        // Slight magnetic pull toward the element's center
        const r = linkable.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // Blend actual pointer with center — the mix here is the pull strength
        tx = tx * 0.7 + cx * 0.3;
        ty = ty * 0.7 + cy * 0.3;
        return;
      }
      const textable = target.closest('p, h1, h2, h3, li, span[data-cursor="text"]') as HTMLElement | null;
      if (textable) {
        setMode('text');
        return;
      }
      setMode('default');
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
    };
  }, []);

  if (!enabled) return null;

  // Solid coral fill; ring outline gives it edge against any background.
  // No mix-blend — that was disappearing over darker patches.
  const isLink = mode === 'link';
  const isText = mode === 'text';

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[120] pointer-events-none flex items-center justify-center"
      style={{
        transition:
          'width 0.35s cubic-bezier(0.7,0,0.15,1), height 0.35s cubic-bezier(0.7,0,0.15,1), background 0.25s, border-radius 0.25s, box-shadow 0.25s',
        willChange: 'transform, width, height',
        width: isLink ? '120px' : isText ? '3px' : '22px',
        height: isLink ? '44px' : isText ? '30px' : '22px',
        borderRadius: isText ? '2px' : '999px',
        background: isLink ? '#ff6b4a' : isText ? '#f5f2eb' : '#f5f2eb',
        color: isLink ? '#0d0c0a' : '#0d0c0a',
        boxShadow: isLink
          ? '0 0 0 1px rgba(245,242,235,0.15)'
          : isText
            ? 'none'
            : '0 0 0 2px rgba(255,107,74,0.55), 0 0 20px rgba(255,107,74,0.25)',
      }}
    >
      {isLink && (
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">{label}</span>
      )}
    </div>
  );
}
