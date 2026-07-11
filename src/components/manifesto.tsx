'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const PARAGRAPHS = [
  'I make things for the internet. Small tools, side projects, the occasional experiment — the ones on this page are the ones I keep coming back to.',
  'Been at this about five years now. Mostly React, TypeScript, Node, and some Python. Comfortable across the whole stack, particular about interfaces, curious about most things.',
  'If you’re working on something interesting and want a second pair of hands, drop me a note.',
];

// Each paragraph gets its own scroll-linked fade in / fade out based on its
// position relative to the viewport. Content lifts into view, sits, drifts
// out — editorial, not showy.
function ParallaxParagraph({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.15'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [0, 1, 1, 0.15]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [40, 0, 0, -30]);

  return (
    <motion.p
      ref={ref}
      style={{ opacity, y }}
      className="font-display text-lg md:text-2xl leading-[1.35] tracking-tight text-ink-700"
    >
      {text}
    </motion.p>
  );
}

export default function Manifesto() {
  return (
    <section id="about" className="relative py-24 md:py-32 px-6 md:px-10" aria-label="About">
      <div className="max-w-[1400px] mx-auto">
        <header className="border-b border-ink-200 pb-6 mb-10 md:mb-16">
          <h2 className="font-display font-medium text-2xl md:text-3xl tracking-tight text-ink-950">
            About
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          {/* Sticky left rail — pins as the right column scrolls past */}
          <div className="md:col-span-4 md:col-start-1">
            <div className="md:sticky md:top-28">
              <div className="font-mono text-[11px] tracking-widest uppercase text-ink-500 space-y-2">
                <div>Fullstack developer</div>
                <div>Based on the internet</div>
                <div className="pt-4 text-ink-700">React · TypeScript</div>
                <div className="text-ink-700">Node · Python · Next.js</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6 space-y-16 md:space-y-24">
            {PARAGRAPHS.map((p, i) => (
              <ParallaxParagraph key={i} text={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
