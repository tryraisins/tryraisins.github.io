'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 100], ['rgba(13,12,10,0)', 'rgba(13,12,10,0.75)']);
  const blur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(14px)']);
  const border = useTransform(scrollY, [0, 100], ['rgba(245,242,235,0)', 'rgba(245,242,235,0.08)']);

  return (
    <motion.header
      style={{ background: bg, backdropFilter: blur, borderBottom: '1px solid', borderBottomColor: border }}
      className="fixed top-0 left-0 right-0 z-[90]"
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
        <a
          href="#top"
          data-cursor="link"
          data-cursor-label="TOP"
          className="font-display font-bold text-sm tracking-tight text-ink-50 hover:text-flame-500 transition-colors"
        >
          Tryraisins<span className="text-flame-500">.</span>
        </a>
        <ul className="flex items-center gap-6 md:gap-9">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                data-cursor="link"
                data-cursor-label="GO"
                className="font-mono text-[11px] tracking-widest uppercase text-ink-200 hover:text-flame-500 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
