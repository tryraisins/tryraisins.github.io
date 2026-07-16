import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import { 
  Briefcase, 
  Cpu, 
  Database, 
  GitBranch, 
  Cloud, 
  Zap,
  Layout,
  Smartphone,
  Server
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Skills: React.FC = () => {
  const skillsData = [
    {
      icon: Layout,
      title: "Frontend Development",
      description: "React, TypeScript, JavaScript, jQuery, HTML5, CSS3, TailwindCSS, Bootstrap 5, Astro JS, Vue JS, responsive web design",
      gradient: "from-blue-500 to-purple-600",
      shadowColor: "shadow-blue-500/20"
    },
    {
      icon: Server,
      title: "Backend Integration",
      description: "Node.js, Python, REST APIs, Azure Functions, MongoDB, API integration",
      gradient: "from-green-500 to-emerald-600",
      shadowColor: "shadow-green-500/20"
    },
    {
      icon: Cloud,
      title: "Cloud & Deployment",
      description: "Vercel, MongoDB, Cloudflare, Netlify, CI/CD pipelines, cloud functions",
      gradient: "from-cyan-500 to-blue-600",
      shadowColor: "shadow-cyan-500/20"
    },
    {
      icon: Briefcase,
      title: "Enterprise Solutions",
      description: "Power Apps, Power Automate, SharePoint, workflow automation",
      gradient: "from-orange-500 to-red-600",
      shadowColor: "shadow-orange-500/20"
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description: "Git, GitHub, collaborative development, code reviews",
      gradient: "from-purple-500 to-pink-600",
      shadowColor: "shadow-purple-500/20"
    },
    {
      icon: Zap,
      title: "Testing & Optimization",
      description: "Debugging, performance optimization, bottleneck identification",
      gradient: "from-yellow-500 to-orange-600",
      shadowColor: "shadow-yellow-500/20"
    },
    {
      icon: Smartphone,
      title: "UI/UX Implementation",
      description: "Translating designs to code, user-centered interfaces, accessibility",
      gradient: "from-pink-500 to-rose-600",
      shadowColor: "shadow-pink-500/20"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "MongoDB databases, SharePoint lists, large data processing",
      gradient: "from-indigo-500 to-purple-600",
      shadowColor: "shadow-indigo-500/20"
    },
    {
      icon: Cpu,
      title: "Problem Solving",
      description: "Analytical thinking, solution architecture, technical troubleshooting",
      gradient: "from-emerald-500 to-teal-600",
      shadowColor: "shadow-emerald-500/20"
    }
  ];
   const { ref, inView } = useInView({
        triggerOnce: true, // Animation only plays once when it enters the viewport
        threshold: 0.1,    // Element is 35% visible
      });

  return (
    <section id="skills" ref={ref} className={`relative py-20 px-4 bg-gray-900 text-gray-100 overflow-hidden transition-opacity duration-1000 transform
        ${inView ? 'opacity-100 translate-y-0 animate-fade-in-section' : 'opacity-0 translate-y-10'}
      `}>
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionTitle>My Skills</SectionTitle>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit of technologies and expertise I bring to every project
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              className={`group relative p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:-translate-y-2 ${skill.shadowColor} hover:shadow-2xl`}
            >
              {/* Card glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${skill.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icon container */}
              <div className={`relative w-16 h-16 mb-6 rounded-xl bg-gradient-to-r ${skill.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center">
                  <skill.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-white transition-colors duration-300">
                  {skill.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">
                  {skill.description}
                </p>
              </div>
              
              {/* Hover indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${skill.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`}></div>
            </div>
          ))}
        </div>
        
        {/* Bottom decoration */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/30 backdrop-blur-sm rounded-full border border-gray-700/50">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-300 font-medium">Always learning and evolving</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;