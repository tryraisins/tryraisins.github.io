import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import { useInView } from 'react-intersection-observer';


const About: React.FC = () => {
  const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.5,
    });
  
  return (
    <section id="about" ref={ref} className={`py-20 px-4 bg-slate-800 text-slate-100 transition-opacity duration-1000 transform
        ${inView ? 'opacity-100 translate-y-0 animate-fade-in-section' : 'opacity-0 translate-y-10'}
      `}>

      <div className="container mx-auto">
        <SectionTitle>About Me</SectionTitle>

        <div className="flex flex-col md:flex-row items-center md:space-x-12">
       

          {/* Content Section */}
          <div className="md:w-2/3 text-lg leading-relaxed text-center mx-auto">
            <p className="mb-6 text-slate-100">
              Hello! I'm <span className="font-semibold text-blue-400">Oluwaseun Sowemimo</span>, a passionate Frontend-focused Web Developer with professional experience across multiple industries. I bring expertise in design, development, testing, and maintenance of web systems, with proficiency in React, TypeScript, JQuery, Python, and other modern web technologies.
            </p>
            
            <p className="mb-6 text-slate-200">
              Currently at <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">[REDACTED]</span>, I develop web applications using React, TypeScript, Python and Node.js while implementing enterprise solutions including low-code platforms and Azure functions. Previously at <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">[REDACTED]</span>, I built client websites using modern web stacks, translating business requirements into technical solutions.
            </p>
            
            <div className="mb-6">
              <p className="mb-4 text-slate-200">My technical toolkit includes:</p>
              <div className="bg-slate-700/30 rounded-lg p-4 backdrop-blur-sm border border-slate-600/50">
               <ul className="list-none space-y-2 text-slate-300">
  <li className="flex items-center gap-2">
    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
    <strong className="text-blue-300">Frontend:</strong> React, TypeScript, JavaScript, jQuery
    <span className="flex-1 border-t border-slate-600/50 ml-4"></span>
  </li>
  <li className="flex items-center gap-2">
    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
    <strong className="text-emerald-300">Backend:</strong> Node.js, Python, Azure Functions
    <span className="flex-1 border-t border-slate-600/50 ml-4"></span>
  </li>
  <li className="flex items-center gap-2">
    <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
    <strong className="text-slate-300">Tools:</strong> GitHub, CI/CD platforms, MongoDB
    <span className="flex-1 border-t border-slate-600/50 ml-4"></span>
  </li>
  <li className="flex items-center gap-2">
    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
    <strong className="text-amber-300">Enterprise:</strong> Low-code platforms, workflow automation, Microsoft Enterprise Solutions
    <span className="flex-1 border-t border-slate-600/50 ml-4"></span>
  </li>
</ul>
              </div>
            </div>
          
            
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:tryraisins@gmail.com" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300 hover:shadow-lg hover:shadow-blue-500/25 text-white">
                Email Me
              </a>
              <a href="https://github.com/tryraisins" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-blue-600 hover:bg-blue-600/20 rounded-lg transition-colors duration-300 text-white">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;