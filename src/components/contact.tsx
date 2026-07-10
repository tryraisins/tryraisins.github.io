'use client';

import { motion } from 'framer-motion';

const CHANNELS = [
  { label: 'Email',    value: 'tryraisins@gmail.com',                              href: 'mailto:tryraisins@gmail.com' },
  { label: 'GitHub',   value: 'tryraisins',                                        href: 'https://github.com/tryraisins' },
  { label: 'LinkedIn', value: 'TryRaisins',                                        href: 'https://www.linkedin.com/in/seun-sowemimo-8518b7249/' },
  { label: 'Medium',   value: 'TryRaisins',                                        href: 'https://medium.com/@TryRaisins' },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-32 md:py-48 px-5 md:px-10"
      aria-label="Contact"
    >
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-[10px] tracking-widest uppercase text-flame-500 mb-8">
          Contact &nbsp;·&nbsp; Say hey
        </div>

        {/* Giant kinetic CTA */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-[-0.05em]"
        >
          <span className="block text-ink-50">Got an idea?</span>
          <span className="block italic text-ink-200">Let&apos;s make</span>
          <span className="block">
            <a
              href="mailto:tryraisins@gmail.com"
              data-cursor="link"
              data-cursor-label="EMAIL →"
              className="shear underline-draw text-flame-500 hover:text-flame-400 transition-colors"
            >
              it real
            </a>
            <span className="text-ink-50">.</span>
            <span className="caret text-ink-50" />
          </span>
        </motion.h2>

        {/* Channel grid */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 border-t border-ink-50/10 pt-10">
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              data-cursor="link"
              data-cursor-label="OPEN →"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center justify-between border-b border-ink-50/10 py-5 hover:border-flame-500/60 transition-colors"
            >
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-[10px] tracking-widest uppercase text-ink-300 w-20">
                  {c.label}
                </span>
                <span className="font-display font-semibold text-2xl md:text-3xl text-ink-50 group-hover:text-flame-500 transition-colors">
                  {c.value}
                </span>
              </div>
              <span className="font-mono text-xs text-ink-300 group-hover:text-flame-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                ↗
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
