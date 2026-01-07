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
      <div className="min-h-screen relative overflow-hidden">
        {/* Global Atmospheric Background */}
        <div className="fixed inset-0 atmosphere-gradient pointer-events-none" />

        {/* Organic Flow Animation Layer */}
        <div className="fixed inset-0 organic-flow pointer-events-none" />

        {/* Grain Texture Overlay */}
        <div className="fixed inset-0 grain-overlay pointer-events-none" />

        {/* Dot Pattern Layer */}
        <div className="fixed inset-0 dot-pattern opacity-30 pointer-events-none" />

        {/* Main Content */}
        <div className="relative z-10">
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
      </div>
    </ParallaxProvider>
  );
};

export default App;
