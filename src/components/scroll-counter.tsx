'use client';

import { useEffect, useState } from 'react';

// Bottom-right giant scroll % counter. Design element that doubles as UI.
export default function ScrollCounter() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setPct(Math.round(p * 100));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[80] pointer-events-none select-none"
    >
      <div className="font-display font-bold tabular-nums leading-none text-ink-50/90 text-[64px] md:text-[112px]" style={{ letterSpacing: '-0.05em' }}>
        {String(pct).padStart(3, '0')}
        <span className="text-flame-500">%</span>
      </div>
      <div className="font-mono text-[9px] tracking-widest uppercase text-ink-300 -mt-2">
        Scroll progress
      </div>
    </div>
  );
}
