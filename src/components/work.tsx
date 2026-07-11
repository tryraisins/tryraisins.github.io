'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type Project = {
  title: string;
  tagline: string;
  categories: string[];
  url: string;
  year: string;
};

const PROJECTS: Project[] = [
  {
    title: 'Terror Tracker',
    tagline: 'Real-time intelligence on incidents across Nigeria — a live dashboard sourced from verified reports.',
    categories: ['Data', 'React', 'Dashboard'],
    url: 'https://terrortracker.tryraisins.dev',
    year: '2026',
  },
  {
    title: 'Echo List',
    tagline: 'Shazam discoveries, converted to curated YouTube playlists in a few clicks.',
    categories: ['Web App', 'API'],
    url: 'https://echolist.tryraisins.dev',
    year: '2025',
  },
  {
    title: 'StreamSlip',
    tagline: 'Turn your YouTube Music listening history into a beautiful, shareable receipt.',
    categories: ['Web App', 'Canvas'],
    url: 'https://streamslip.tryraisins.dev',
    year: '2025',
  },
  {
    title: 'ISS Tracker',
    tagline: 'Where the International Space Station is right now, who is on it, and where they are from.',
    categories: ['Web App', 'Live Data'],
    url: 'https://isstracker.tryraisins.dev',
    year: '2024',
  },
  {
    title: 'Talent Hunter',
    tagline: 'Resume screening that saves recruiters hours per role — an internal SaaS tool.',
    categories: ['SaaS', 'React', 'NLP'],
    url: 'https://talenthunter.tryraisins.dev',
    year: '2026',
  },
];

function ProjectItem({ project, index, total }: { project: Project; index: number; total: number }) {
  const num = String(index + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Number drifts up slower than page scroll — parallax
  const numberY = useTransform(scrollYProgress, [0, 1], ['30%', '-30%']);
  // Title drifts opposite direction for depth
  const titleX = useTransform(scrollYProgress, [0, 1], ['-2%', '2%']);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border-t border-ink-950 py-10 md:py-14"
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`Visit ${project.title}`}
      >
        {/* Coral wash on hover — fills from left */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-flame-500/5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.15,1)] pointer-events-none"
        />

        <div className="relative grid grid-cols-12 gap-4 md:gap-8 items-start">
          {/* Big index number — parallaxes with scroll */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              style={{ y: numberY }}
              className="font-mono text-xs md:text-sm tracking-widest text-ink-500 group-hover:text-flame-500 transition-colors"
            >
              {num} <span className="text-ink-300">/ {totalStr}</span>
            </motion.div>
          </div>

          {/* Title cluster — the visual mass */}
          <div className="col-span-10 md:col-span-8">
            <motion.h3
              style={{ x: titleX }}
              className="font-display font-medium text-5xl md:text-8xl lg:text-9xl leading-[0.9] tracking-[-0.04em] text-ink-950 group-hover:text-flame-500 transition-colors duration-500 flex flex-wrap items-baseline gap-x-4 md:gap-x-6"
            >
              <span>{project.title}</span>
              <span
                aria-hidden="true"
                className="inline-block text-2xl md:text-4xl text-ink-500 group-hover:text-flame-500 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4"
              >
                ↗
              </span>
            </motion.h3>

            {/* Tagline: subtle at rest, bright on hover */}
            <p className="mt-6 md:mt-8 font-display text-base md:text-xl leading-snug text-ink-500 group-hover:text-ink-950 transition-colors duration-500 max-w-2xl">
              {project.tagline}
            </p>

            {/* Category chips */}
            <div className="mt-6 md:mt-8 flex flex-wrap gap-1.5">
              {project.categories.map((c) => (
                <span
                  key={c}
                  className="font-mono text-[10px] tracking-widest uppercase text-ink-500 border border-ink-200 group-hover:border-ink-950 rounded-full px-2.5 py-1 transition-colors duration-300"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Year — right column, top-aligned */}
          <div className="col-span-12 md:col-span-3 md:text-right">
            <div className="font-mono text-xs md:text-sm tracking-widest text-ink-500 group-hover:text-flame-500 transition-colors">
              {project.year}
            </div>
            <div className="hidden md:block mt-4 font-mono text-[10px] tracking-widest uppercase text-ink-300 group-hover:text-ink-500 transition-colors">
              Visit&nbsp;
              <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">↗</span>
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-20 md:py-28 px-6 md:px-10" aria-label="Selected work">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex items-baseline justify-between gap-6 mb-14 md:mb-20">
          <h2 className="font-display font-medium text-2xl md:text-3xl tracking-tight text-ink-950">
            Selected work
          </h2>
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-500">
            {PROJECTS.length} projects · 2024 – 2026
          </span>
        </header>

        <div>
          {PROJECTS.map((p, i) => (
            <ProjectItem key={p.title} project={p} index={i} total={PROJECTS.length} />
          ))}
          <div className="border-t border-ink-950" />
        </div>
      </div>
    </section>
  );
}
