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
    <div className="min-h-screen bg-gray-900 font-sans text-gray-100">
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
