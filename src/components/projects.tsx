import React from 'react';
import SectionTitle from '../utils/sectionTitle';
import ProjectCard from '../utils/projectCard';
import { useInView } from 'react-intersection-observer';


import faceidImage from '../assets/images/faceid.jpg';
// import yeknalBakeryImage from '../assets/images/yeknal-bakery.png';
// import issTrackerImage from '../assets/images/iss-tracker.jpg';
import issTrackerImage from '../assets/images/iss-tracker.png';
import expenseImage from '../assets/images/expense.jpg';
import roboYearbookImage from '../assets/images/Robo-Yearbook.jpg';
import portfolioV1Image from '../assets/images/portfolio-v1.png';
import echolistImgae from '../assets/images/echolist.png';
import billQuickImage from '../assets/images/bill-quick.png';

const Projects: React.FC = () => {
   const { ref, inView } = useInView({
        triggerOnce: true, // Animation only plays once when it enters the viewport
        threshold: 0.1,    // Element is 35% visible
      });
  return (
    <section id="projects" ref={ref} className={`py-20 px-4 bg-gray-800 text-gray-100 transition-opacity duration-1000 transform
        ${inView ? 'opacity-100 translate-y-0 animate-fade-in-section' : 'opacity-0 translate-y-10'}
      `}>
      <div className="container mx-auto">
        <SectionTitle>My Projects</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <ProjectCard
            imageSrc={faceidImage}
            title="Face Detection App"
            description="A react app with a sample login page that detect the faces on any image captured via camera and tried to guess the users age and facial expression"
            liveLink="https://faceid.netlify.app/"
            // githubLink="#"
          />
          {/* <ProjectCard
            imageSrc={yeknalBakeryImage}
            title="Yeknal Bakery"
            description="A small bakery business site template built with Astro on ReactJS and Bootstrap."
            liveLink="https://yeknal-bakery.netlify.app/"
            // githubLink="#"
          /> */}
          <ProjectCard
            imageSrc={issTrackerImage}
            title="International Space Station Tracker V2.0"
            description="A simple app that fetches the current location of the International Space Staion. It also shows the number of people in space at the moment, who they are and where they are."
            liveLink="https://isstracker-v2.vercel.app/"
            // githubLink="https://github.com/tryraisins/iss-tracker-v2"
          />
          <ProjectCard
            imageSrc={echolistImgae}
            title="Echo List"
            description="A tool to Seamlessly convert your Shazam discoveries into curated YouTube playlists."
            liveLink="https://echolist.vercel.app/"
            // githubLink="https://github.com/tryraisins/shazam-to-youtube"
          />
          <ProjectCard
            imageSrc={expenseImage}
            title="Expenses Manager"
            description="A web app that allows employees view expenses made with the company's account and let's them add receipts, as well as, sort, filter and search through."
            liveLink="https://expenses-manager1.netlify.app/"
            // githubLink="#"
          />
          {/* <ProjectCard
            imageSrc={roboYearbookImage}
            title="Robo Yearbook"
            description="A simple react app that fetches data from a server and uses it to create and display an output of 10 'cards', each with an image, name and email. It also has a search function that filters through the cards."
            liveLink="https://robo-yearbook.netlify.app/"
            // githubLink="#"
          /> */}
           <ProjectCard
            imageSrc={billQuickImage}
            title="Bill Quick"
            description="A web app that allows users to quickly generate bills and invoices in minutes for free. Pro services to be included gradually. "
            liveLink="https://billquick.vercel.app/"
            // githubLink="#"
          />
          <ProjectCard
            imageSrc={portfolioV1Image}
            title="Portfolio Website V1"
            description="The first iteration of my personal portfolio, showcasing my growth/ subtle changes. Built with ParcelJS"
            liveLink="https://tryraisinsfolio.netlify.app/"
            githubLink="https://github.com/tryraisins/portfolio-V1"
          />
        </div>
      </div>
    </section>
  );
};

export default Projects;