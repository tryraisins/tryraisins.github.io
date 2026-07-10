export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-ink-50/10 py-8 px-5 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="font-mono text-[10px] tracking-widest uppercase text-ink-300">
          © {new Date().getFullYear()} · Seun Sowemimo · Lagos, Nigeria
        </div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-ink-300/70">
          Built with Next.js. Deployed with intent.
        </div>
      </div>
    </footer>
  );
}
