'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Word-by-word mask-clip reveal driven by scroll position. Each word fades
// in as it enters a specific window of scroll progress. Feels like the page
// is thinking out loud.
function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.15'],
  });
  const words = text.split(' ');

  return (
    <p ref={ref} className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.15] tracking-[-0.01em]">
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">
      {children}
    </motion.span>
  );
}

const STATS = [
  { v: '5+', l: 'Years shipping code' },
  { v: '20+', l: 'Projects delivered' },
  { v: 'JS · PY', l: 'Language spectrum' },
];

export default function Manifesto() {
  return (
    <section
      id="about"
      className="relative py-32 md:py-48 px-6 md:px-10"
      aria-label="About Seun Sowemimo"
    >
      <div className="max-w-5xl mx-auto">
        <div className="font-mono text-[10px] tracking-widest uppercase text-coral-500 mb-10">
          — 002 / The Person Behind The Work
        </div>

        <ScrollRevealText
          text="I'm Oluwaseun. I build enterprise-scale web applications that don't feel enterprise — fast, considered, and quietly powerful. Currently living in the JavaScript ecosystem, occasionally moonlighting in Python."
        />

        <div className="mt-20 md:mt-28 grid grid-cols-3 gap-6 md:gap-10 border-t border-bone-100/10 pt-10">
          {STATS.map((s) => (
            <div key={s.l}>
              <div className="font-serif text-4xl md:text-6xl tracking-[-0.02em] text-bone-50">
                {s.v}
              </div>
              <div className="mt-3 font-mono text-[10px] md:text-xs tracking-widest uppercase text-bone-300">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
