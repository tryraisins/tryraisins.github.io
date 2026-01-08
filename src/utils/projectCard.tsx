import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

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
  // Direct link handler for iOS compatibility
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.stopPropagation(); // Prevent card from capturing the click

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIOS) {
      e.preventDefault();
      // Use location.href for more reliable iOS navigation
      window.location.href = url;
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden glass-card h-full flex flex-col transition-transform duration-400 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = `https://placehold.co/600x400/111113/faf9f6?text=${encodeURIComponent(
              title
            )}`;
          }}
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/90 via-[#0a0a0b]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />

        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
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

        {/* Action Buttons - Using regular anchor tags for iOS compatibility */}
        <div className="flex flex-wrap gap-3 justify-center relative z-20">
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, liveLink)}
              className="btn-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              style={{
                WebkitTapHighlightColor: 'rgba(255, 107, 74, 0.3)',
                touchAction: 'manipulation',
                position: 'relative',
                zIndex: 30,
              }}
            >
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, githubLink)}
              className="btn-secondary text-sm py-2.5 px-5 inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              style={{
                WebkitTapHighlightColor: 'rgba(255, 107, 74, 0.3)',
                touchAction: 'manipulation',
                position: 'relative',
                zIndex: 30,
              }}
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
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
    </div>
  );
};

export default ProjectCard;