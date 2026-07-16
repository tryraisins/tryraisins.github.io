// src/components/SectionTitle.tsx
import React from 'react';

// Define the props interface for SectionTitle
interface SectionTitleProps {
  children: React.ReactNode; // Allows passing any React child (text, other components)
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <h2 className="text-4xl font-bold text-center mb-12 relative pb-4">
    {children}
    {/* This span creates the purple underline effect */}
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-purple-600 rounded-full"></span>
  </h2>
);

export default SectionTitle;
