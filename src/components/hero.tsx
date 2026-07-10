'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Split a phrase into word-level mask-reveal spans with staggered delays.
function KineticPhrase({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="mask-reveal align-baseline">
          <span style={{ animationDelay: `${delay + i * 90}ms` }}>{w}</span>
          {i < words.length - 1 && <>&nbsp;</>}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Parallax: name drifts up slower than scroll, subtitle stays put, cue fades
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-10"
      aria-label="Introduction"
    >
      {/* Corner registration marks — pure atmosphere, telegraphs "designed" */}
      <div className="absolute top-24 left-6 md:left-10 font-mono text-[10px] tracking-widest uppercase text-bone-300/60">
        <div className="flex items-center gap-3">
          <span className="w-6 h-px bg-bone-300/40" />
          <span>SW / 01</span>
        </div>
      </div>
      <div className="absolute top-24 right-6 md:right-10 font-mono text-[10px] tracking-widest uppercase text-bone-300/60 text-right">
        <div>LAGOS · NG</div>
        <div className="text-coral-500 mt-1">◆ AVAILABLE FOR WORK</div>
      </div>

      <motion.div
        style={{ y: nameY, opacity: nameOpacity }}
        className="relative z-10 text-center"
      >
        <div className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-bone-300 mb-6 md:mb-10">
          <KineticPhrase text="Portfolio · 2026" />
        </div>

        <h1 className="font-serif font-normal leading-[0.88] tracking-[-0.02em]">
          <span className="block text-6xl md:text-8xl lg:text-[9.5rem] text-bone-50">
            <KineticPhrase text="Seun" delay={200} />
          </span>
          <span className="block text-6xl md:text-8xl lg:text-[9.5rem] italic text-bone-100">
            <KineticPhrase text="Sowemimo." delay={340} />
          </span>
        </h1>

        <div className="mt-10 md:mt-14 flex items-center justify-center gap-6 md:gap-10">
          <span className="hidden md:block w-16 h-px bg-bone-300/40" />
          <p className="font-mono text-xs md:text-sm tracking-widest uppercase text-bone-300">
            <KineticPhrase text="Fullstack Web Developer" delay={720} />
          </p>
          <span className="hidden md:block w-16 h-px bg-bone-300/40" />
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-bone-300">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-bone-300/40 to-transparent overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 w-full h-4 bg-coral-500"
            animate={{ y: [0, 64, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
