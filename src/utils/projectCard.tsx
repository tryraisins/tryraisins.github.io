import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  liveLink?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  liveLink,
}) => {
  return (
    <motion.a
      href={liveLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full p-6 bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-zinc-800 transition-all duration-300 group relative overflow-hidden"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Subtle Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3
            className="text-2xl font-bold text-white group-hover:text-[#ff6b4a] transition-colors leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {title}
          </h3>
          <ExternalLink
            size={20}
            className="text-zinc-500 group-hover:text-[#ff6b4a] transition-colors shrink-0"
          />
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.a>
  );
};

export default ProjectCard;