import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  description: string;
  liveLink?: string;
  githubLink?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  imageSrc,
  title,
  description,
  liveLink,
  githubLink,
}) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIOS) {
      e.preventDefault();
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden glass-card h-full flex flex-col"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <motion.img
          src={imageSrc}
          alt={title}
          className="w-full h-52 object-cover transition-transform duration-700"
          whileHover={{ scale: 1.08 }}
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = `https://placehold.co/600x400/111113/faf9f6?text=${encodeURIComponent(
              title
            )}`;
          }}
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/90 via-[#0a0a0b]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at 50% 100%, rgba(255, 107, 74, 0.15) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3
          className="text-2xl font-semibold mb-3 text-center group-hover:text-[#ff6b4a] transition-colors duration-300"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--text-primary)' }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-6 flex-1 text-center"
          style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)' }}
        >
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {liveLink && (
            <motion.a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, liveLink)}
              className="btn-primary text-sm py-2.5 px-5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </motion.a>
          )}
          {githubLink && (
            <motion.a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, githubLink)}
              className="btn-secondary text-sm py-2.5 px-5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              <Github size={16} />
              <span>GitHub</span>
            </motion.a>
          )}
        </div>
      </div>

      {/* Border Glow on Hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(255, 107, 74, 0.3)',
        }}
      />
    </motion.div>
  );
};

export default ProjectCard;