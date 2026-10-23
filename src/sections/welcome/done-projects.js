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
import { Link } from '@mui/material';


// ----------------------------------------------------------------------

export default function DoneProjects({ introRef }) {
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
        paddingBottom: '40px', // Ensure bottom padding on mobile
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

        {/* Services section (header + 3 cards) */}
        <div
          id='services-section'
          style={{
            paddingTop: '60px',
            paddingBottom: '20px',
            paddingLeft: lgUp ? '120px' : smUp ? '40px' : '20px',
            paddingRight: lgUp ? '120px' : smUp ? '40px' : '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              textAlign: 'left',
              width: '100%',
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
              Ажил гүйцэтгэсэн том төслүүд...
            </p>

          </div>

          <div style={{ height: smUp ? '100px' : '40px' }} />

          <div
            style={{
              display: 'flex',
              flexDirection: mdUp ? 'row' : 'column', // Stack on mobile
              marginTop: '36px',
              justifyContent: 'space-between',
              gap: mdUp ? '0px' : '60px' // Add gap between items on mobile
            }}
          >
            {data.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: mdUp ? '30%' : '100%', // Full width on mobile
                }}
              >
                {/* Logo wrapper to control max height/width if needed */}
                <div style={{ width: '100%', marginBottom: '18px' }}>
                   <Logo imageSrc={s.icon} size={'100%'} disabledLink sx={{}} />
                </div>
                
                <p style={{ 
                  color: '#111111', 
                  fontSize: '16px', // Slightly larger for readability
                  fontWeight: 'lighter',
                  margin: 0,
                  marginBottom: '10px'
                }}>
                  {s.title}
                </p>
                
                <Link sx={{ 
                    color: "#111111", 
                    textDecorationColor: '#111111', 
                    textUnderlineOffset: '3px', 
                    fontSize: '14px', 
                    alignSelf: 'flex-start', // Align left
                    cursor: 'pointer'
                  }}
                  target="_blank"
                  href={s.link}
                  underline='always' >
                  <p style={{ margin: 0 }}>Нэвтрүүлсэн систем</p>
                </Link>
              </div>
            ))}
          </div>

          <div style={{ height: mdUp ? '50px' : '40px' }} />

          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: mdUp ? 'flex-end' : 'flex-start' // Left align button on mobile
          }}>
            <Button
              variant="contained"
              rel="noopener"
              sx={{
                backgroundColor: COLORS.ButtonColor,
                color: 'black',
                height: '40px',
                borderRadius: '0px',
                border: '2px solid black',
                fontSize: '13px',
                fontWeight: 300,
                width: mdUp ? 'auto' : '100%', // Full width button on mobile (optional, or remove to keep fixed width)
                maxWidth: mdUp ? 'none' : '200px',
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

      <div style={{ height: mdUp ? '150px' : '50px' }} />

      <hr style={{ border: '1px solid #ccc', width: '90%', margin: '0 auto' }} />

      <div style={{
        height: '20px'
      }} />
    </div>
  );
}