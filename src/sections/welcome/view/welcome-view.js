'use client';

// import '../../../app/use-tailwind.css'
import { useScroll } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// layouts
import WelcomeMainLayout from 'src/layouts/main/welcome-layout';
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import HomeHero from '../home-hero';
import HomeMinimal from '../welcome-us';
import HomePricing from '../home-pricing';
import HomeDarkMode from '../home-dark-mode';
import HomeLookingFor from '../home-looking-for';
import HomeForDesigner from '../home-for-designer';
import HomeColorPresets from '../home-color-presets';
import HomeAdvertisement from '../home-advertisement';
import HomeCleanInterfaces from '../home-clean-interfaces';
import HomePrice from '../project-drawing';
import { useRef } from 'react';
import { navConfig } from 'src/layouts/main/config-navigation';
import WelcomeUs from '../welcome-us';
import MainService from '../main-sevice';
import Founder from '../founder';
import ProjectDrawing from '../project-drawing';
import Projects from '../projects';
import DoneProjects from '../done-projects';
import OurSuccess from '../our-success';
import OurTeam from '../our-team';
import ContactUs from '../contact-us';
import ArrangeMeeting from '../arrange-meeting';

// ----------------------------------------------------------------------

const StyledPolygon = styled('div')(({ anchor = 'top', theme }) => ({
  left: 0,
  zIndex: 9,
  height: 80,
  width: '100%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  backgroundColor: theme.palette.background.default,
  display: 'block',
  lineHeight: 0,
  ...(anchor === 'top' && {
    top: -1,
    transform: 'scale(-1, -1)',
  }),
  ...(anchor === 'bottom' && {
    bottom: -1,
    backgroundColor: theme.palette.grey[900],
  }),
}));

// ----------------------------------------------------------------------

export default function WelcomeView() {
  const { scrollYProgress } = useScroll();

  const usRef = useRef(null);

  const handleUsClick = (event) => {
    event.preventDefault();
    if (usRef.current) {
      usRef.current.focus();

      const elementTop = usRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = -70;
      window.scrollTo({
        top: elementTop + offset,
        behavior: 'smooth',
      });
    }
  };


  const serviceRef = useRef(null);

  const handleServiceClick = (event) => {
    event.preventDefault();
    if (serviceRef.current) {
      serviceRef.current.focus();
      const elementTop = serviceRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = -70;
      window.scrollTo({
        top: elementTop + offset,
        behavior: 'smooth',
      });
    }
  };

  const experienceRef = useRef(null);

  const handleExperienceClick = (event) => {
    event.preventDefault();
    if (experienceRef.current) {
      experienceRef.current.focus();
      const elementTop = experienceRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = -70;
      window.scrollTo({
        top: elementTop + offset,
        behavior: 'smooth',
      });
    }
  };


  const contactUsRef = useRef(null);

  const handleContactUsClick = (event) => {
    event.preventDefault();
    if (contactUsRef.current) {
      contactUsRef.current.focus();
      const elementTop = contactUsRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = -110;
      window.scrollTo({
        top: elementTop + offset,
        behavior: 'smooth',
      });
    }
  };

  const projectRef = useRef(null);

  const handleProjectClick = (event) => {
    event.preventDefault();
    if (projectRef.current) {
      projectRef.current.focus();
      const elementTop = projectRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = -110;
      window.scrollTo({
        top: elementTop + offset,
        behavior: 'smooth',
      });
    }
  };



  return (
    <WelcomeMainLayout handleExperienceClick={handleExperienceClick} handleUsClick={handleUsClick} handleServiceClick={handleServiceClick} handleContactUsClick={handleContactUsClick} handleProjectClick={handleProjectClick}>
      {/* <ScrollProgress scrollYProgress={scrollYProgress} /> */}

      {/* <HomeHero /> */}

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        {/* <OurTeam introRef={introRef} /> */}

        <WelcomeUs usRef={usRef} />

        <MainService serviceRef={serviceRef} />

        <Founder guideRef={null} />

        <ProjectDrawing projectRef={projectRef} />

        <Projects experienceRef={experienceRef} />

        <DoneProjects introRef={null} />

        <OurSuccess introRef={null} />

        {/* <OurTeam introRef={introRef} /> */}

        <ArrangeMeeting introRef={null} />

        <ContactUs contactUsRef={contactUsRef} />

        {/* <Box sx={{ position: 'relative' }}>
          <StyledPolygon />
          <HomeForDesigner />
          <StyledPolygon anchor="bottom" />
        </Box>

        <HomeDarkMode />

        <HomeColorPresets />

        <HomeCleanInterfaces />

        <HomePricing />

        <HomeLookingFor />

        <HomeAdvertisement /> */}
      </Box>
    </WelcomeMainLayout>
  );
}
