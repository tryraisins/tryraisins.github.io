'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

// A&I-style intro. Enters with a small stagger on load, exits with an
// opacity + upward drift as you start scrolling.
export default function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <section
      id="top"
      className="relative pt-40 md:pt-56 pb-20 md:pb-28 px-6 md:px-10"
      aria-label="Introduction"
    >
      <motion.div style={{ opacity, y }} className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] tracking-widest uppercase text-ink-500 mb-6 md:mb-10 flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-flame-500" />
          <span>TryRaisins · Portfolio · 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-medium text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-ink-950 max-w-4xl"
        >
          Fullstack web developer making things{' '}
          <span className="italic text-ink-500">for the internet</span>.
        </motion.h1>

        {/* CTAs: primary filled pill + secondary outlined pill. No decorative arrows. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 md:mt-14 flex flex-wrap items-center gap-3"
        >
          <a
            href="mailto:tryraisins@gmail.com"
            className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 hover:bg-flame-500 text-paper-50 px-6 py-3.5 font-display font-medium text-sm md:text-base transition-colors"
          >
            <span>Get in touch</span>
          </a>
          <a
            href="#work"
            className="inline-flex items-center gap-2.5 rounded-full border border-ink-950 hover:bg-ink-950 hover:text-paper-50 text-ink-950 px-6 py-3.5 font-display font-medium text-sm md:text-base transition-colors"
          >
            <span>Read about the work</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
