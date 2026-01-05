import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  delay?: number;
  trigger: boolean;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, delay = 0, trigger }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  useEffect(() => {
    if (!trigger) return;

    setIsComplete(false);
    let iteration = 0;
    const maxIterations = 50;
    const intervalDuration = 100;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char: string, index: number) => {
              if (char === ' ') return ' ';
              if (index < iteration) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join('')
        );

        iteration += 1 / 3;

        if (iteration >= text.length) {
          setDisplayText(text);
          setIsComplete(true);
          clearInterval(interval);
        }
      }, intervalDuration);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, trigger]);

  return (
    <span className={`transition-all duration-300 ${isComplete ? 'opacity-100' : 'opacity-90'}`}>
      {displayText || text.split('').map(() => ' ').join('')}
    </span>
  );
};

const Hero: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <section
      id="home"
      ref={ref}
      className={`relative h-screen flex items-center justify-center text-white overflow-hidden transition-opacity duration-1000 transform
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ background: 'linear-gradient(135deg, #111828 0%, #202938 100%)' }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-400/8 to-transparent animate-slide-right"></div>
        <div className="grid-pattern"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 border-2 border-slate-400/20 rotate-45"
        animate={{
          y: [0, -20, 0],
          rotate: [45, 225, 45],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-slate-400/15 to-slate-500/15 rounded-lg"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-12 h-12 border border-slate-300/25 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-1/3 w-8 h-20 bg-gradient-to-t from-slate-400/20 to-transparent"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />

      {/* Subtle Light Rays */}
      <motion.div
        className="absolute top-0 left-1/2 w-1 h-32 bg-gradient-to-b from-slate-300/30 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-20 right-1/4 w-1 h-24 bg-gradient-to-b from-slate-400/25 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="text-center z-10 p-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-4"
        >
          Hello, I'm
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight metal-text"
        >
          <ScrambleText text="Try Raisins" delay={300} trigger={inView} />
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1000 }}
          className="text-2xl md:text-3xl text-gray-400 mb-8"
        >
          <ScrambleText text="A Fullstack Web Developer" delay={500} trigger={inView} />
        </motion.p>
        
        <motion.a
          href="#projects"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 5.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-purple-500/25 hover:shadow-xl"
        >
          View My Work
        </motion.a>
      </div>

      <style>{`
        @keyframes slideRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-slide-right {
          animation: slideRight 20s linear infinite;
        }
        
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(147, 51, 234, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.08) 1px, transparent 1px);
          background-size: 50px 50px;
          width: 100%;
          height: 100%;
        }
        
        .metal-text {
          background: linear-gradient(
            135deg,
            #b8bcc8 0%,
            #ffffff 20%,
            #e8eaed 40%,
            #ffffff 50%,
            #d1d5db 60%,
            #ffffff 80%,
            #9ca3af 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 
            0 2px 10px rgba(255, 255, 255, 0.3),
            0 0 20px rgba(255, 255, 255, 0.2);
          position: relative;
          animation: shine 3s ease-in-out infinite;
        }
        
        @keyframes shine {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;