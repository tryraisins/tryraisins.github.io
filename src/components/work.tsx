'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

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
    tagline: 'Real-time intelligence on incidents across Nigeria.',
    categories: ['Data', 'React', 'Dashboard'],
    url: 'https://terrortracker.tryraisins.dev',
    year: '2026',
  },
  {
    slug: 'echo-list',
    title: 'Echo List',
    tagline: 'Shazam discoveries, converted to curated YouTube playlists.',
    categories: ['Web App', 'API'],
    url: 'https://echolist.tryraisins.dev',
    year: '2025',
  },
  {
    slug: 'streamslip',
    title: 'StreamSlip',
    tagline: 'Your YouTube Music listening history as a shareable receipt.',
    categories: ['Web App', 'Canvas'],
    url: 'https://streamslip.tryraisins.dev',
    year: '2025',
  },
  {
    slug: 'iss-tracker',
    title: 'ISS Tracker',
    tagline: 'Where the International Space Station is right now.',
    categories: ['Web App', 'Live Data'],
    url: 'https://isstracker.tryraisins.dev',
    year: '2024',
  },
  {
    slug: 'talent-hunter',
    title: 'Talent Hunter',
    tagline: 'Resume screening that saves recruiters hours per role.',
    categories: ['SaaS', 'React', 'NLP'],
    url: 'https://talenthunter.tryraisins.dev',
    year: '2026',
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="card group block"
    >
      <div className="card-media relative overflow-hidden rounded-md bg-paper-100 aspect-[16/10]">
        <Image
          src={`/work/${project.slug}.png`}
          alt={`${project.title} — ${project.tagline}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
          className="object-cover object-top"
        />
        {/* Slide-in visit label */}
        <div className="absolute top-4 right-4 rounded-full bg-paper-50 text-ink-950 px-3.5 py-1.5 font-mono text-[10px] tracking-widest uppercase font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          Visit ↗
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display font-medium text-xl md:text-2xl leading-tight tracking-tight text-ink-950 group-hover:text-flame-500 transition-colors duration-200">
            {project.title}
          </h3>
          <p className="mt-1.5 font-display text-sm md:text-base text-ink-500 leading-snug">
            {project.tagline}
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1.5 pt-1">
          <span className="font-mono text-[10px] tracking-widest uppercase text-ink-500">
            {project.year}
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.categories.map((c) => (
          <span
            key={c}
            className="font-mono text-[10px] tracking-widest uppercase text-ink-500 border border-ink-200 rounded-full px-2.5 py-1"
          >
            {c}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-16 md:py-24 px-6 md:px-10" aria-label="Selected work">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex items-baseline justify-between gap-6 mb-10 md:mb-16 border-b border-ink-200 pb-6">
          <h2 className="font-display font-medium text-2xl md:text-3xl tracking-tight text-ink-950">
            Selected work
          </h2>
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-500">
            {PROJECTS.length} projects · 2024 – 2026
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-24">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
