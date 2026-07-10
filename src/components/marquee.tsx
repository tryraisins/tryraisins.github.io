'use client';

import { motion, useMotionValue, useScroll, useVelocity, useSpring, useAnimationFrame, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { wrap } from '@/lib/wrap';

const ITEMS = [
  'Fullstack',
  'React',
  'TypeScript',
  'Node',
  'Python',
  'Next.js',
  'Lagos ·',
  '2026',
];

// Marquee that reacts to scroll: direction flips with scroll direction and
// speed scales with scroll velocity. Constant baseline drift so it moves
// even when idle.
export default function Marquee() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const [directionFactor, setDirectionFactor] = useState(1);

  useAnimationFrame((_, delta) => {
    // Baseline: 60 px/s to the left. Velocity boosts it; sign of scroll dir flips.
    let moveBy = directionFactor * 60 * (delta / 1000);
    const v = velocityFactor.get();
    if (v < 0) setDirectionFactor(-1);
    else if (v > 0) setDirectionFactor(1);
    moveBy += directionFactor * moveBy * Math.abs(v);
    baseX.set(baseX.get() + moveBy);
  });

  // The visible list is duplicated so we can wrap seamlessly.
  // Range: -20% moves left by one full repeated block; wrap keeps it in range.
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  return (
    <section aria-hidden="true" className="relative py-6 md:py-10 border-y border-ink-50/10 overflow-hidden">
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {[...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS].map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 md:gap-10 mr-6 md:mr-10 font-display font-bold text-4xl md:text-7xl lg:text-8xl leading-none tracking-[-0.03em]"
          >
            <span className={i % 2 === 0 ? 'text-ink-50' : 'text-flame-500 italic'}>{t}</span>
            <span className="text-ink-300 text-3xl md:text-6xl lg:text-7xl">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
