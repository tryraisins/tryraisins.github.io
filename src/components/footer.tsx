export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-bone-100/10 py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="font-mono text-[10px] tracking-widest uppercase text-bone-300">
          © {new Date().getFullYear()} <span className="text-coral-500">Seun Sowemimo</span>. Lagos · Nigeria.
        </div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-bone-300/60">
          Designed &amp; built by hand. Deployed with intent.
        </div>
      </div>
    </footer>
  );
}
