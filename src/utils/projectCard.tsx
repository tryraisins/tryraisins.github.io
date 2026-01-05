import React, { useState, useEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  description: string;
  liveLink?: string;
  githubLink?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ imageSrc, title, description, liveLink, githubLink }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      // Check for touch capability
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      // Check for mobile user agent as well
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsTouchDevice(isTouch || isMobile);
    };
    
    checkTouchDevice();
    // Re-check on resize in case of device rotation or virtual keyboard
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    
    // For iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS) {
      e.preventDefault();
      setTimeout(() => {
        window.open(e.currentTarget.href, '_blank', 'noopener,noreferrer');
      }, 100);
    }
  };

  return (
    <div className={`bg-gray-700 rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 ${
      !isTouchDevice ? 'hover:scale-105 hover:shadow-2xl group' : 'active:scale-100'
    }`}>
      <img
        src={imageSrc}
        alt={title}
        className={`w-full h-auto transition-opacity duration-300 ${
          !isTouchDevice ? 'group-hover:opacity-80' : ''
        }`}
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
              className={`inline-flex items-center space-x-2 bg-purple-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 select-none relative ${
                !isTouchDevice ? 'hover:bg-purple-700' : 'active:scale-95 active:bg-purple-700'
              }`}
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                minHeight: '44px',
                minWidth: '44px',
                // Remove focus outline for mobile
                outline: isTouchDevice ? 'none' : undefined,
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                e.currentTarget.style.backgroundColor = '#7c3aed'; // purple-700
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.backgroundColor = '';
              }}
              onTouchCancel={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.backgroundColor = '';
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
              className={`inline-flex items-center space-x-2 bg-gray-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 select-none relative ${
                !isTouchDevice ? 'hover:bg-gray-700' : 'active:scale-95 active:bg-gray-700'
              }`}
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                minHeight: '44px',
                minWidth: '44px',
                outline: isTouchDevice ? 'none' : undefined,
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                e.currentTarget.style.backgroundColor = '#374151'; // gray-700
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.backgroundColor = '';
              }}
              onTouchCancel={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.backgroundColor = '';
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