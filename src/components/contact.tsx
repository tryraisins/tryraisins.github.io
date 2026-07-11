'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';

function MediumIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

const CHANNELS = [
  { label: 'Email',    handle: 'tryraisins@gmail.com', href: 'mailto:tryraisins@gmail.com',                          Icon: Mail },
  { label: 'GitHub',   handle: '@tryraisins',          href: 'https://github.com/tryraisins',                        Icon: Github },
  { label: 'LinkedIn', handle: 'TryRaisins',           href: 'https://www.linkedin.com/in/seun-sowemimo-8518b7249/', Icon: Linkedin },
  { label: 'Medium',   handle: '@TryRaisins',          href: 'https://medium.com/@TryRaisins',                       Icon: MediumIcon },
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

        <motion.h3
          initial={{ opacity: 0, y: 30 }}
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
        </motion.h3>

        <div className="mt-16 md:mt-24">
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-500 mb-6">
            Or find me on
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {CHANNELS.map((c, i) => {
              const { Icon } = c;
              return (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={`${c.label} — ${c.handle}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group inline-flex items-center gap-3 rounded-full border border-ink-200 hover:border-ink-950 hover:bg-ink-950 px-5 py-3 transition-colors"
                >
                  <Icon className="w-4 h-4 text-ink-950 group-hover:text-paper-50 transition-colors" />
                  <span className="font-display text-sm text-ink-950 group-hover:text-paper-50 transition-colors">
                    {c.handle}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-ink-500 group-hover:text-paper-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                  >
                    ↗
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
