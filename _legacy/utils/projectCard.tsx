import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  description: string;
  liveLink?: string;
  githubLink?: string;
}



// --- Main Layout Components ---



const ProjectCard: React.FC<ProjectCardProps> = ({ imageSrc, title, description, liveLink, githubLink }) => (
  <div className="bg-gray-700 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 group">
    <img
      src={imageSrc}
      alt={title}
      className="w-full h-auto  group-hover:opacity-80 transition-opacity duration-300"
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
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-300"
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
            className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-300"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
        )}
      </div>
    </div>
  </div>
);


export default ProjectCard;