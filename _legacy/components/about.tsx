import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import { useInView } from 'react-intersection-observer';


const About: React.FC = () => {
  const { ref, inView } = useInView({
      triggerOnce: true, // Animation only plays once when it enters the viewport
      threshold: 0.5,    // Element is 50% visible
    });
  
  return (
    <section id="about" ref={ref} className={`py-20 px-4 bg-gray-800 text-gray-100 transition-opacity duration-1000 transform
        ${inView ? 'opacity-100 translate-y-0 animate-fade-in-section' : 'opacity-0 translate-y-10'}
      `}>

      <div className="container mx-auto">
        <SectionTitle>About Me</SectionTitle>

        <div className="flex flex-col md:flex-row items-center md:space-x-12">
       

          {/* Content Section */}
          <div className="md:w-2/3 text-lg leading-relaxed text-center mx-auto">
            <p className="mb-6 text-gray-100">
              Hello! I'm <span className="font-semibold text-purple-400">Oluwaseun Sowemimo</span>, a passionate Frontend Web Developer with professional experience across multiple industries. I bring expertise in design, development, testing, and maintenance of web systems, with proficiency in React, TypeScript, JQuery, Python, and other modern web technologies.
            </p>
            
            <p className="mb-6 text-gray-200">
              Currently at <span className="bg-gray-700 px-2 py-1 rounded text-gray-300">[REDACTED]</span>, I develop web applications using React, TypeScript, Python and Node.js while implementing enterprise solutions including low-code platforms and Azure functions. Previously at <span className="bg-gray-700 px-2 py-1 rounded text-gray-300">[REDACTED]</span>, I built client websites using modern web stacks, translating business requirements into technical solutions.
            </p>
            
            <div className="mb-6">
              <p className="mb-4 text-gray-200">My technical toolkit includes:</p>
              <div className="bg-gray-700/30 rounded-lg p-4 backdrop-blur-sm border border-gray-600/50">
                <ul className="list-none space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <strong className="text-purple-300">Frontend:</strong> React, TypeScript, JavaScript, jQuery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <strong className="text-blue-300">Backend:</strong> Node.js, Python, Azure Functions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <strong className="text-green-300">Tools:</strong> GitHub, CI/CD platforms, MongoDB
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <strong className="text-orange-300">Enterprise:</strong> Low-code platforms, workflow automation, Microsoft Enterprise Solutions
                  </li>
                </ul>
              </div>
            </div>
          
            
            <div className="flex flex-wrap justify-center  gap-4">
              <a href="mailto:tryraisins@gmail.com" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                Email Me
              </a>
              <a href="https://github.com/tryraisins" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-purple-600 hover:bg-purple-600/20 rounded-lg transition-colors duration-300">
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