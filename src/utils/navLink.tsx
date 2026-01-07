import React from 'react';
import { motion } from 'framer-motion';

// Define the props interface
interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; }>;
  onClick?: () => void;
}

const NavLink = ({ to, label, icon: Icon, onClick }: NavLinkProps) => (
  <motion.a
    href={`#${to}`}
    onClick={onClick}
    className="group relative flex items-center gap-2 px-4 py-2.5 text-[#a1a1aa] hover:text-[#faf9f6] rounded-full transition-all duration-300"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Hover Background */}
    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff6b4a]/0 to-[#ff6b4a]/0 group-hover:from-[#ff6b4a]/10 group-hover:to-[#e64d2e]/10 transition-all duration-300" />

    {/* Icon */}
    <span className="relative z-10 text-[#71717a] group-hover:text-[#ff6b4a] transition-colors duration-300">
      <Icon size={18} />
    </span>

    {/* Label */}
    <span
      className="relative z-10 text-sm font-medium tracking-wide"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {label}
    </span>

    {/* Active Indicator Dot */}
    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff6b4a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.a>
);

export default NavLink;