'use client';

import { useEffect, useRef } from 'react';

// A single very-soft radial gradient that follows the cursor with easing.
// Sits above the particle canvas but below content — the atmosphere shifts
// with attention. Absent on touch devices (where it just costs battery).
export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const step = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      dot.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    raf = requestAnimationFrame(step);
    window.addEventListener('pointermove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed z-[1] pointer-events-none w-[600px] h-[600px] rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(255,107,74,0.08) 0%, rgba(255,107,74,0.03) 30%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
}
