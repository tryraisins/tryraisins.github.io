import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import {
  Briefcase,
  Cpu,
  Database,
  GitBranch,
  Cloud,
  Zap,
  Layout,
  Smartphone,
  Server,
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const Skills: React.FC = () => {
  const skillsData = [
    {
      icon: Layout,
      title: 'Frontend Development',
      description:
        'React, TypeScript, JavaScript, jQuery, HTML5, CSS3, TailwindCSS, Bootstrap 5, Astro JS, Vue JS, responsive web design',
      accentColor: '#5b8def',
    },
    {
      icon: Server,
      title: 'Backend Integration',
      description: 'Node.js, Python, REST APIs, Azure Functions, MongoDB, API integration',
      accentColor: '#34d399',
    },
    {
      icon: Cloud,
      title: 'Cloud & Deployment',
      description: 'Vercel, MongoDB, Cloudflare, Netlify, CI/CD pipelines, cloud functions',
      accentColor: '#22d3ee',
    },
    {
      icon: Briefcase,
      title: 'Enterprise Solutions',
      description: 'Power Apps, Power Automate, SharePoint, workflow automation',
      accentColor: '#ff6b4a',
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description: 'Git, GitHub, collaborative development, code reviews',
      accentColor: '#a1a1aa',
    },
    {
      icon: Zap,
      title: 'Testing & Optimization',
      description: 'Debugging, performance optimization, bottleneck identification',
      accentColor: '#facc15',
    },
    {
      icon: Smartphone,
      title: 'UI/UX Implementation',
      description: 'Translating designs to code, user-centered interfaces, accessibility',
      accentColor: '#fb7185',
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'MongoDB databases, SharePoint lists, large data processing',
      accentColor: '#a78bfa',
    },
    {
      icon: Cpu,
      title: 'Problem Solving',
      description: 'Analytical thinking, solution architecture, technical troubleshooting',
      accentColor: '#2dd4bf',
    },
  ];

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

 const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] as const // Add "as const"
    },
  },
};
  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 px-6 overflow-hidden section-container"
      style={{ background: 'var(--obsidian-900)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 atmosphere-gradient" />
      <div className="absolute inset-0 grain-overlay" />

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-32 left-[8%] w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(91, 141, 239, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 74, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionTitle>My Skills</SectionTitle>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-secondary)' }}
          >
            A comprehensive toolkit of technologies and expertise I bring to every project
          </motion.p>
        </div>

        {/* Skills Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {skillsData.map((skill, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative p-6 rounded-2xl glass-card cursor-default"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* Glow Effect on Hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${skill.accentColor}15 0%, transparent 60%)`,
                }}
              />

              {/* Icon Container */}
              <div className="relative mb-5">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${skill.accentColor}20 0%, ${skill.accentColor}08 100%)`,
                    border: `1px solid ${skill.accentColor}30`,
                  }}
                >
                  <skill.icon
                    className="w-6 h-6 transition-colors duration-300"
                    style={{ color: skill.accentColor }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3
                  className="text-xl font-semibold mb-3 transition-colors duration-300"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: 'var(--text-primary)',
                  }}
                >
                  {skill.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: 'var(--text-muted)',
                  }}
                >
                  {skill.description}
                </p>
              </div>

              {/* Bottom Accent Line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${skill.accentColor}, transparent)` }}
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

export default Skills;