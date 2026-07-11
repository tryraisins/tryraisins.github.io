'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ['rgba(250,249,244,0)', 'rgba(250,249,244,0.85)']);
  const blur = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(12px)']);
  const border = useTransform(scrollY, [0, 80], ['rgba(10,9,8,0)', 'rgba(10,9,8,0.08)']);

  return (
    <motion.header
      style={{ background: bg, backdropFilter: blur, borderBottom: '1px solid', borderBottomColor: border }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="font-display font-semibold text-base tracking-tight text-ink-950 hover:text-flame-500 transition-colors"
        >
          TryRaisins<span className="text-flame-500">.</span>
        </a>
        <div className="flex items-center gap-7 md:gap-10">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-draw font-display text-sm text-ink-700 hover:text-ink-950 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:tryraisins@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 hover:bg-flame-500 text-paper-50 px-4 py-2 font-display font-medium text-sm transition-colors"
          >
            <span>Email me</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
