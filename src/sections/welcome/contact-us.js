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
import { Box, Card, CardContent, CardHeader, Container, Link } from '@mui/material';
import CarouselAnimation from '../_examples/extra/carousel-view/carousel-animation';
import CarouselBasic3 from '../_examples/extra/carousel-view/carousel-basic-3';
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton, useDotButton } from 'src/components/embla-carousel/embla-carousel-dot-button';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from 'src/components/embla-carousel/embla-carousel-arrow-buttons';
import '../../styles/embla-styles.css';

// ----------------------------------------------------------------------

export default function ContactUs({ contactUsRef }) {
  const mdUp = useResponsive('up', 'md');
  const smUp = useResponsive('up', 'sm');
  const lgUp = useResponsive('up', 'lg');

  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth); 
    }
  }, []);

  // Data source for the services grid
  const data = [
    {
      id: 1,
      imageSrc: '/icons/location.svg',
      title: 'Хаяг:',
      desc: [
        'Улаанбаатар хот Сүхбаатар дүүрэг 2-р хороо Гаруда центер. 504 тоот'
      ],
    },
    {
      id: 2,
      imageSrc: '/icons/phone2.svg',
      title: 'Утасны дугаар:',
      desc: [
        'В.Балдандорж 976-99038090  Бизнес шинжээч',
        'Б.Мөнхзаяа 976-88076842  Төслийн менежер'
      ],
    },
    {
      id: 3, // Fixed duplicate ID
      imageSrc: '/icons/mail.svg',
      title: 'И-мэйл хаяг:',
      desc: [
        'В.Балдандорж baldandorj.v@gmail.com  Бизнес шинжээч',
        'Б.Мөнхзаяа munkhzayabya@gmail.com  Төслийн менежер',
      ]
    },
  ];

  // Embla setup (keeping existing logic)
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start' })
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  return (
    <div
      id='module-container'
      component={MotionViewport}
      style={{
        // Changed fixed height to min-height to allow scrolling on mobile
        minHeight: `100%`, 
        position: 'relative',
        paddingBottom: '50px' // Add bottom padding for mobile scrolling
      }}
      ref={contactUsRef}
    >
      <div style={{ height: '100%' }}>
        <Container>
          {/* HEADER SECTION */}
          <div style={{ 
            display: 'flex', 
            // Stack vertically on mobile, row on Desktop
            flexDirection: mdUp ? 'row' : 'column', 
            alignItems: 'center', 
            // Center content on mobile, spread on Desktop
            justifyContent: mdUp ? 'space-around' : 'center', 
            textAlign: mdUp ? 'left' : 'center',
            gap: mdUp ? '0px' : '20px',
            marginTop: mdUp ? '0px' : '40px'
          }}>

            <Logo
              imageSrc='/logo/logo.svg'
              // Responsive Logo size
              size={mdUp ? 160 : 120} 
            />

            <p style={{ 
              color: 'black', 
              // Responsive Font Size
              fontSize: mdUp ? '38px' : '24px', 
              fontWeight: 'bold',
              margin: 0 // Remove default margin
            }}>
              Бидэнтэй холбоо барьхад хялбар
            </p>

          </div>

          <div style={{ height: '30px' }} />

          {/* GRID SECTION */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${mdUp ? 3 : smUp ? 2 : 1}, minmax(0, 1fr))`,
              // Gap: 15% is too big for mobile. Use 5% for desktop, fixed pixels for mobile.
              gap: mdUp ? '5%' : '24px', 
              marginTop: '36px',
              // Margins: Remove the 7% margin on mobile to use full width
              marginLeft: mdUp ? '7%' : '0px',
              marginRight: mdUp ? '7%' : '0px',
            }}
          >
            {data.map((s, idx) => (
              <div
                key={idx}
                style={{
                  border: '2px solid #000',
                  borderRadius: '0px',
                  backgroundColor: '#fff',
                  padding: smUp ? '24px' : '20px',
                  minHeight: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  // Center items in card on mobile if desired, currently aligned start
                  alignItems: 'flex-start', 
                }}
              >
                <div
                  style={{
                    width: smUp ? 64 : 56,
                    height: smUp ? 64 : 56,
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 12px 24px rgba(17, 24, 39, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-start',
                    margin: '0 0 12px 0',
                  }}
                >
                  <Logo imageSrc={s.imageSrc} size={smUp ? 40 : 32} disabledLink sx={{}} />
                </div>
                <p
                  style={{
                    margin: 0,
                    textAlign: 'left',
                    fontWeight: 700,
                    color: '#111827',
                    fontSize: smUp ? '18px' : '17px',
                    marginTop: '15px'
                  }}
                >
                  {s.title}
                </p>
                <div style={{ marginTop: '12px' }}>
                  {s.desc.map((t, i) => (
                    <p
                      key={i}
                      style={{
                        margin: 0,
                        marginBottom: '8px',
                        color: '#374151',
                        fontSize: smUp ? '14px' : '14px',
                        lineHeight: 1.6,
                        textAlign: 'left',
                        wordBreak: 'break-word' // Prevents long emails from breaking layout
                      }}
                    >
                      {t}
                    </p>
                  ))}
                </div>

                {Array.isArray(s.orders) && s.orders.length > 0 && (
                  <ol
                    style={{
                      marginTop: '8px',
                      marginBottom: 0,
                      paddingLeft: '18px',
                      color: '#374151',
                      textAlign: 'left',
                      listStyleType: 'decimal',
                      listStylePosition: 'outside',
                    }}
                  >
                    {s.orders.map((t, i) => (
                      <li
                        key={i}
                        style={{
                          marginBottom: '8px',
                          fontSize: smUp ? '14px' : '13px',
                          lineHeight: 1.6,
                        }}
                      >
                        {t}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </Container>
      </div >
      <div style={{ height: '100px' }} />
    </div >
  );
}