import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom Medium icon component
const MediumIcon = ({ size = 28 }: { size?: number; }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

const Footer: React.FC = () => {
  const socialLinks = [
    {
      href: 'https://github.com/tryraisins',
      icon: Github,
      label: 'GitHub Profile',
      hoverColor: '#ff6b4a',
    },
    {
      href: 'https://www.linkedin.com/in/seun-sowemimo-8518b7249/',
      icon: Linkedin,
      label: 'LinkedIn Profile',
      hoverColor: '#5b8def',
    },
    {
      href: 'https://medium.com/@TryRaisins',
      icon: MediumIcon,
      label: 'Medium Profile',
      hoverColor: '#34d399',
    },
  ];

  return (
    <footer
      className="relative py-16 px-6 overflow-hidden"
      style={{ background: 'var(--obsidian-900)' }}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255, 107, 74, 0.05) 0%, transparent 60%)',
        }}
      />
      <div className="absolute inset-0 grain-overlay" />

      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b4a]/30 to-transparent" />

      <div className="container mx-auto relative z-10">
        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-10">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full transition-all duration-300"
              style={{ color: 'var(--text-muted)' }}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.95 }}
              aria-label={social.label}
            >
              {/* Hover Background */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `${social.hoverColor}15` }}
              />

              {/* Icon */}
              <social.icon
                size={24}
                className="relative z-10 transition-colors duration-300"
                style={{ color: 'inherit' }}
              />

              {/* Hover Effect - changes color on hover */}
              <style>{`
                .group:hover [data-icon="${index}"] {
                  color: ${social.hoverColor} !important;
                }
              `}</style>

              {/* Apply hover color directly */}
              <span
                className="sr-only group-hover:not-sr-only"
                style={{ color: social.hoverColor }}
              />
            </motion.a>
          ))}
        </div>

        {/* Brand & Copyright */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm mb-2"
            style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)' }}
          >
            © {new Date().getFullYear()}{' '}
            <span style={{ color: 'var(--coral-400)' }}>TryRaisins</span>. All rights reserved.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs"
            style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)', opacity: 0.7 }}
          >
            Designed & Built with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="inline-block"
              style={{ color: 'var(--coral-400)' }}
            >
              ♥
            </motion.span>{' '}
            using React & Tailwind CSS
          </motion.p>
        </div>

        {/* Decorative Label */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span
            className="px-4 py-2 rounded-full text-xs tracking-wider uppercase"
            style={{
              fontFamily: "'Manrope', sans-serif",
              background: 'var(--obsidian-700)',
              color: 'var(--text-muted)',
              border: '1px solid var(--glass-border)',
            }}
          >
            Portfolio V2.0
          </span>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;