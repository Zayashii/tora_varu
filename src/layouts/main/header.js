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
import { navConfig } from './config-navigation';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
//
import { SettingsButton, HeaderShadow, LoginButton } from '../_common';
import { display, width } from '@mui/system';
import zIndex from '@mui/material/styles/zIndex';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function Header({ handleExperienceClick, handleIntroClick, handleServiceClick }) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          backgroundColor: "white",
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
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
          {!mdUp && <NavMobile offsetTop={offsetTop} data={navConfig} />}
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

          <div
            style={{
              backgroundColor: COLORS.Primary,
              width: '120px',
              height: HEADER.H_DESKTOP,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0 0 20px 20px'
            }}
          >
            <Logo
              imageSrc='/logo/new_icon.svg'
              size={60}
            />
          </div>

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop offsetTop={offsetTop} data={navConfig} handleExperienceClick={handleExperienceClick} handleIntroClick={handleIntroClick} handleServiceClick={handleServiceClick} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            {mdUp && <Button variant="contained" rel="noopener" href={paths.auth.jwt.register}
              sx={{
                backgroundColor: COLORS.Third,
                color: 'white',
                width: '120px',
                height: '35px',
                borderRadius: '20px 20px 20px 20px',
                fontSize: '11px',
                fontWeight: 'bold',
                // fontFamily: 'Open Sans Condensed", sans-serif',
                '&:hover': {
                  backgroundColor: COLORS.Third,
                  color: 'white',
                  boxShadow: 'none',
                  borderColor: 'transparent',
                  opacity: 0.5,
                },
              }}
            >
              БҮРТГҮҮЛЭХ
            </Button>}

            {mdUp && <LoginButton sx={{ mr: 2, }} />}

            {/* <SettingsButton
              sx={{
                ml: { xs: 1, md: 0 },
                mr: { md: 2 },
              }}
            /> */}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
