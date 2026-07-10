'use client';

import { motion } from 'framer-motion';

const LINE_1 = 'TRY'.split('');
const LINE_2 = 'RAISINS'.split('');

function FlipLetter({ char, i }: { char: string; i: number }) {
  return (
    <motion.span
      whileHover={{ rotateY: 180 }}
      transition={{ duration: 0.7, ease: [0.7, 0, 0.15, 1], delay: i * 0.04 }}
      style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}
      data-cursor="text"
    >
      {char}
    </motion.span>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100dvh] flex flex-col justify-between px-5 md:px-10 pt-24 pb-16"
      aria-label="Introduction"
    >
      {/* Top corner: availability chip only — no location, no timezone */}
      <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-ink-300">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-flame-500 animate-pulse" />
          <span>Available for freelance · 2026</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span>Currently: shipping BetPicks v2</span>
        </div>
      </div>

      {/* Hero mass */}
      <div className="flex-1 flex flex-col justify-center py-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-lg md:text-2xl text-ink-200"
          data-cursor="text"
        >
          Hey — I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.5 }}
          className="mt-2 md:mt-4 font-display font-bold leading-[0.85] tracking-[-0.05em] text-ink-50"
          style={{ perspective: '1200px' }}
        >
          <span className="block text-[22vw] md:text-[16vw]">
            {LINE_1.map((c, i) => (
              <FlipLetter key={i} char={c} i={i} />
            ))}
          </span>
          <span className="block text-[22vw] md:text-[16vw]">
            {LINE_2.map((c, i) => (
              <FlipLetter key={i} char={c} i={i + LINE_1.length} />
            ))}
            <span className="text-flame-500">.</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-8 font-display text-2xl md:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em] text-ink-100 max-w-4xl"
          data-cursor="text"
        >
          I build <span className="italic text-flame-500">web apps</span> people actually
          use. Fullstack. 5+ years. Ready when you are<span className="caret" />
        </motion.p>
      </div>

      {/* Bottom row: scroll cue + stack */}
      <div className="flex items-end justify-between gap-6">
        <motion.a
          href="#work"
          data-cursor="link"
          data-cursor-label="SCROLL"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="group flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-ink-200 hover:text-flame-500 transition-colors"
        >
          <span>Scroll to see the work</span>
          <span className="inline-block w-8 h-px bg-current group-hover:w-14 transition-all duration-500" />
        </motion.a>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="hidden md:flex items-center gap-4 font-mono text-[10px] tracking-widest uppercase text-ink-300"
        >
          <span>React</span>
          <span className="text-ink-400">·</span>
          <span>TypeScript</span>
          <span className="text-ink-400">·</span>
          <span>Node</span>
          <span className="text-ink-400">·</span>
          <span>Python</span>
        </motion.div>
      </div>
    </section>
  );
}
