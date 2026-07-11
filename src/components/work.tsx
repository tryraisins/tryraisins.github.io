'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type Project = {
  slug: string;
  title: string;
  tagline: string;
  categories: string[];
  url: string;
  year: string;
};

const PROJECTS: Project[] = [
  {
    slug: 'terror-tracker',
    title: 'Terror Tracker',
    tagline: 'Real-time intelligence on incidents across Nigeria — a live dashboard sourced from verified reports.',
    categories: ['Data', 'React', 'Dashboard'],
    url: 'https://terrortracker.tryraisins.dev',
    year: '2026',
  },
  {
    slug: 'echo-list',
    title: 'Echo List',
    tagline: 'Shazam discoveries, converted to curated YouTube playlists in a few clicks.',
    categories: ['Web App', 'API'],
    url: 'https://echolist.tryraisins.dev',
    year: '2025',
  },
  {
    slug: 'streamslip',
    title: 'StreamSlip',
    tagline: 'Turn your YouTube Music listening history into a beautiful, shareable receipt.',
    categories: ['Web App', 'Canvas'],
    url: 'https://streamslip.tryraisins.dev',
    year: '2025',
  },
  {
    slug: 'iss-tracker',
    title: 'ISS Tracker',
    tagline: 'Where the International Space Station is right now, who is on it, and where they are from.',
    categories: ['Web App', 'Live Data'],
    url: 'https://isstracker.tryraisins.dev',
    year: '2024',
  },
  {
    slug: 'talent-hunter',
    title: 'Talent Hunter',
    tagline: 'Resume screening that saves recruiters hours per role — an internal SaaS tool.',
    categories: ['SaaS', 'React', 'NLP'],
    url: 'https://talenthunter.tryraisins.dev',
    year: '2026',
  },
];

function ProjectFeature({ project, index, total }: { project: Project; index: number; total: number }) {
  const number = String(index + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Image parallax: drifts up slower than page scroll — gives depth
  const imageY = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);
  // Title drifts subtly opposite for magazine-spread feel
  const titleY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <motion.article
      ref={ref}
      className="group relative"
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`Visit ${project.title}`}
      >
        {/* Metadata rail: index · year · categories · visit */}
        <div className="flex items-center justify-between gap-4 border-t border-ink-950 pt-4 mb-10 md:mb-14 font-mono text-[11px] tracking-widest uppercase">
          <div className="flex items-center gap-3 md:gap-5 text-ink-500 min-w-0">
            <span className="text-ink-950">{number} <span className="text-ink-300">/</span> {totalStr}</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">{project.year}</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden lg:inline truncate">{project.categories.join(' · ')}</span>
          </div>
          <span className="flex items-center gap-1.5 text-ink-950 group-hover:text-flame-500 transition-colors">
            <span>Visit</span>
            <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
          </span>
        </div>

        {/* Title + tagline */}
        <div className="grid grid-cols-12 gap-4 mb-10 md:mb-14">
          <motion.h3
            style={{ y: titleY }}
            className="col-span-12 md:col-span-8 font-display font-medium text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em] text-ink-950 group-hover:text-flame-500 transition-colors duration-500"
          >
            {project.title}
          </motion.h3>
          <p className="col-span-12 md:col-span-4 md:pt-3 font-display text-base md:text-lg leading-snug text-ink-700 max-w-md">
            {project.tagline}
          </p>
        </div>

        {/* Full-width image */}
        <div className="card relative overflow-hidden rounded-md bg-paper-100 aspect-[16/9]">
          <motion.div style={{ y: imageY }} className="card-media absolute inset-[-15%]">
            <Image
              src={`/work/${project.slug}.png`}
              alt={`${project.title} — ${project.tagline}`}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-top"
            />
          </motion.div>
          {/* Subtle floating Visit chip */}
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-2 rounded-full bg-paper-50 text-ink-950 pl-4 pr-3 py-2 font-mono text-[10px] tracking-widest uppercase font-medium opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <span>Open Site</span>
            <span aria-hidden="true">↗</span>
          </div>
        </div>

        {/* Bottom rail: category chips */}
        <div className="mt-6 md:hidden flex flex-wrap gap-1.5">
          {project.categories.map((c) => (
            <span
              key={c}
              className="font-mono text-[10px] tracking-widest uppercase text-ink-500 border border-ink-200 rounded-full px-2.5 py-1"
            >
              {c}
            </span>
          ))}
        </div>
      </a>
    </motion.article>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-20 md:py-28 px-6 md:px-10" aria-label="Selected work">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex items-baseline justify-between gap-6 mb-14 md:mb-20 border-b border-ink-200 pb-6">
          <h2 className="font-display font-medium text-2xl md:text-3xl tracking-tight text-ink-950">
            Selected work
          </h2>
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-500">
            {PROJECTS.length} projects · 2024 – 2026
          </span>
        </header>

        <div className="space-y-28 md:space-y-40">
          {PROJECTS.map((p, i) => (
            <ProjectFeature key={p.slug} project={p} index={i} total={PROJECTS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
