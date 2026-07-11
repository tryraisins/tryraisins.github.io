import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import ProjectCard from '../utils/projectCard';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const Projects: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const projects = [
    {
      title: 'QuickBillz',
      description:
        'Generate professional invoices in seconds — custom styling, multiple export formats, and typography that does not look like a template. Built with Next.js, TypeScript, and Tailwind.',
      liveLink: 'https://quickbillz.tryraisins.dev',
    },
    {
      title: 'Terror Tracker',
      description:
        'A live map of insurgent activity across Nigeria — verified incident reports, casualty counts, and threat clusters, updated as the news comes in. Next.js, MongoDB, and Node.js data pipelines.',
      liveLink: 'https://terrortracker.tryraisins.dev',
    },
    {
      title: 'Talent Hunter',
      description:
        'For recruiters drowning in resumes: paste a job spec, upload the pile, get a ranked shortlist in minutes instead of hours. Vite, React, TypeScript, and NLP-driven matching.',
      liveLink: 'https://talenthunter.tryraisins.dev',
    },
    {
      title: 'Echo List',
      description:
        'Your Shazam history is a graveyard of songs you meant to save. Upload the CSV and get a curated YouTube playlist in one go. React, TypeScript, and the YouTube Data API.',
      liveLink: 'https://echolist.tryraisins.dev',
    },
    {
      title: 'StreamSlip',
      description:
        'Your YouTube Music listening history, printed as a receipt you can screenshot. Wrapped-style stats whenever you want them. Next.js, Canvas rendering, and OAuth.',
      liveLink: 'https://streamslip.tryraisins.dev',
    },
    {
      title: 'International Space Station Tracker',
      description:
        'The International Space Station is somewhere over Earth right now. See exactly where — plus who is onboard and where they are from. React with live API polling and mapping.',
      liveLink: 'https://isstracker.tryraisins.dev',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
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
      id="projects"
      ref={ref}
      className="relative py-24 px-6 overflow-hidden section-container"
      style={{ background: 'var(--obsidian-800)' }}
      aria-label="Projects portfolio section"
    >
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="absolute inset-0 grain-overlay" />

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-40 right-[5%] w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 74, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-40 left-[8%] w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Geometric Accents */}
      <motion.div
        className="absolute top-24 left-[15%] w-px h-24 bg-gradient-to-b from-[#ff6b4a]/30 to-transparent"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ transformOrigin: 'top' }}
      />
      <motion.div
        className="absolute bottom-32 right-[20%] w-20 h-px bg-gradient-to-r from-[#5b8def]/30 to-transparent"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.8 }}
        style={{ transformOrigin: 'left' }}
      />

      <div className="container mx-auto relative z-10">
        <SectionTitle>My Projects</SectionTitle>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-6 mb-16 text-lg max-w-2xl mx-auto"
          style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-secondary)' }}
        >
          A selection of projects that showcase my skills and passion for creating impactful digital experiences
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={cardVariants}>
              <ProjectCard
                title={project.title}
                description={project.description}
                liveLink={project.liveLink}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
};

export default Projects;