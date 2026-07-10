'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 100], ['rgba(5,5,6,0)', 'rgba(5,5,6,0.7)']);
  const blur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)']);
  const border = useTransform(scrollY, [0, 100], ['rgba(232,230,223,0)', 'rgba(232,230,223,0.06)']);

  return (
    <motion.header
      style={{ background: bg, backdropFilter: blur, borderBottom: '1px solid', borderBottomColor: border }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="font-mono text-xs tracking-widest uppercase text-bone-100 hover:text-coral-500 transition-colors"
        >
          <span className="text-coral-500">/</span>tryraisins
        </a>
        <ul className="flex items-center gap-8 md:gap-10">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-xs tracking-widest uppercase text-bone-300 hover:text-bone-50 transition-colors"
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
