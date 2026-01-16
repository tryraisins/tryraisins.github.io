import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import ProjectCard from '../utils/projectCard';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

import faceidImage from '../assets/images/faceid.jpg';
import issTrackerImage from '../assets/images/isstracker.png';
import expenseImage from '../assets/images/spendex.png';
import portfolioV1Image from '../assets/images/portfolio-v1.png';
import echolistImgae from '../assets/images/echolist.png';
import billQuickImage from '../assets/images/bill-quick.png';
import streamSlipImage from '../assets/images/streamslip.png';
import betPicksImage from '../assets/images/BetPicks.png'

const Projects: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const projects = [
    {
      imageSrc: faceidImage,
      title: 'Face Detection App',
      description:
        'A crude react app with a sample login page that detect the faces on any image captured via camera and tried to guess the users age and facial expression',
      liveLink: 'https://faceid.netlify.app/',
    },
    {
      imageSrc: betPicksImage,
      title: 'BetPicks',
      description:
        'A a modern Next.js application that provides detailed sports match predictions for NBA and Soccer, leveraging advanced caching strategies to optimize API usage and ensure high performance.',
      liveLink: 'https://betpicks.tryraisins.dev/',
    },
    {
      imageSrc: issTrackerImage,
      title: 'International Space Station Tracker',
      description:
        "A simple app that fetches the current location of the International Space Staion. It also shows the number of people in space at the moment, who they are and where they are.",
      liveLink: 'https://isstracker.tryraisins.dev/',
    },
    {
      imageSrc: echolistImgae,
      title: 'Echo List',
      description:
        'A tool to Seamlessly convert your Shazam discoveries into curated YouTube playlists.',
      liveLink: 'https://echolist.tryraisins.dev/',
    },
    {
      imageSrc: expenseImage,
      title: 'SpendEx (Expense Manager)',
      description:
        'A comprehensive expense tracking web app that helps users manage their spending across multiple currencies with analytics, reporting, and customization features',
      liveLink: 'https://spendex.tryraisins.dev/',
    },
    {
      imageSrc: billQuickImage,
      title: 'QuickBillz (Invoice Generator)',
      description:
        'A web app that allows users to quickly generate bills and invoices in minutes for free. Pro services to be included gradually.',
      liveLink: 'https://quickbillz.tryraisins.dev/',
    },
     {
      imageSrc: streamSlipImage,
      title: 'StreamSlip',
      description:
        'Transform your YouTube Music listening history into beautiful, shareable receipts.',
      liveLink: 'https://streamslip.tryraisins.dev/',
    },
    {
      imageSrc: portfolioV1Image,
      title: 'Portfolio Website V1',
      description:
        'The first iteration of my personal portfolio, Built with ParcelJS',
      liveLink: 'https://tryraisinsfolio.netlify.app/',
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
                imageSrc={project.imageSrc}
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