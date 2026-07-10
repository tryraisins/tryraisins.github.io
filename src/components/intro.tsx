'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const NAME = 'SEUN'.split('');

// Full-screen title card that plays once per session. Freezes body scroll
// while playing so no accidental scroll skips it.
export default function Intro() {
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip on repeat visits in the same session
    if (sessionStorage.getItem('intro-seen') === '1') {
      setPlaying(false);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPlaying(false);
      sessionStorage.setItem('intro-seen', '1');
      return;
    }

    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      setPlaying(false);
      document.body.style.overflow = '';
      sessionStorage.setItem('intro-seen', '1');
    }, 2000);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.15, 1] }}
          className="fixed inset-0 z-[150] bg-canvas-950 flex items-center justify-center"
        >
          <div className="relative">
            <div className="flex items-baseline gap-[0.02em] font-display font-bold text-[22vw] md:text-[18vw] leading-none tracking-[-0.04em] text-ink-50">
              {NAME.map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.15 + i * 0.11,
                  }}
                  className="inline-block"
                  style={{ willChange: 'transform' }}
                >
                  {c}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + NAME.length * 0.11, duration: 0.3 }}
                className="text-flame-500 ml-[0.05em]"
              >
                .
              </motion.span>
            </div>
            {/* Faint status label below */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-ink-300"
            >
              <span>Sowemimo · Portfolio</span>
              <span className="text-flame-500">Loading · 2026</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
