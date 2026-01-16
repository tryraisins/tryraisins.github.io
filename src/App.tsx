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
        {/* Skip to Content Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#ff6b4a] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Skip to main content
        </a>

        {/* Global Atmospheric Background */}
        <div className="fixed inset-0 atmosphere-gradient pointer-events-none" aria-hidden="true" />

        {/* Organic Flow Animation Layer */}
        <div className="fixed inset-0 organic-flow pointer-events-none" aria-hidden="true" />

        {/* Grain Texture Overlay */}
        <div className="fixed inset-0 grain-overlay pointer-events-none" aria-hidden="true" />

        {/* Dot Pattern Layer */}
        <div className="fixed inset-0 dot-pattern opacity-30 pointer-events-none" aria-hidden="true" />

        {/* Main Content */}
        <div className="relative z-10">
          <Navbar />
          <main id="main-content" role="main" aria-label="Main content">
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
