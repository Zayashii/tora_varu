'use client';

// import '../../../app/use-tailwind.css'
import { useScroll } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// layouts
import MainLayout from 'src/layouts/main';
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import HomeHero from '../home-hero';
import HomeMinimal from '../home-minimal';
import HomePricing from '../home-pricing';
import HomeDarkMode from '../home-dark-mode';
import HomeLookingFor from '../home-looking-for';
import HomeForDesigner from '../home-for-designer';
import HomeColorPresets from '../home-color-presets';
import HomeAdvertisement from '../home-advertisement';
import HomeCleanInterfaces from '../home-clean-interfaces';
import HomeHugePackElements from '../home-hugepack-elements';
import HomeRegisterSteps from '../home-register-steps';
import HomePrice from '../home-price';
import { useRef } from 'react';
import { navConfig } from 'src/layouts/main/config-navigation';

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

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  const introRef = useRef(null);

  const handleIntroClick = (event) => {
    event.preventDefault();
    if (introRef.current) {
      introRef.current.focus();

      const elementTop = introRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = -40;
      window.scrollTo({
        top: elementTop + offset,
        behavior: 'smooth',
      });
    }
  };


  const guideRef = useRef(null);

  const handleServiceClick = (event) => {
    event.preventDefault();
    if (guideRef.current) {
      guideRef.current.focus();
      const elementTop = guideRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = -40;
      window.scrollTo({
        top: elementTop + offset,
        behavior: 'smooth',
      });
    }
  };

  const priceRef = useRef(null);

  const handleExperienceClick = (event) => {
    event.preventDefault();
    if (priceRef.current) {
      priceRef.current.focus();
      const elementTop = priceRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = -40;
      window.scrollTo({
        top: elementTop + offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <MainLayout handleExperienceClick={handleExperienceClick} handleIntroClick={handleIntroClick} handleServiceClick={handleServiceClick}>
      {/* <ScrollProgress scrollYProgress={scrollYProgress} /> */}

      {/* <HomeHero /> */}

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeMinimal />

        <HomeHugePackElements introRef={introRef} />

        <HomeRegisterSteps guideRef={guideRef} />

        <HomePrice priceRef={priceRef} />

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
    </MainLayout>
  );
}
