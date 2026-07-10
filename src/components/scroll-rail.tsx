'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const DOTS = [
  { pct: 0.02, label: 'Top', href: '#top' },
  { pct: 0.28, label: 'Work', href: '#work' },
  { pct: 0.66, label: 'About', href: '#about' },
  { pct: 0.92, label: 'Contact', href: '#contact' },
];

// Right-edge scroll progress rail. Coral bar fills top-down as you scroll.
// Section dots are clickable jump targets. Hidden on narrow viewports.
export default function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      aria-hidden="true"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[80] hidden md:flex flex-col items-center gap-4"
    >
      <div className="relative w-px h-64 bg-ink-50/10 overflow-hidden">
        <motion.div
          style={{ height }}
          className="absolute top-0 left-0 w-full bg-flame-500 origin-top"
        />
      </div>
      <div className="flex flex-col gap-2">
        {DOTS.map((d) => (
          <a
            key={d.href}
            href={d.href}
            data-cursor="link"
            data-cursor-label="JUMP"
            aria-label={`Jump to ${d.label}`}
            className="group relative w-3 h-3 flex items-center justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ink-300 group-hover:bg-flame-500 group-hover:scale-150 transition-transform" />
            <span className="absolute right-full mr-3 whitespace-nowrap font-mono text-[9px] tracking-widest uppercase text-ink-300 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition">
              {d.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
