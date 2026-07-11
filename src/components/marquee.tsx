const ITEMS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Next.js',
  'Tailwind',
  'Design',
  '2026',
];

// Pure CSS marquee: content is duplicated once, animation translates the
// row by exactly -50% width so the second copy takes over seamlessly.
// Zero JS = zero glitches.
export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-hidden="true"
      className="relative py-6 md:py-10 border-y border-ink-50/10 overflow-hidden"
    >
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {doubled.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 md:gap-10 mr-6 md:mr-10 font-display font-bold text-4xl md:text-7xl lg:text-8xl leading-none tracking-[-0.03em]"
          >
            <span className={i % 2 === 0 ? 'text-ink-50' : 'text-flame-500 italic'}>{t}</span>
            <span className="text-ink-300 text-3xl md:text-6xl lg:text-7xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
