import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const // Add "as const" 
      },
    },
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 px-6 overflow-hidden section-container"
      style={{ background: 'var(--obsidian-800)' }}
      aria-label="About Seun Sowemimo - Background and skills"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute inset-0 grain-overlay" />

      {/* Floating Accent Orbs */}
      <motion.div
        className="absolute top-20 right-[10%] w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 74, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-32 left-[5%] w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(91, 141, 239, 0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        className="container mx-auto max-w-4xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <SectionTitle>About Me</SectionTitle>

        <div className="mt-16 space-y-8">
          {/* Intro Paragraph */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl leading-relaxed text-center"
            style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-secondary)' }}
          >
            Hello! I'm{' '}
            <span
              className="font-semibold"
              style={{ color: 'var(--coral-400)' }}
            >
              Oluwaseun Sowemimo
            </span>
            , a passionate Frontend-focused Web Developer with professional experience across
            multiple industries. I bring expertise in design, development, testing, and maintenance
            of web systems, with proficiency in React, TypeScript, JQuery, Python, and other modern
            web technologies.
          </motion.p>

          {/* Experience Paragraph */}
          <motion.p
            variants={itemVariants}
            className="text-lg leading-relaxed text-center"
            style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-secondary)' }}
          >
            Currently at{' '}
            <span className="px-3 py-1 rounded-full glass-card text-sm" style={{ color: 'var(--text-muted)' }}>
              [REDACTED]
            </span>
            , I develop web applications using React, TypeScript, Python and Node.js while
            implementing enterprise solutions including low-code platforms and Azure functions.
            Previously at{' '}
            <span className="px-3 py-1 rounded-full glass-card text-sm" style={{ color: 'var(--text-muted)' }}>
              [REDACTED]
            </span>
            , I built client websites using modern web stacks, translating business requirements
            into technical solutions.
          </motion.p>

          {/* Skills Grid */}
          <motion.div variants={itemVariants} className="mt-12">
            <p
              className="text-center mb-8 text-lg"
              style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-secondary)' }}
            >
              My technical toolkit includes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: 'Frontend',
                  skills: 'React, TypeScript, JavaScript, jQuery',
                  color: '#5b8def',
                },
                {
                  label: 'Backend',
                  skills: 'Node.js, Python, Azure Functions',
                  color: '#34d399',
                },
                {
                  label: 'Tools',
                  skills: 'GitHub, CI/CD platforms, MongoDB',
                  color: '#a1a1aa',
                },
                {
                  label: 'Enterprise',
                  skills: 'Low-code platforms, workflow automation, Microsoft Solutions',
                  color: '#ff6b4a',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group p-5 rounded-2xl glass-card flex items-start gap-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span
                      className="font-semibold block mb-1"
                      style={{ color: item.color, fontFamily: "'Manrope', sans-serif" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)', fontFamily: "'Manrope', sans-serif" }}
                    >
                      {item.skills}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            <motion.a
              href="mailto:tryraisins@gmail.com"
              className="btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email Me
            </motion.a>
            <motion.a
              href="https://github.com/tryraisins"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
};

export default About;