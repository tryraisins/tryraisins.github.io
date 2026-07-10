'use client';

import { motion } from 'framer-motion';

const NAME = 'TRYRAISINS'.split('');

function FlipLetter({ char, i }: { char: string; i: number }) {
  return (
    <motion.span
      whileHover={{ rotateY: 180 }}
      transition={{ duration: 0.55, ease: [0.7, 0, 0.15, 1] }}
      style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}
      data-cursor="text"
    >
      {char}
    </motion.span>
  );
}

// Rotating circular text badge — small always-on motion source.
// Text is laid out around a circle; the wrapper rotates continuously.
function RotatingBadge() {
  const text = ' PORTFOLIO · 2026 · TRYRAISINS ·  ';
  const chars = text.split('');
  const radius = 78;
  const step = 360 / chars.length;

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      className="relative w-[180px] h-[180px]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-bold text-2xl text-flame-500">✱</span>
      </div>
      {chars.map((c, i) => {
        const angle = i * step - 90;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        return (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 font-mono text-[11px] tracking-[0.2em] font-medium text-ink-200"
            style={{
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
            }}
          >
            {c}
          </span>
        );
      })}
    </motion.div>
  );
}

// Reveals each word behind a mask on mount.
function WordReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline">
          <motion.span
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.07 }}
            className="inline-block"
          >
            {w}
            {i < words.length - 1 && <>&nbsp;</>}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 md:px-10 pt-24 pb-24"
      aria-label="Introduction"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Rotating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-12"
        >
          <RotatingBadge />
        </motion.div>

        {/* Giant name — Y oscillation keeps it alive after load */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.5 }}
          className="font-display font-bold leading-[0.9] tracking-[-0.05em] text-ink-50 w-full"
          style={{ perspective: '1400px' }}
        >
          <motion.span
            className="block text-[16vw] md:text-[13vw]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {NAME.map((c, i) => (
              <FlipLetter key={i} char={c} i={i} />
            ))}
            <span className="text-flame-500">.</span>
          </motion.span>
        </motion.h1>

        {/* Tagline — word-by-word mask reveal */}
        <p className="mt-10 md:mt-14 font-display text-2xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-ink-100 max-w-4xl">
          <WordReveal text="I make things for the" delay={2.0} />{' '}
          <span className="inline-block overflow-hidden align-baseline">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 2.35 }}
              className="inline-block italic text-flame-500"
            >
              web.
            </motion.span>
          </span>
        </p>

        {/* CTA row — direct email + secondary "see the work" — visible without scrolling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          <a
            href="mailto:tryraisins@gmail.com"
            data-cursor="link"
            data-cursor-label="EMAIL"
            className="group inline-flex items-center gap-3 rounded-full bg-flame-500 hover:bg-flame-400 text-ink-950 pl-6 pr-5 py-4 font-display font-semibold text-base md:text-lg transition-colors"
          >
            <span>Email me</span>
            <span aria-hidden="true" className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#work"
            data-cursor="link"
            data-cursor-label="WORK"
            className="group inline-flex items-center gap-3 rounded-full border border-ink-50/20 hover:border-flame-500 text-ink-100 hover:text-flame-500 px-6 py-4 font-display font-semibold text-base md:text-lg transition-colors"
          >
            <span>See the work</span>
            <span aria-hidden="true" className="text-xl transition-transform duration-300 group-hover:translate-y-1">↓</span>
          </a>
        </motion.div>

        {/* Direct email line — also readable copy for someone who wants to save the address */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3.0 }}
          className="mt-6 font-mono text-[11px] tracking-widest uppercase text-ink-300"
        >
          Or copy&nbsp;·&nbsp;
          <a
            href="mailto:tryraisins@gmail.com"
            data-cursor="link"
            data-cursor-label="COPY"
            className="text-ink-100 hover:text-flame-500 transition-colors"
          >
            tryraisins@gmail.com
          </a>
        </motion.p>
      </div>
    </section>
  );
}
