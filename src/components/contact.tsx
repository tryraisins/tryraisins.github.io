'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CHANNELS = [
  { label: 'Email', value: 'tryraisins@gmail.com', href: 'mailto:tryraisins@gmail.com' },
  { label: 'GitHub', value: '/tryraisins', href: 'https://github.com/tryraisins' },
  { label: 'LinkedIn', value: '/seun-sowemimo', href: 'https://www.linkedin.com/in/seun-sowemimo-8518b7249/' },
  { label: 'Medium', value: '@TryRaisins', href: 'https://medium.com/@TryRaisins' },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-32 md:py-48 px-6 md:px-10"
      aria-label="Contact"
    >
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-widest uppercase text-coral-500 mb-10">
          — 003 / Say Hello
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-[-0.03em]"
        >
          Let&apos;s build<br />
          <span className="italic text-bone-100">something worth</span><br />
          <a
            href="mailto:tryraisins@gmail.com"
            className="relative inline-block text-coral-500 hover:text-coral-400 transition-colors group"
          >
            shipping.
            <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-coral-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          </a>
        </motion.h2>

        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 border-t border-bone-100/10 pt-12">
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center justify-between border-b border-bone-100/10 pb-4 hover:border-coral-500/40 transition-colors"
            >
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-bone-300 mb-2">
                  {c.label}
                </div>
                <div className="font-serif text-2xl md:text-3xl text-bone-50 group-hover:text-coral-500 transition-colors">
                  {c.value}
                </div>
              </div>
              <ArrowUpRight
                className="w-5 h-5 text-bone-300 group-hover:text-coral-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
