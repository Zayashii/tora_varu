// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import { _socials } from 'src/_mock';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { COLORS } from '../config-layout';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Minimal',
    children: [
      { name: 'About us', href: paths.about },
      { name: 'Contact us', href: paths.contact },
      { name: 'FAQs', href: paths.faqs },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and Condition', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
  {
    headline: 'Contact',
    children: [{ name: 'support@minimals.cc', href: '#' }],
  },
];

// ----------------------------------------------------------------------

export default function WelcomeFooter() {
  const pathname = usePathname();

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: COLORS.Pink,
      }}
    >
      {/* <Divider /> */}

      <div
        sx={{
          pt: 1,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}

        style={{
          paddingTop: '20px',
          paddingBottom: '60px',
          textAlign: 'center',
          paddingLeft: '50px',
          paddingRight: '50px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Logo imageSrc="/assets/footer-red.svg" sx={{ mb: 3 }} />
        </Box>

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start' }}>
          {/* left 30% */}
          <div style={{ flex: '0 0 30%', display: 'flex', justifyContent: 'end', transform: 'rotate(180deg)', marginTop: '10px' }}>
            <Logo imageSrc="/assets/arrow-right.svg" size="55%" />
          </div>

          {/* middle 40% */}
          <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14, textAlign: 'center' }}>
              “Биднийн бизнесийг хөгжүүлэх шинэ санал санаачлaга таны болон бусдын саналаас илүү биш байж болно. Гэвч манай баг таны болон өөрсдийн гаргасан саналыг боловсруулж бодит бизнест нэвтрүүлэх эцсийн үр дүнд хүрэх амжилтаар үргэлж тэргүүлдэг.”
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14, textAlign: 'end' }}>
              <span style={{ fontWeight: 700 }}>“В.Балдандорж”</span> үүсгэн байгуулагч
            </Typography>
          </div>

          {/* right 30% */}
          <div style={{ flex: '0 0 30%', display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
            <Logo imageSrc="/assets/arrow-right.svg" size="55%" />
          </div>
        </div>




      </div>
    </Box>
  );

  return mainFooter;
}
