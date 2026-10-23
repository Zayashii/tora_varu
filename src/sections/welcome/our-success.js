// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _mock } from 'src/_mock';
// components
import { MotionViewport, varFade } from 'src/components/animate';
import { COLORS, HEADER } from 'src/layouts/config-layout';
import Logo from 'src/components/logo';
import { useRef, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Link } from '@mui/material';


// ----------------------------------------------------------------------

export default function OurSuccess({ introRef }) {
  const mdUp = useResponsive('up', 'md');
  const smUp = useResponsive('up', 'sm');
  const lgUp = useResponsive('up', 'lg');

  const textRef = useRef(null);

  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      console.log("zxc ===========> ", textRef.current.offsetWidth)
      setTextWidth(textRef.current.offsetWidth); // Get the width of the content
    }
  }, []);


  // New data source for the services grid (shown under the header)
  const data = [
    {
      icon: '/assets/completed-projects/erp.svg',
      title: 'Үйлдвэрлэл худалдааны салбарт ERP систем нэвтрүүлсэн',
      link: "https://ultimate.mn"
    },
    {
      icon: '/assets/completed-projects/fintec-system.svg',
      title: 'Санхүүгийн салбарт нэвтрүүлсэн финтек систем',
      link: "https://sono.mn/"
    },
    {
      icon: '/assets/completed-projects/khurga.svg',
      title: 'Өөрсдийн хөгжүүлж буй төсөл',
      link: "https://khurganzeel.mn/"
    },
  ];

  return (
    <div
      id='module-container'
      component={MotionViewport}
      style={{
        height: `100%`,
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: '40px', // Added bottom padding for mobile
      }}
      ref={introRef}
    >
      <div
        style={{
          height: '100%'
        }}>
        <div
          style={{
            position: 'relative'
          }}>
        </div>

        {/* Services section (header + video) */}
        <div
          id='services-section'
          style={{
            paddingTop: '60px',
            paddingBottom: '20px',
            paddingLeft: lgUp ? '120px' : smUp ? '40px' : '20px', // Adjusted to 20px on smallest screen
            paddingRight: lgUp ? '120px' : smUp ? '40px' : '20px', // Adjusted to 20px on smallest screen
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: mdUp ? '1fr 1fr' : '1fr', // 1 column on mobile
            gap: mdUp ? '14px' : '40px', // Increased vertical gap on mobile
          }}>
            {/* 1. Text Content Column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                textAlign: 'left',
                width: '100%',
                justifySelf: 'start',
                order: mdUp ? 1 : 1, // Always first
              }}
            >
              <div style={{ padding: '5px 15px', backgroundColor: COLORS.Orange, borderRadius: 25, }}>
                <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>Бидний амжилт</p>
              </div>

              <div style={{ height: '18px' }} />

              <p style={{ 
                color: 'black', 
                fontSize: mdUp ? '48px' : '32px', // Responsive font size
                fontWeight: 'bold',
                lineHeight: 1.2,
                margin: 0
              }}>
                Бид хамгийн том бизнес процесс дээр таван “core” бүхий ERP систем амжилттай нэвтрүүлсэн туршлагатай
              </p>

              <div style={{ height: '18px' }} />

              <p style={{ 
                color: '#111111', 
                fontSize: '14px',
                margin: 0,
                lineHeight: 1.6
              }}>
                “Биднийн бизнесийг хөгжүүлэх шинэ санал санаачлга таны болон бусдыг саналаас илүү биш байж болно. Гэвч манай баг таны болон өөрсдийн гаргасан саналыг боловсруулж бодит бизнест нэвтрүүлэх эцсийн үр дүнд хүрэх амжилтаар үргэлж тэргүүлдэг.”
              </p>
            </div>
            
            {/* 2. Video Box Column */}
            <Box
              sx={{
                width: { xs: '100%', md: '80%' }, // 100% width on mobile
                maxWidth: { xs: '100%', md: 600 },
                height: { xs: 220, md: 400 },   
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#000',       
                justifySelf: mdUp ? 'end' : 'start', // Align to start on mobile
                order: mdUp ? 2 : 2, // Always second
              }}
            >
              <video
                src="/videos/help.mp4"         
                controls
                preload="metadata"
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>

          </div>

          <div style={{ height: '50px' }} />

          {/* Button below the main content */}
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'start' // Always align to the start (left)
          }}>
            <Button
              variant="contained"
              rel="noopener"
              sx={{
                backgroundColor: COLORS.ButtonColor,
                color: 'black',
                // Removed redundant alignSelf/justifySelf as they are handled by the parent div
                height: '40px',
                borderRadius: '0px',
                border: '2px solid black',
                fontSize: '13px',
                fontWeight: 300,
                width: mdUp ? 'auto' : '100%', // Full width on mobile
                maxWidth: mdUp ? 'none' : '200px', // Limit max width on mobile for better look
                '&:hover': {
                  backgroundColor: COLORS.ButtonColor,
                  opacity: 0.5,
                  boxShadow: '4px 4px 0 black',
                },
                boxShadow: '4px 4px 0 black',
                '&:active': { boxShadow: '4px 4px 0 black', },
              }}
            >
              Дэлгэрэнгүй...
            </Button>
          </div>


        </div>
      </div>

      <div style={{ height: '150px' }} />

      <hr style={{ border: '1px solid #ccc', width: '90%', margin: '0 auto' }} />

      <div style={{
        height: '20px'
      }} />
    </div >
  );
}