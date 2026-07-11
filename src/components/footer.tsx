export default function Footer() {
  return (
    <footer className="relative border-t border-ink-200 py-8 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
        <div className="font-mono text-[11px] tracking-widest uppercase text-ink-500">
          © {new Date().getFullYear()} · TryRaisins
        </div>
      </div>
    </footer>
  );
}
