import React, { useState, useEffect, useRef } from 'react';
import { Home, User, Code, Briefcase, Mail, Menu, X, Github, Linkedin, ExternalLink } from 'lucide-react';
import SectionTitle from './utils/sectionTitle'; 

// Define types for props and state
interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}

interface SkillCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  description: string;
  liveLink?: string;
  githubLink?: string;
}

// --- Utility Components (SectionTitle is now in its own file) ---

const NavLink: React.FC<NavLinkProps> = ({ to, label, icon: Icon, onClick }) => (
  <a
    href={`#${to}`}
    onClick={onClick}
    className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-gray-800"
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </a>
);

// --- Main Layout Components ---

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // Close mobile menu after clicking a link
    }
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navRef]);

  return (
    <nav ref={navRef} className="bg-gray-900 bg-opacity-90 backdrop-blur-sm fixed w-full z-50 shadow-lg top-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-purple-500">
          M.
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 hover:text-purple-400 focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        <div className={`md:flex ${isOpen ? 'block' : 'hidden'} absolute md:static top-full left-0 w-full md:w-auto bg-gray-900 md:bg-transparent shadow-lg md:shadow-none py-4 md:py-0`}>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 px-4 md:px-0">
            <NavLink to="home" label="Home" icon={Home} onClick={() => scrollToSection('home')} />
            <NavLink to="about" label="About" icon={User} onClick={() => scrollToSection('about')} />
            <NavLink to="skills" label="Skills" icon={Code} onClick={() => scrollToSection('skills')} />
            <NavLink to="projects" label="Projects" icon={Briefcase} onClick={() => scrollToSection('projects')} />
            <NavLink to="contact" label="Contact" icon={Mail} onClick={() => scrollToSection('contact')} />
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Background circles for visual interest */}
      <div className="absolute w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob top-10 left-20"></div>
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 bottom-10 right-20"></div>
      <div className="absolute w-56 h-56 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 top-40 right-10"></div>

      <div className="text-center z-10 p-4 animate-fade-in-up">
        <p className="text-xl md:text-2xl text-gray-300 mb-4">Hello, I'm</p>
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 leading-tight">
          M. Developer
        </h1>
        <p className="text-2xl md:text-3xl text-gray-400 mb-8">A Passionate Web Developer</p>
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          View My Work
        </a>
      </div>

      {/* Tailwind CSS keyframes for animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
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
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.6, 0.2, 0.4, 0.8);
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 bg-gray-800 text-gray-100">
      <div className="container mx-auto">
        <SectionTitle>About Me</SectionTitle> {/* Using the imported SectionTitle */}
        <div className="flex flex-col md:flex-row items-center md:space-x-12">
          <div className="md:w-1/3 mb-8 md:mb-0 transform hover:scale-105 transition-transform duration-300">
            <img
              src="https://placehold.co/400x400/374151/D1D5DB?text=Profile+Picture"
              alt="Profile"
              className="rounded-full w-64 h-64 object-cover mx-auto shadow-xl border-4 border-purple-600"
            />
          </div>
          <div className="md:w-2/3 text-lg leading-relaxed text-center md:text-left">
            <p className="mb-4">
              Hello! I'm M., a passionate and dedicated web developer with a knack for creating dynamic, responsive, and user-friendly web applications. My journey into the world of coding began with a fascination for how digital experiences are built, and it has since evolved into a commitment to crafting elegant and efficient solutions.
            </p>
            <p className="mb-4">
              I specialize in front-end development, bringing designs to life with clean code and modern frameworks. I'm always eager to learn new technologies and improve my craft, ensuring that I deliver high-quality, scalable, and maintainable code.
            </p>
            <p>
              When I'm not coding, you can find me exploring new tech trends, contributing to open-source projects, or enjoying a good book. I believe in continuous learning and the power of collaboration to build amazing things. Let's connect and create something impactful!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillCard: React.FC<SkillCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-700 p-8 rounded-lg shadow-xl flex flex-col items-center text-center transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-purple-600">
    <div className="text-purple-400 mb-4">
      <Icon size={60} strokeWidth={1.5} />
    </div>
    <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 px-4 bg-gray-900 text-gray-100">
      <div className="container mx-auto">
        <SectionTitle>My Skills</SectionTitle> {/* Using the imported SectionTitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <SkillCard
            icon={Code}
            title="Front-end Development"
            description="Proficient in HTML, CSS, JavaScript, React, and modern front-end frameworks to build engaging user interfaces."
          />
          <SkillCard
            icon={Briefcase}
            title="UI/UX Design"
            description="Understanding of user experience principles and user interface design to create intuitive and aesthetically pleasing applications."
          />
          <SkillCard
            icon={Code}
            title="Responsive Design"
            description="Expertise in creating layouts that adapt seamlessly to various screen sizes and devices, ensuring optimal user experience."
          />
          <SkillCard
            icon={Code}
            title="Version Control (Git)"
            description="Experienced in using Git and GitHub for collaborative development, code management, and version control."
          />
          <SkillCard
            icon={Code}
            title="API Integration"
            description="Skilled in consuming and integrating RESTful APIs to connect front-end applications with back-end services."
          />
          <SkillCard
            icon={Code}
            title="Problem Solving"
            description="Strong analytical and problem-solving skills, with a methodical approach to debugging and optimizing code."
          />
        </div>
      </div>
    </section>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ imageSrc, title, description, liveLink, githubLink }) => (
  <div className="bg-gray-700 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 group">
    <img
      src={imageSrc}
      alt={title}
      className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity duration-300"
      onError={(e) => {
        (e.target as HTMLImageElement).onerror = null;
        (e.target as HTMLImageElement).src = `https://placehold.co/600x400/4B5563/F9FAFB?text=${encodeURIComponent(title)}`;
      }}
    />
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="flex flex-wrap gap-4">
        {liveLink && (
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-300"
          >
            <ExternalLink size={20} />
            <span>Live Demo</span>
          </a>
        )}
        {githubLink && (
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-300"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
        )}
      </div>
    </div>
  </div>
);

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 px-4 bg-gray-800 text-gray-100">
      <div className="container mx-auto">
        <SectionTitle>My Projects</SectionTitle> {/* Using the imported SectionTitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <ProjectCard
            imageSrc="https://placehold.co/600x400/4B5563/F9FAFB?text=Project+1+Image"
            title="E-commerce Storefront"
            description="A responsive e-commerce application built with React and a mock API, featuring product listings, cart management, and user authentication."
            liveLink="#"
            githubLink="#"
          />
          <ProjectCard
            imageSrc="https://placehold.co/600x400/4B5563/F9FAFB?text=Project+2+Image"
            title="Task Management App"
            description="A full-stack task management application with real-time updates, user roles, and drag-and-drop functionality for tasks."
            liveLink="#"
            githubLink="#"
          />
          <ProjectCard
            imageSrc="https://placehold.co/600x400/4B5563/F9FAFB?text=Project+3+Image"
            title="Weather Dashboard"
            description="An interactive weather dashboard fetching real-time weather data from a third-party API, displaying current conditions and forecasts."
            liveLink="#"
            githubLink="#"
          />
          <ProjectCard
            imageSrc="https://placehold.co/600x400/4B5563/F9FAFB?text=Project+4+Image"
            title="Personal Blog Platform"
            description="A minimalist blog platform allowing users to create, edit, and publish posts with rich text editing capabilities."
            liveLink="#"
            githubLink="#"
          />
          <ProjectCard
            imageSrc="https://placehold.co/600x400/4B5563/F9FAFB?text=Project+5+Image"
            title="Recipe Finder App"
            description="An application that helps users discover recipes based on available ingredients, with search and filter functionalities."
            liveLink="#"
            githubLink="#"
          />
          <ProjectCard
            imageSrc="https://placehold.co/600x400/4B5563/F9FAFB?text=Project+6+Image"
            title="Portfolio Website V2"
            description="The second iteration of my personal portfolio, showcasing my latest skills and projects with a modern design and improved performance."
            liveLink="#"
            githubLink="#"
          />
        </div>
      </div>
    </section>
  );
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // In a real Next.js app, you'd send this to an API route.
    // Here, we'll simulate a submission.
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form Data Submitted:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-gray-900 text-gray-100">
      <div className="container mx-auto max-w-2xl">
        <SectionTitle>Get In Touch</SectionTitle> {/* Using the imported SectionTitle */}
        <p className="text-center text-lg mb-10 text-gray-300">
          Have a question or want to work together? Feel free to reach out!
        </p>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700 transition-colors duration-200"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700 transition-colors duration-200"
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div className="mb-8">
            <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700 transition-colors duration-200 resize-y"
              placeholder="Your message here..."
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' && (
              <p className="text-green-400 text-sm font-semibold">Message sent successfully!</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm font-semibold">Failed to send message. Please try again.</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 py-10 px-4 text-gray-400 text-center">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-6 mb-6">
          <a
            href="https://github.com/tryraisins" // Replace with your GitHub
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-500 transition-colors duration-300"
            aria-label="GitHub Profile"
          >
            <Github size={28} />
          </a>
          <a
            href="https://linkedin.com/in/yourprofile" // Replace with your LinkedIn
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={28} />
          </a>
          {/* Add more social links as needed */}
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} M. Developer. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Built with React and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  return (
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
  );
};

export default App;
