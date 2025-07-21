import React, { useState, useEffect, useRef } from 'react';
import NavLink from '../utils/navLink';
import { Home, User, Code, Briefcase, Mail, Menu, X } from 'lucide-react';


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;

  setIsOpen(false); 
  
  const startPosition = window.pageYOffset;
  const targetPosition = element.getBoundingClientRect().top + startPosition;
  const distance = targetPosition - startPosition;
  const duration = 800; 
  let startTime: number | null = null;

  const easeOutQuad = (t: number) => t * (2 - t); // Easing function for smooth deceleration

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
    <nav ref={navRef} className="bg-gray-900 bg-opacity-90 backdrop-blur-sm fixed w-full z-50 shadow-lg top-0">
      <div className="container mx-auto px-2 py-3 flex justify-between items-center w-100">
        <div className="text-2xl font-bold text-purple-500">
          
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 hover:text-purple-400 focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        <div className={`md:flex ${isOpen ? 'block' : 'hidden'} absolute md:static top-full left-0 w-full md:w-auto bg-gray-900 md:bg-transparent shadow-lg md:shadow-none py-4 md:py-0`}>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 px-4 md:px-0">
            <NavLink to="home" label="Home" icon={Home} onClick={() => scrollToSection('home')} />
            <NavLink to="about" label="About" icon={User} onClick={() => scrollToSection('about')} />
            <NavLink to="skills" label="Skills" icon={Code} onClick={() => scrollToSection('skills')} />
            <NavLink to="projects" label="Projects" icon={Briefcase} onClick={() => scrollToSection('projects')} />
            <NavLink to="contact" label="Contact" icon={Mail} onClick={() => scrollToSection('contact')} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;