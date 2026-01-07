import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <div className="text-center mb-4">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-4xl md:text-5xl lg:text-6xl relative inline-block"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600,
        color: 'var(--text-primary)',
      }}
    >
      {children}

      {/* Animated Underline */}
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-3 left-0 right-0 h-0.5 origin-left"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--coral-400), transparent)',
        }}
      />
    </motion.h2>

    {/* Decorative Dots */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="flex justify-center gap-2 mt-6"
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: 'var(--coral-400)', opacity: 0.4 }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: 'var(--coral-400)' }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: 'var(--coral-400)', opacity: 0.4 }}
      />
    </motion.div>
  </div>
);

export default SectionTitle;
