import React from 'react';
import { useInView } from 'react-intersection-observer';
const Hero: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Animation only plays once when it enters the viewport
    threshold: 0.2,    // Element is 20% visible
  });

  return (
    <section
      id="home"
      ref={ref}
      className={`relative h-screen flex items-center justify-center text-white overflow-hidden transition-opacity duration-1000 transform
        ${inView ? 'opacity-100 translate-y-0 animate-fade-in-section' : 'opacity-0 translate-y-10'}
      `}
      style={{ background: 'linear-gradient(135deg, #111828 0%, #202938 100%)' }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/8 to-transparent animate-slide-right"></div>
        <div className="grid-pattern"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border-2 border-purple-400/20 rotate-45 animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-blue-400/15 to-purple-400/15 animate-float-delayed"></div>
      <div className="absolute bottom-32 left-1/4 w-12 h-12 border border-purple-300/25 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-1/3 w-8 h-20 bg-gradient-to-t from-purple-400/20 to-transparent animate-float-slow"></div>

      {/* Subtle Light Rays */}
      <div className="absolute top-0 left-1/2 w-1 h-32 bg-gradient-to-b from-purple-400/30 to-transparent animate-pulse"></div>
      <div
        className="absolute top-20 right-1/4 w-1 h-24 bg-gradient-to-b from-blue-400/25 to-transparent animate-pulse"
        style={{ animationDelay: '1s' }}
      ></div>

      <div className="text-center z-10 p-4 animate-fade-in-up">
        <p className="text-xl md:text-2xl text-gray-300 mb-4">Hello, I'm</p>
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 leading-tight">
          Seun Sowemimo
        </h1>
        <p className="text-2xl md:text-3xl text-gray-400 mb-8">A Fullstack Web Developer</p>
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-purple-500/25 hover:shadow-xl"
        >
          View My Work
        </a>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes floatDelayed {
          0%, 100% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-15px) rotate(225deg);
          }
        }
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes slideRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatDelayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-slow {
          animation: floatSlow 10s ease-in-out infinite;
          animation-delay: 4s;
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
      `}</style>
    </section>
  );
};

export default Hero;