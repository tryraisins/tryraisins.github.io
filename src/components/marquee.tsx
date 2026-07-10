'use client';

import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { wrap } from '@/lib/wrap';

const ITEMS = [
  'Fullstack',
  'React',
  'TypeScript',
  'Node',
  'Python',
  'Next.js',
  'Shipping',
  '2026',
];

// Calm marquee: constant slow leftward drift. No velocity boost, no
// direction flips — those read as jitter, not personality.
export default function Marquee() {
  const baseX = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    // 18 px/s baseline — slow enough to actually read the words as they pass
    baseX.set(baseX.get() - 18 * (delta / 1000));
  });

  // Wrap keeps translateX bounded so the duplicated ribbon appears seamless
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  return (
    <section
      aria-hidden="true"
      className="relative py-6 md:py-10 border-y border-ink-50/10 overflow-hidden"
    >
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
