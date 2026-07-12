import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Coffee, ArrowUpRight } from 'lucide-react';
import { useMagnetic } from '../utils/useMagnetic';

const About: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const contactMagnetic = useMagnetic<HTMLAnchorElement>(12);
  const githubMagnetic = useMagnetic<HTMLAnchorElement>(12);

  const stats = [
    { label: 'Years Experience', value: '5+' },
    { label: 'Projects Delivered', value: '20+' },
    { label: 'Coffee Consumed', value: '∞' },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden bg-zinc-900/50"
      aria-label="About Seun Sowemimo"
    >
      {/* Subtle Background Detail */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-900 to-transparent opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--coral-400)] rounded-full filter blur-[150px] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

          {/* Left Column: The Hook */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <SectionTitle>About Me</SectionTitle>




            </motion.div>
          </div>

          {/* Right Column: The Narrative */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="space-y-8"
            >
              <p className="text-xl leading-relaxed text-zinc-300 font-light">
                Hello! I'm <strong className="text-white font-medium">Oluwaseun Sowemimo</strong>.
                
              </p>

              <p className="text-lg leading-relaxed text-zinc-400">
                Currently, I engineer enterprise-scale applications leveraging the Javascript ecosystem. I also dabble in Python.
               
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 py-8 border-y border-zinc-800">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-5 pt-4">
                <motion.a
                  ref={contactMagnetic.ref}
                  href="#contact"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onMouseMove={contactMagnetic.onMouseMove}
                  onMouseEnter={contactMagnetic.onMouseEnter}
                  onMouseLeave={contactMagnetic.onMouseLeave}
                  animate={{
                    x: contactMagnetic.x,
                    y: contactMagnetic.y,
                    scale: contactMagnetic.hovered ? 1.04 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20, mass: 0.5 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[var(--coral-400)] text-zinc-900 rounded-full font-bold text-sm tracking-wide overflow-hidden"
                >
                  <span className="relative z-10">Get in Touch</span>
                  <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </motion.a>

                <motion.a
                  ref={githubMagnetic.ref}
                  href="https://github.com/tryraisins"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseMove={githubMagnetic.onMouseMove}
                  onMouseEnter={githubMagnetic.onMouseEnter}
                  onMouseLeave={githubMagnetic.onMouseLeave}
                  animate={{
                    x: githubMagnetic.x,
                    y: githubMagnetic.y,
                    scale: githubMagnetic.hovered ? 1.04 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20, mass: 0.5 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-zinc-700 text-white rounded-full font-medium text-sm tracking-wide overflow-hidden group hover:border-[var(--coral-400)] transition-colors duration-300"
                >
                  <span className="absolute inset-0 -z-10 bg-[var(--coral-400)] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 group-hover:text-zinc-900 transition-colors duration-300">View GitHub</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;