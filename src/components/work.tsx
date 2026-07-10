'use client';

import { motion } from 'framer-motion';

type Project = {
  n: string;
  title: string;
  domain: string;
  tagline: string;
  url: string;
  year: string;
};

const PROJECTS: Project[] = [
  { n: '01', title: 'BetPicks',      domain: 'betpicks.tryraisins.dev',      tagline: 'Sports predictions with a caching layer that respects rate limits.', url: 'https://betpicks.tryraisins.dev', year: '2026' },
  { n: '02', title: 'Talent Hunter', domain: 'talenthunter.tryraisins.dev', tagline: 'Resume screening that saves recruiters hours per role.',           url: 'https://talenthunter.tryraisins.dev', year: '2026' },
  { n: '03', title: 'Terror Tracker',domain: 'terrortracker.tryraisins.dev',tagline: 'Real-time intelligence on incidents across Nigeria.',              url: 'https://terrortracker.tryraisins.dev', year: '2026' },
  { n: '04', title: 'Echo List',     domain: 'echolist.tryraisins.dev',     tagline: 'Shazam discoveries, converted to curated YouTube playlists.',      url: 'https://echolist.tryraisins.dev', year: '2025' },
  { n: '05', title: 'StreamSlip',    domain: 'streamslip.tryraisins.dev',   tagline: 'Your listening history, reimagined as a shareable receipt.',       url: 'https://streamslip.tryraisins.dev', year: '2025' },
  { n: '06', title: 'ISS Tracker',   domain: 'isstracker.tryraisins.dev',   tagline: 'Where the ISS is, who is on it, and where they are from.',         url: 'https://isstracker.tryraisins.dev', year: '2024' },
];

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      data-cursor-label="VISIT →"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group slot-row block border-t border-ink-50/10 hover:border-flame-500/60 transition-colors relative overflow-hidden"
    >
      <div className="py-8 md:py-12 grid grid-cols-12 gap-4 items-center relative">
        {/* Number */}
        <span className="col-span-2 md:col-span-1 font-mono text-xs md:text-sm tracking-widest text-ink-300 group-hover:text-flame-500 transition-colors">
          {project.n}
        </span>

        {/* Slot-machine title — two versions stacked, swap on hover */}
        <div className="col-span-10 md:col-span-6">
          <div className="slot font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-[-0.04em]">
            <span className="text-ink-50">{project.title}</span>
            <span className="text-flame-500 italic">{project.title} →</span>
          </div>
        </div>

        {/* Tagline + domain */}
        <div className="col-span-12 md:col-span-4 md:col-start-8 space-y-2">
          <p className="text-sm md:text-base text-ink-200 leading-snug">
            {project.tagline}
          </p>
          <div className="overflow-hidden">
            <div className="font-mono text-[10px] tracking-widest uppercase text-ink-300 flex items-center gap-2 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.7,0,0.15,1)]">
              <span className="w-4 h-px bg-flame-500" />
              <span>{project.domain}</span>
              <span className="text-ink-400">·</span>
              <span>{project.year}</span>
            </div>
          </div>
        </div>

        {/* Growing accent bar under the row on hover */}
        <span className="absolute bottom-0 left-0 h-px bg-flame-500 w-0 group-hover:w-full transition-[width] duration-700 ease-[cubic-bezier(0.7,0,0.15,1)]" />
      </div>
    </motion.a>
  );
}

export default function Work() {
  return (
    <section
      id="work"
      className="relative py-24 md:py-32 px-5 md:px-10"
      aria-label="Selected work"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-14 md:mb-20 flex items-end justify-between gap-8">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-flame-500 mb-3">
              Work &nbsp;·&nbsp; 2024 – 2026
            </div>
            <h2 className="font-display font-bold text-6xl md:text-8xl lg:text-9xl leading-[0.85] tracking-[-0.04em] text-ink-50">
              Shipped<br />
              <span className="italic text-flame-500">recently.</span>
            </h2>
          </div>
          <div className="hidden md:block text-right font-mono text-[10px] tracking-widest uppercase text-ink-300">
            <div>{PROJECTS.length} projects</div>
            <div className="text-ink-300/60 mt-1">Hover to preview</div>
          </div>
        </header>

        <div>
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.n} project={p} index={i} />
          ))}
          <div className="border-t border-ink-50/10" />
        </div>
      </div>
    </section>
  );
}
