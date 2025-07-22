import React from "react";
import { Github, Linkedin } from 'lucide-react';

// Custom Medium icon component
const MediumIcon = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 py-10 px-4 text-gray-400 text-center">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-6 mb-6">
          <a
            href="https://github.com/tryraisins" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-500 transition-colors duration-300"
            aria-label="GitHub Profile"
          >
            
            <Github size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/seun-sowemimo-8518b7249/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
            aria-label="LinkedIn Profile"
          >
            
            <Linkedin size={28} />
          </a>
          <a
            href="https://medium.com/@TryRaisins" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-500 transition-colors duration-300"
            aria-label="Medium Profile"
          >
            <MediumIcon size={28} />
          </a>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} TryRaisins. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Built by me with React and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;