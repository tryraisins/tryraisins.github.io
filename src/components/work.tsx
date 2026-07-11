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

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;
  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="group grid grid-cols-12 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-0 items-start"
    >
      {/* Image column — 7 cols wide, sides alternate */}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`card block relative overflow-hidden rounded-md bg-paper-100 col-span-12 md:col-span-7 aspect-[16/10] ${
          isEven ? 'md:order-1' : 'md:order-2 md:col-start-6'
        }`}
        aria-label={`Visit ${project.title}`}
      >
        <div className="card-media absolute inset-0">
          <Image
            src={`/work/${project.slug}.png`}
            alt={`${project.title} — ${project.tagline}`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-top"
          />
        </div>
        {/* Visit chip — appears on hover in the corner */}
        <div className="absolute top-4 right-4 rounded-full bg-paper-50 text-ink-950 px-3.5 py-1.5 font-mono text-[10px] tracking-widest uppercase font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          Visit ↗
        </div>
      </a>

      {/* Text column — 4 cols wide */}
      <div
        className={`col-span-12 md:col-span-4 flex flex-col self-end pb-2 ${
          isEven ? 'md:order-2 md:col-start-9' : 'md:order-1 md:col-start-1'
        }`}
      >
        {/* Big project number */}
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-display font-medium text-5xl md:text-7xl leading-none text-ink-950 tracking-[-0.03em]">
            {number}
          </span>
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-500">
            {project.year}
          </span>
        </div>

        <h3 className="font-display font-medium text-3xl md:text-4xl leading-[1.05] tracking-[-0.02em] text-ink-950 group-hover:text-flame-500 transition-colors duration-300">
          {project.title}
        </h3>

        <p className="mt-4 font-display text-base md:text-lg leading-snug text-ink-700 max-w-md">
          {project.tagline}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.categories.map((c) => (
            <span
              key={c}
              className="font-mono text-[10px] tracking-widest uppercase text-ink-500 border border-ink-200 rounded-full px-2.5 py-1"
            >
              {c}
            </span>
          ))}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 link-draw self-start font-display text-base text-ink-950 hover:text-flame-500 transition-colors"
        >
          Visit {project.title} ↗
        </a>
      </div>
    </motion.article>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-20 md:py-28 px-6 md:px-10" aria-label="Selected work">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex items-baseline justify-between gap-6 mb-16 md:mb-24 border-b border-ink-200 pb-6">
          <h2 className="font-display font-medium text-2xl md:text-3xl tracking-tight text-ink-950">
            Selected work
          </h2>
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-500">
            {PROJECTS.length} projects · 2024 – 2026
          </span>
        </header>

        <div className="space-y-24 md:space-y-40">
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
