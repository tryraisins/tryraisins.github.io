'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const LINES = [
  { l: 'I build things that ship.' },
  { l: 'Not portfolios of concepts — actual apps in front of actual users.' },
  { l: 'BetPicks. Talent Hunter. Terror Tracker. Live domains, real traffic.' },
  { l: 'Five years across React, TypeScript, Node, Python, and enough infra to keep it up.' },
  { l: 'If your project needs someone who owns the whole stack from schema to CSS, we should talk.' },
];

// Sticky-scroll manifesto: title pins on the left while the right-side lines
// scroll past. When the section leaves, the title slides out.
export default function Manifesto() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const titleX = useTransform(scrollYProgress, [0.9, 1], ['0%', '-30%']);
  const titleOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  return (
    <section
      id="about"
      ref={wrapRef}
      className="relative py-32 md:py-48 px-5 md:px-10"
      aria-label="About"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
        {/* Sticky left column — title pins in place */}
        <div className="md:col-span-5">
          <div className="sticky top-32">
            <motion.div style={{ x: titleX, opacity: titleOpacity }}>
              <div className="font-mono text-[10px] tracking-widest uppercase text-flame-500 mb-4">
                About &nbsp;·&nbsp; The Person
              </div>
              <h2 className="font-display font-bold text-6xl md:text-8xl leading-[0.85] tracking-[-0.05em] text-ink-50">
                So who&apos;s<br />
                <span className="italic text-flame-500">building this?</span>
              </h2>
              <div className="mt-8 font-mono text-[10px] tracking-widest uppercase text-ink-300 flex items-center gap-3">
                <span className="w-6 h-px bg-flame-500" />
                <span>@tryraisins</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right column — long-form lines each faded/lifted in on scroll */}
        <div className="md:col-span-7 md:pt-4 space-y-8 md:space-y-10">
          {LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="text"
              className="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-[-0.02em] text-ink-100"
            >
              {line.l}
            </motion.p>
          ))}

          {/* Stat blocks */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-10 mt-10 border-t border-ink-50/10">
            {[
              { v: '5+', l: 'Years shipping' },
              { v: '20+', l: 'Projects live' },
              { v: '∞', l: 'Coffee consumed' },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display font-bold text-4xl md:text-6xl leading-none tracking-[-0.04em] text-ink-50">{s.v}</div>
                <div className="mt-2 font-mono text-[10px] tracking-widest uppercase text-ink-300">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
