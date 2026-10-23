// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgBlur } from 'src/theme/css';
// routes
import { paths } from 'src/routes/paths';
// components
import Logo from 'src/components/logo';
import Label from 'src/components/label';
//
import { COLORS, HEADER } from '../config-layout';
import { welcomeNavConfig } from './config-navigation';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
//
import { SettingsButton, HeaderShadow, LoginButton } from '../_common';
import { display, width } from '@mui/system';
import zIndex from '@mui/material/styles/zIndex';
import { useAuthContext } from 'src/auth/hooks';
import WelcomeNavDesktop from './nav/desktop/welcome-nav-desktop';

// ----------------------------------------------------------------------

export default function WelcomeHeader({ handleExperienceClick, handleUsClick, handleServiceClick, handleContactUsClick, handleProjectClick }) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  const logoSize = mdUp ? 160 : 100;

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          backgroundColor: COLORS.HeaderBg,
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.W_H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          // ...(offsetTop && {
          //   ...bgBlur({
          //     color: 'white',
          //   }),
          //   height: {
          //     md: HEADER.H_DESKTOP_OFFSET,
          //   },
          // }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          {!mdUp && <NavMobile offsetTop={offsetTop} data={welcomeNavConfig} notShowLogin={true} handleExperienceClick={handleExperienceClick} handleUsClick={handleUsClick} handleServiceClick={handleServiceClick} handleContactUsClick={handleContactUsClick} handleProjectClick={handleProjectClick} />}
          {!mdUp && <div
            style={{
              width: '25px',
            }}
          ></div>
          }
          {/* <Badge
            sx={{
              [`& .${badgeClasses.badge}`]: {
                top: 8,
                right: -16,
              },
            }}
            badgeContent={
              <Link
                href={paths.changelog}
                target="_blank"
                rel="noopener"
                underline="none"
                sx={{ ml: 1 }}
              >
                <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 0.5 }}>
                  v5.3.0
                </Label>
              </Link>
            }
          >
            
          </Badge> */}


          <Logo
            imageSrc='/logo/logo.svg'
            size={logoSize}
          />

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <WelcomeNavDesktop offsetTop={offsetTop} data={welcomeNavConfig} handleExperienceClick={handleExperienceClick} handleUsClick={handleUsClick} handleServiceClick={handleServiceClick} handleContactUsClick={handleContactUsClick} handleProjectClick={handleProjectClick} />}

        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
