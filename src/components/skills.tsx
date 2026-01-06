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
      bgColor: "bg-blue-500",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/30"
    },
    {
      icon: Server,
      title: "Backend Integration",
      description: "Node.js, Python, REST APIs, Azure Functions, MongoDB, API integration",
      bgColor: "bg-emerald-500",
      textColor: "text-emerald-500",
      borderColor: "border-emerald-500/30"
    },
    {
      icon: Cloud,
      title: "Cloud & Deployment",
      description: "Vercel, MongoDB, Cloudflare, Netlify, CI/CD pipelines, cloud functions",
      bgColor: "bg-cyan-500",
      textColor: "text-cyan-500",
      borderColor: "border-cyan-500/30"
    },
    {
      icon: Briefcase,
      title: "Enterprise Solutions",
      description: "Power Apps, Power Automate, SharePoint, workflow automation",
      bgColor: "bg-amber-500",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/30"
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description: "Git, GitHub, collaborative development, code reviews",
      bgColor: "bg-slate-500",
      textColor: "text-slate-500",
      borderColor: "border-slate-500/30"
    },
    {
      icon: Zap,
      title: "Testing & Optimization",
      description: "Debugging, performance optimization, bottleneck identification",
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-500",
      borderColor: "border-yellow-500/30"
    },
    {
      icon: Smartphone,
      title: "UI/UX Implementation",
      description: "Translating designs to code, user-centered interfaces, accessibility",
      bgColor: "bg-rose-500",
      textColor: "text-rose-500",
      borderColor: "border-rose-500/30"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "MongoDB databases, SharePoint lists, large data processing",
      bgColor: "bg-indigo-500",
      textColor: "text-indigo-500",
      borderColor: "border-indigo-500/30"
    },
    {
      icon: Cpu,
      title: "Problem Solving",
      description: "Analytical thinking, solution architecture, technical troubleshooting",
      bgColor: "bg-teal-500",
      textColor: "text-teal-500",
      borderColor: "border-teal-500/30"
    }
  ];
   const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
      });

  return (
    <section id="skills" ref={ref} className={`relative py-20 px-4 bg-slate-900 text-slate-100 overflow-hidden transition-opacity duration-1000 transform
        ${inView ? 'opacity-100 translate-y-0 animate-fade-in-section' : 'opacity-0 translate-y-10'}
      `}>
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionTitle>My Skills</SectionTitle>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit of technologies and expertise I bring to every project
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              className={`group relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border ${skill.borderColor} hover:border-opacity-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl`}
            >
              {/* Card glow effect */}
              <div className={`absolute inset-0 ${skill.bgColor} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icon container */}
              <div className={`relative w-16 h-16 mb-6 rounded-xl ${skill.bgColor} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center">
                  <skill.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-white transition-colors duration-300">
                  {skill.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors duration-300">
                  {skill.description}
                </p>
              </div>
              
              {/* Hover indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${skill.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`}></div>
            </div>
          ))}
        </div>
        
        {/* Bottom decoration */}
        {/* <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/30 backdrop-blur-sm rounded-full border border-slate-700/50">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-slate-300 font-medium">Always learning and evolving</span>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Skills;