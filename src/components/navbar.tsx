import React, { useState, useEffect, useRef } from 'react';
import NavLink from '../utils/navLink';
import { Home, User, Code, Briefcase, Mail, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    setIsOpen(false);

    const startPosition = window.pageYOffset;
    const targetPosition = element.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime: number | null = null;

    const easeOutQuad = (t: number) => t * (2 - t);

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, startPosition + distance * easeOutQuad(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navRef]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'top-4' : 'top-6'
        }`}
    >
      {/* Desktop Navigation - Floating Glass Pill */}
      <div
        className={`hidden md:flex items-center gap-1 px-2 py-2 rounded-full glass-navbar transition-all duration-500 ${scrolled ? 'scale-95' : 'scale-100'
          }`}
      >
        {/* Logo/Brand Mark */}
        <motion.div
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b4a] to-[#e64d2e] mr-2"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span
            className="text-[#0a0a0b] font-bold text-lg"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            S
          </span>
        </motion.div>

        {/* Navigation Links */}
        <NavLink to="home" label="Home" icon={Home} onClick={() => scrollToSection('home')} />
        <NavLink to="about" label="About" icon={User} onClick={() => scrollToSection('about')} />
        <NavLink to="skills" label="Skills" icon={Code} onClick={() => scrollToSection('skills')} />
        <NavLink
          to="projects"
          label="Projects"
          icon={Briefcase}
          onClick={() => scrollToSection('projects')}
        />
        <NavLink
          to="contact"
          label="Contact"
          icon={Mail}
          onClick={() => scrollToSection('contact')}
        />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Toggle Button */}
        <motion.button
          onClick={toggleMenu}
          className="flex items-center justify-center w-14 h-14 rounded-full glass-navbar"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-[#ff6b4a]" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} className="text-[#faf9f6]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-20 right-0 w-56 p-4 rounded-2xl glass-navbar"
            >
              <div className="flex flex-col gap-2">
                <NavLink
                  to="home"
                  label="Home"
                  icon={Home}
                  onClick={() => scrollToSection('home')}
                />
                <NavLink
                  to="about"
                  label="About"
                  icon={User}
                  onClick={() => scrollToSection('about')}
                />
                <NavLink
                  to="skills"
                  label="Skills"
                  icon={Code}
                  onClick={() => scrollToSection('skills')}
                />
                <NavLink
                  to="projects"
                  label="Projects"
                  icon={Briefcase}
                  onClick={() => scrollToSection('projects')}
                />
                <NavLink
                  to="contact"
                  label="Contact"
                  icon={Mail}
                  onClick={() => scrollToSection('contact')}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;