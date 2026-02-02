import React, { useState } from 'react';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isHovered, setIsHovered] = useState(false);

  // iOS specific handler
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.stopPropagation();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      e.preventDefault();
      window.location.href = url;
    }
  };

  return (
    <motion.div
      className="group relative h-[420px] w-full rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image with Zoom Effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = `https://placehold.co/600x400/111113/faf9f6?text=${encodeURIComponent(
              title
            )}`;
          }}
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
      </motion.div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="relative z-10">
          {/* Title Area */}
          <motion.div
            animate={{ y: isHovered ? -10 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h3
              className="text-3xl font-bold text-white mb-2 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {title}
            </h3>
          </motion.div>

          {/* Description & Links - Hidden initially or truncated */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isHovered ? 'auto' : 0,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="overflow-hidden"
          >
            <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-medium max-w-[90%]">
              {description}
            </p>

            <div className="flex items-center gap-4 pt-2">
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(e, liveLink)}
                  className="flex items-center gap-2 text-white border-b border-white/30 pb-1 hover:border-white transition-colors text-sm uppercase tracking-wider font-semibold"
                >
                  <ExternalLink size={14} className="text-coral-400" />
                  Live Demo
                </a>
              )}
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(e, githubLink)}
                  className="flex items-center gap-2 text-zinc-400 border-b border-transparent hover:text-white pb-1 transition-colors text-sm uppercase tracking-wider font-semibold"
                >
                  <Github size={14} />
                  Code
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Top Right Decorative Icon */}
      <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10">
          <ArrowUpRight className="text-white w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;