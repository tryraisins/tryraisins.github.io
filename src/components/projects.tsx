import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import ProjectCard from '../utils/projectCard';
import { useInView } from 'react-intersection-observer';

import faceidImage from '../assets/images/faceid.jpg';
import issTrackerImage from '../assets/images/iss-tracker.png';
import expenseImage from '../assets/images/expenses.png';
import portfolioV1Image from '../assets/images/portfolio-v1.png';
import echolistImgae from '../assets/images/echolist.png';
import billQuickImage from '../assets/images/bill-quick.png';

const Projects: React.FC = () => {
   const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
      });
  return (
    <section 
      id="projects" 
      ref={ref} 
      className={`py-20 px-4 bg-gray-800 text-gray-100 transition-opacity duration-1000 transform
        ${inView ? 'opacity-100 translate-y-0 animate-fade-in-section' : 'opacity-0 translate-y-10'}
      `}
      style={{
        // Prevent unwanted text selection on mobile
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <div className="container mx-auto">
        <SectionTitle>My Projects</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <ProjectCard
            imageSrc={faceidImage}
            title="Face Detection App"
            description="A react app with a sample login page that detect the faces on any image captured via camera and tried to guess the users age and facial expression"
            liveLink="https://faceid.netlify.app/"
          />
          <ProjectCard
            imageSrc={issTrackerImage}
            title="International Space Station Tracker V2.0"
            description="A simple app that fetches the current location of the International Space Staion. It also shows the number of people in space at the moment, who they are and where they are."
            liveLink="https://isstracker.tryraisins.dev/"
          />
          <ProjectCard
            imageSrc={echolistImgae}
            title="Echo List"
            description="A tool to Seamlessly convert your Shazam discoveries into curated YouTube playlists."
            liveLink="https://echolist.tryraisins.dev/"
          />
          <ProjectCard
            imageSrc={expenseImage}
            title="SpendEx (Expense Manager)"
            description="A comprehensive expense tracking web app that helps users manage their spending across multiple currencies with analytics, reporting, and customization features"
            liveLink="https://spendex.tryraisins.dev/"
          />
          <ProjectCard
            imageSrc={billQuickImage}
            title="QuickBillz (Invoice Generator)"
            description="A web app that allows users to quickly generate bills and invoices in minutes for free. Pro services to be included gradually."
            liveLink="https://quickbillz.tryraisins.dev/"
          />
          <ProjectCard
            imageSrc={portfolioV1Image}
            title="Portfolio Website V1"
            description="The first iteration of my personal portfolio, showcasing my growth/ subtle changes. Built with ParcelJS"
            liveLink="https://tryraisinsfolio.netlify.app/"
          />
        </div>
      </div>
    </section>
  );
};

export default Projects;