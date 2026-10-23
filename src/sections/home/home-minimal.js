import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { COLORS } from 'src/layouts/config-layout';
import Button from '@mui/material/Button';

const CARDS = [
  {
    icon: '/assets/icons/home/ic_make_brand.svg',
    title: 'Branding',
    description: 'Consistent design makes it easy to brand your own.',
  },
  {
    icon: '/assets/icons/home/ic_design.svg',
    title: 'UI & UX Design',
    description:
      'The kit is built on the principles of the atomic design system. It helps you to create projects fastest and easily customized packages for your projects.',
  },
  {
    icon: '/assets/icons/home/ic_development.svg',
    title: 'Development',
    description: 'Easy to customize and extend, saving you time and money.',
  },
];

export default function HomeMinimal({ handleExperienceClick }) {
  return (
    <Container
      sx={{
        py: { xs: 8, md: 15 },
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Responsive direction
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 4, md: 8 }, // Space between text and video sections
        }}
      >
        {/* Text Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: { xs: '1', md: '0.5' },
            textAlign: { xs: 'center', md: 'left' }, // Center text on mobile
            paddingTop: '40px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: COLORS.Primary,
              pb: 2,

            }}
          >
            ҮНЭГҮЙ ЗЭЭЛИЙН СИСТЕМ
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: COLORS.Primary,
              fontWeight: 'bold',
              pb: 4,
            }}
          >
            “ХУРГАН ЗЭЭЛ”
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: COLORS.Secondary,
              pb: 4,
              lineHeight: 1.5,
            }}
          >
            Khurganzeel бол ББСБ, Барьцаалан зээлдүүлэх газар болон бүх төрлийн зээлийн үйл ажиллагаа явуулдаг нэгжүүдэд зориулсан үнэ төлбөргүй систем юм.
          </Typography>
          <Button
            variant="contained"
            target="_blank"
            rel="noopener"
            href={'/auth/jwt/register/'}
            sx={{
              backgroundColor: COLORS.Third,
              color: 'white',
              width: { xs: '100%', sm: '350px' },
              alignSelf: { xs: 'start', sm: 'center' },
              height: '40px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 300,
              '&:hover': {
                backgroundColor: COLORS.Third,
                opacity: 0.5,
              },
            }}
          >
            Энд дарж системд үнэгүй бүртгүүлээрэй
          </Button>
        </Box>

        {/* Spacer for Mobile */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, width: '50px' }} />

        {/* Video Section */}
        <Box
          sx={{
            flex: { xs: '1', md: '0.5' },
            width: '100%',
            maxWidth: '600px',
            height: { xs: 'auto', md: '400px' },
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <video
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            controls
          >
            <source src="/videos/help.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </Box>
    </Container>
  );
}
