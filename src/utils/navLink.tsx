import React from 'react';

// Define the props interface
interface NavLinkProps {
  to: string;              // Required: URL hash (e.g., "#home")
  label: string;           // Required: Link text
  icon: React.ComponentType<{ size?: number }>; // Accepts icon components with `size` prop
  onClick?: () => void;    // Optional: Click handler
}

const NavLink = ({ to, label, icon: Icon, onClick }: NavLinkProps) => (
  <a
    href={`#${to}`}
    onClick={onClick}
    className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-gray-800"
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </a>
);

export default NavLink;