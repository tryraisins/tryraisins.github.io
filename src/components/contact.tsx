'use client';

import { motion } from 'framer-motion';

const CHANNELS = [
  { label: 'Email',    value: 'tryraisins@gmail.com', href: 'mailto:tryraisins@gmail.com' },
  { label: 'GitHub',   value: 'tryraisins',           href: 'https://github.com/tryraisins' },
  { label: 'LinkedIn', value: 'TryRaisins',           href: 'https://www.linkedin.com/in/seun-sowemimo-8518b7249/' },
  { label: 'Medium',   value: 'TryRaisins',           href: 'https://medium.com/@TryRaisins' },
];

export default function Contact() {
  return (
    <section id="contact" className="relative pt-20 md:pt-28 pb-24 md:pb-40 px-6 md:px-10" aria-label="Contact">
      <div className="max-w-[1400px] mx-auto">
        <header className="border-b border-ink-200 pb-6 mb-10 md:mb-16">
          <h2 className="font-display font-medium text-2xl md:text-3xl tracking-tight text-ink-950">
            Contact
          </h2>
        </header>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-medium text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.02em] text-ink-950 max-w-4xl"
        >
          Say hi at{' '}
          <a
            href="mailto:tryraisins@gmail.com"
            className="link-draw text-flame-500 hover:text-flame-600 transition-colors"
          >
            tryraisins@gmail.com
          </a>
          .
        </motion.p>

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2 max-w-4xl">
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center justify-between border-b border-ink-200 py-5 hover:border-ink-950 transition-colors"
            >
              <div className="flex items-center gap-6">
                <span className="font-mono text-[11px] tracking-widest uppercase text-ink-500 w-16 md:w-20">
                  {c.label}
                </span>
                <span className="font-display text-lg md:text-xl text-ink-950 group-hover:text-flame-500 transition-colors">
                  {c.value}
                </span>
              </div>
              <span className="font-mono text-ink-500 group-hover:text-flame-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                ↗
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
