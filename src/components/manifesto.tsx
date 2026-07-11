'use client';

import { motion } from 'framer-motion';

const PARAGRAPHS = [
  'I make things for the internet. Small tools, side projects, the occasional experiment — the ones on this page are the ones I keep coming back to.',
  'Been at this about five years now. Mostly React, TypeScript, Node, and some Python. Comfortable across the whole stack, particular about interfaces, curious about most things.',
  'If you’re working on something interesting and want a second pair of hands, drop me a note.',
];

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
          <div className="md:col-span-4 md:col-start-1">
            <div className="font-mono text-[11px] tracking-widest uppercase text-ink-500 space-y-2">
              <div>Fullstack developer</div>
              <div>Based on the internet</div>
              <div className="pt-4 text-ink-700">React · TypeScript</div>
              <div className="text-ink-700">Node · Python · Next.js</div>
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6 space-y-6 md:space-y-8">
            {PARAGRAPHS.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-lg md:text-2xl leading-[1.35] tracking-tight text-ink-700"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
