import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, delay = 0, trigger, duration = 1.5, useGradient = false }) => {
  // Using alphanumeric characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const [displayText, setDisplayText] = useState(text);
  const [isComplete, setIsComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setDisplayText(text);
      setIsComplete(false);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);

    // Generate scrambled text
    const getScrambled = () => {
      return text
        .split('')
        .map((char) => (char === ' ' ? ' ' : characters[Math.floor(Math.random() * characters.length)]))
        .join('');
    };

    // Initial scramble
    setDisplayText(getScrambled());

    // Start scrambling immediately when triggered
    const scrambleInterval = setInterval(() => {
      setDisplayText(getScrambled());
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(scrambleInterval);

      let iteration = 0;
      const intervalDuration = 35;
      const totalDuration = duration * 1000;
      const totalFrames = totalDuration / intervalDuration;
      const incrementPerFrame = text.length / totalFrames;

      const revealInterval = setInterval(() => {
        const newText = text
          .split('')
          .map((char: string, index: number) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');

        setDisplayText(newText);
        iteration += incrementPerFrame;

        if (iteration >= text.length) {
          setDisplayText(text);
          setIsComplete(true);
          setIsAnimating(false);
          clearInterval(revealInterval);
        }
      }, intervalDuration);

      return () => clearInterval(revealInterval);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(scrambleInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // For iOS compatibility: only use gradient when complete, otherwise use solid color
  if (useGradient && isComplete) {
    return (
      <span className="hero-name-gradient">
        {displayText}
      </span>
    );
  }

  // During animation or for non-gradient text, use solid visible color
  return (
    <span style={{
      color: useGradient ? '#faf9f6' : 'inherit',
      opacity: 1,
      visibility: 'visible'
    }}>
      {displayText}
    </span>
  );
};

// Extended props interface
interface ScrambleTextProps {
  text: string;
  delay?: number;
  trigger: boolean;
  duration?: number;
  useGradient?: boolean;
}

const Hero: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (inView) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [inView]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Atmospheric Background */}
      <div className="absolute inset-0 atmosphere-gradient" />

      {/* Organic Flow Animation */}
      <div className="absolute inset-0 organic-flow" />

      {/* Grain Texture */}
      <div className="absolute inset-0 grain-overlay" />

      {/* Dot Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-50" />

      {/* Floating Orbs */}
      <motion.div
        className="floating-orb coral"
        style={{ width: '400px', height: '400px', top: '10%', left: '10%' }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="floating-orb blue"
        style={{ width: '300px', height: '300px', bottom: '20%', right: '15%' }}
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      <motion.div
        className="floating-orb lavender"
        style={{ width: '250px', height: '250px', top: '60%', left: '5%' }}
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Geometric Accent Lines */}
      <motion.div
        className="absolute top-1/4 right-[20%] w-px h-32 bg-gradient-to-b from-[#ff6b4a]/40 to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        style={{ transformOrigin: 'top' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-[15%] w-24 h-px bg-gradient-to-r from-[#5b8def]/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.3 }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute top-24 left-16 w-16 h-16 border border-[#faf9f6]/10 rotate-45"
        animate={{
          y: [0, -20, 0],
          rotate: [45, 225, 45],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-40 right-24 w-12 h-12 rounded-lg bg-gradient-to-br from-[#ff6b4a]/10 to-[#ff6b4a]/5"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-10 h-10 border border-[#5b8def]/20 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow Text */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#a1a1aa] text-lg md:text-xl tracking-[0.3em] uppercase mb-6"
          style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}
        >
          Hello, I'm
        </motion.p>

        {/* Main Name */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-[0.95]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          <ScrambleText text="Seun Sowemimo" delay={200} trigger={inView} duration={1.5} useGradient={true} />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl text-[#71717a] mb-12"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontStyle: 'italic' }}
        >
          <ScrambleText text="A Fullstack Web Developer" delay={600} trigger={inView} duration={1.8} />
        </motion.p>

        {/* CTA Button */}
        {showButton && (
          <motion.a
            href="#projects"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary inline-flex"
          >
            <span>View My Work</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </motion.a>
        )}

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-[#faf9f6]/20 flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-1.5 h-3 rounded-full bg-[#ff6b4a]"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Hero-specific Styles */}
      <style>{`
        .hero-name-gradient {
          background: linear-gradient(
            135deg,
            #faf9f6 0%,
            #ff8f73 30%,
            #ff6b4a 50%,
            #faf9f6 70%,
            #a1a1aa 100%
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: heroGradientShift 8s ease-in-out infinite;
        }
        
        @keyframes heroGradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;