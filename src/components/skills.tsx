import React, { useState } from 'react';
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
  Code2,
  Globe,
  Terminal,
  Layers
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';

// Define categorization for skills
interface SkillItem {
  name: string;
  icon: React.ElementType;
  desc: string;
}

interface SkillCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  skills: SkillItem[];
}

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('frontend');

  const categories: SkillCategory[] = [
    {
      id: 'frontend',
      label: 'Frontend Universe',
      description: 'Crafting immersive user experiences with modern frameworks',
      icon: Layout,
      color: '#ff6b4a', // Coral
      skills: [
        { name: 'React', icon: Code2, desc: 'Component architecture, Hooks, Context API' },
        { name: 'TypeScript', icon: Terminal, desc: 'Type-safe development, Interfaces' },
        { name: 'TailwindCSS', icon: Layers, desc: 'Rapid UI development, Custom themes' },
        { name: 'Next.js/Astro', icon: Globe, desc: 'SSR, SSG, Performance optimization' },
        { name: 'Responsive Design', icon: Smartphone, desc: 'Mobile-first approach, Accessibility' }
      ]
    },
    {
      id: 'backend',
      label: 'Backend & Data',
      description: 'Robust server-side logic and efficient data architecture',
      icon: Server,
      color: '#5b8def', // Blue
      skills: [
        { name: 'Node.js', icon: Server, desc: 'REST API, Event-driven architecture' },
        { name: 'Python', icon: Terminal, desc: 'Scripting, Automation, Data processing' },
        { name: 'MongoDB', icon: Database, desc: 'NoSQL schema design, Aggregation pipelines' },
        { name: 'Azure Functions', icon: Cloud, desc: 'Serverless computing, Triggers & Bindings' }
      ]
    },
    {
      id: 'devops',
      label: 'Cloud & DevOps',
      description: 'Streamlined deployment pipelines and infrastructure',
      icon: GitBranch,
      color: '#a78bfa', // Lavender
      skills: [
        { name: 'CI/CD', icon: Zap, desc: 'GitHub Actions, Automated testing' },
        { name: 'Git', icon: GitBranch, desc: 'Version control, Branch management' },
        { name: 'Cloud Platforms', icon: Cloud, desc: 'Vercel, Netlify, Azure configuration' },
        { name: 'Optimization', icon: Cpu, desc: 'Performance monitoring, Vital audits' }
      ]
    },
    {
      id: 'enterprise',
      label: 'Enterprise Solutions',
      description: 'Scalable business process automation and workflows',
      icon: Briefcase,
      color: '#34d399', // Mint
      skills: [
        { name: 'Power Platform', icon: Layers, desc: 'Power Apps, Power Automate flows' },
        { name: 'SharePoint', icon: Database, desc: 'List management, Site architecture' },
        { name: 'Workflow Logic', icon: Cpu, desc: 'Business logic implementation' },
        { name: 'Integration', icon: Globe, desc: 'API connectors, Data gateways' }
      ]
    }
  ];

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 px-6 overflow-hidden bg-[var(--obsidian-900)] min-h-screen flex items-center"
      aria-label="Technical skills explorer"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 atmosphere-gradient opacity-60" />
      <div className="absolute inset-0 grain-overlay" />

      {/* Background blobs based on active category */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full filter blur-[100px] opacity-20 pointer-events-none"
          style={{
            background: categories.find(c => c.id === activeCategory)?.color || '#ff6b4a'
          }}
        />
      </AnimatePresence>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionTitle>Technical Ecosystem</SectionTitle>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column: Navigation */}
          <div className="lg:w-1/3 flex flex-col gap-4">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative p-6 text-left rounded-2xl transition-all duration-300 group overflow-hidden border ${isActive
                      ? 'bg-[var(--glass-bg)] border-[var(--coral-400)] shadow-lg shadow-[rgba(255,107,74,0.1)]'
                      : 'bg-transparent border-transparent hover:bg-[rgba(255,255,255,0.03)]'
                    }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className={`p-3 rounded-lg transition-colors duration-300 ${isActive ? 'bg-[rgba(255,107,74,0.1)]' : 'bg-[rgba(255,255,255,0.05)]'}`}
                    >
                      <category.icon
                        className={`w-6 h-6 ${isActive ? 'text-[var(--coral-400)]' : 'text-zinc-400'}`}
                      />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold font-serif mb-1 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                        {category.label}
                      </h3>
                      <p className={`text-xs ${isActive ? 'text-[var(--text-secondary)]' : 'text-zinc-600'}`}>
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--coral-400)]"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Visualizer */}
          <div className="lg:w-2/3 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {categories.find(c => c.id === activeCategory)?.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[var(--glass-card)] hover:bg-[rgba(255,255,255,0.03)] transition-colors group cursor-default"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <skill.icon
                          size={20}
                          style={{ color: categories.find(c => c.id === activeCategory)?.color }}
                          className="group-hover:scale-110 transition-transform duration-300 transform"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1 text-base">{skill.name}</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {skill.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;