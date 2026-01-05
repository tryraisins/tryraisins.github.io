import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  description: string;
  liveLink?: string;
  githubLink?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ imageSrc, title, description, liveLink, githubLink }) => {
  // Handle link click to prevent card hover effects interfering
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent any parent handlers from interfering
    e.stopPropagation();
    
    // For iOS Safari, we want to ensure the link opens directly
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS) {
      // For iOS, we'll prevent default and use window.open
      // which tends to work better than anchor clicks
      e.preventDefault();
      // Small delay to allow visual feedback
      setTimeout(() => {
        window.open(e.currentTarget.href, '_blank', 'noopener,noreferrer');
      }, 100);
    }
    // For other devices, let the default anchor behavior work
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 group active:scale-100">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-auto group-hover:opacity-80 transition-opacity duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src = `https://placehold.co/600x400/4B5563/F9FAFB?text=${encodeURIComponent(title)}`;
        }}
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-4">
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 active:scale-95 touch-manipulation cursor-pointer select-none relative z-10"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                // Ensure link is above any parent elements
                position: 'relative',
              }}
              onTouchStart={(e) => {
                // Add visual feedback for touch
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <ExternalLink size={20} />
              <span>Live Demo</span>
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 active:scale-95 touch-manipulation cursor-pointer select-none relative z-10"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                position: 'relative',
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;