import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import About from './components/about';
import Skills from './components/skills';
import Projects from './components/projects';
import Contact from './components/contact';
import Footer from './components/footer';
import { ParallaxProvider } from 'react-scroll-parallax';

const App: React.FC = () => {
  return (
    <ParallaxProvider>
    <div className="min-h-screen bg-gray-900 text-gray-100">
        <style>{`
          @keyframes fadeInSection {
            from {
              opacity: 0;
              transform: translateY(50px); /* Starts 50px below */
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInItem {
            from {
              opacity: 0;
              transform: translateY(20px); /* Starts 20px below */
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-section {
              animation: fadeInSection 1s ease-out forwards;
          }
          .animate-fade-in-item {
              animation: fadeInItem 0.7s ease-out forwards; /* Slightly faster for individual items */
          }
        `}</style>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
    </ParallaxProvider>
  );
};

export default App;
