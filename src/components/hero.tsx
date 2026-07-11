'use client';

import { motion } from 'framer-motion';

// Small A&I-style intro: brand line, one-sentence positioning, one CTA.
// The work grid does the heavy lifting from here on.
export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-40 md:pt-56 pb-20 md:pb-28 px-6 md:px-10"
      aria-label="Introduction"
    >
      <div className="max-w-[1400px] mx-auto">
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

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 md:mt-14 flex flex-wrap items-center gap-6 md:gap-8"
        >
          <a
            href="#work"
            className="link-draw font-display text-base text-ink-700 hover:text-ink-950 transition-colors"
          >
            See selected work ↓
          </a>
          <span className="hidden md:inline text-ink-300">·</span>
          <a
            href="mailto:tryraisins@gmail.com"
            className="link-draw font-display text-base text-ink-700 hover:text-flame-500 transition-colors"
          >
            tryraisins@gmail.com ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
