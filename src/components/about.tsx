import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Coffee, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

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
              <h2
                className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Building digital experiences that <span className="text-[var(--coral-400)] italic">matter</span>.
              </h2>

              <div className="mt-12 hidden lg:block">
                <div className="w-24 h-1 bg-[var(--coral-400)] rounded-full mb-8" />
                <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
                  Based in Nubiaville<br />
                  Available for remote work
                </p>
              </div>
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
                Use me to turn complex problems into elegant, user-friendly solutions.
                I bridge the gap between design and engineering, ensuring that every pixel serves a purpose
                and every line of code adds value.
              </p>

              <p className="text-lg leading-relaxed text-zinc-400">
                Currently, I engineer enterprise-scale applications at <span className="text-white border-b border-[var(--coral-400)] pb-0.5">[REDACTED]</span>,
                leveraging the power of the React ecosystem and Serverless architectures.
                My background spans from rapid prototyping in startups to rigorous development cycles in
                corporate environments, giving me a unique perspective on adaptability and code quality.
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
                <a
                  href="mailto:tryraisins@gmail.com"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[var(--coral-400)] text-zinc-900 rounded-full font-bold text-sm tracking-wide overflow-hidden transition-transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Get in Touch</span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </a>

                <a
                  href="https://github.com/tryraisins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-zinc-700 text-white rounded-full font-medium text-sm tracking-wide hover:border-[var(--coral-400)] hover:text-[var(--coral-400)] transition-colors"
                >
                  View GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;