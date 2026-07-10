'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

type Project = {
  n: string;
  title: string;
  tagline: string;
  stack: string[];
  url: string;
};

const PROJECTS: Project[] = [
  {
    n: '01',
    title: 'BetPicks',
    tagline: 'Sports predictions with a caching layer that respects rate limits.',
    stack: ['Next.js', 'TypeScript', 'API Design'],
    url: 'https://betpicks.tryraisins.dev',
  },
  {
    n: '02',
    title: 'Talent Hunter',
    tagline: 'Resume screening that saves recruiters hours per role.',
    stack: ['Vite', 'React', 'NLP'],
    url: 'https://talenthunter.tryraisins.dev',
  },
  {
    n: '03',
    title: 'Terror Tracker',
    tagline: 'Real-time intelligence on incidents across Nigeria.',
    stack: ['React', 'Data Pipeline', 'Mapping'],
    url: 'https://terrortracker.tryraisins.dev',
  },
  {
    n: '04',
    title: 'Echo List',
    tagline: 'Shazam discoveries, converted to curated YouTube playlists.',
    stack: ['React', 'YouTube API'],
    url: 'https://echolist.tryraisins.dev',
  },
  {
    n: '05',
    title: 'StreamSlip',
    tagline: 'Your listening history, reimagined as a shareable receipt.',
    stack: ['React', 'YouTube Music API', 'Canvas'],
    url: 'https://streamslip.tryraisins.dev',
  },
  {
    n: '06',
    title: 'ISS Tracker',
    tagline: 'Where the ISS is, who is on it, and where they are from.',
    stack: ['React', 'Open Notify API'],
    url: 'https://isstracker.tryraisins.dev',
  },
];

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Alternating parallax direction so the eye is pulled left/right down the page
  const dir = index % 2 === 0 ? 1 : -1;
  const y = useTransform(scrollYProgress, [0, 1], [40 * dir, -40 * dir]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.6]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="group"
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block border-t border-bone-100/10 py-10 md:py-14 transition-colors hover:border-coral-500/40"
      >
        <div className="grid grid-cols-12 gap-6 items-baseline">
          <span className="col-span-2 md:col-span-1 font-mono text-xs tracking-widest text-bone-300 group-hover:text-coral-500 transition-colors">
            {project.n}
          </span>
          <div className="col-span-10 md:col-span-6">
            <h3 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-none tracking-[-0.02em] text-bone-50 group-hover:text-coral-500 transition-colors">
              {project.title}
            </h3>
          </div>
          <div className="col-span-10 md:col-span-4 md:col-start-8 text-sm md:text-base text-bone-300 leading-relaxed">
            <p>{project.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-widest uppercase text-bone-300/70">
              {project.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 md:col-start-12 justify-self-end">
            <ArrowUpRight
              className="w-6 h-6 text-bone-300 group-hover:text-coral-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function Work() {
  return (
    <section
      id="work"
      className="relative py-32 md:py-48 px-6 md:px-10"
      aria-label="Selected work"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 md:mb-24 flex items-end justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-coral-500 mb-4">
              — 001 / Selected Work
            </div>
            <h2 className="font-serif text-4xl md:text-6xl leading-none tracking-[-0.02em]">
              Things I&apos;ve<br />
              <span className="italic text-bone-100">shipped.</span>
            </h2>
          </div>
          <div className="hidden md:block text-right font-mono text-xs tracking-widest uppercase text-bone-300">
            <div>{PROJECTS.length} projects</div>
            <div className="text-bone-300/60 mt-1">2021 – 2026</div>
          </div>
        </header>

        <div>
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.n} project={p} index={i} />
          ))}
          <div className="border-t border-bone-100/10" />
        </div>
      </div>
    </section>
  );
}
