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
import Box from '@mui/material/Box';
import { position } from 'stylis';


// ----------------------------------------------------------------------

export default function Founder({ guideRef }) {
  const mdUp = useResponsive('up', 'md');
  const smUp = useResponsive('up', 'sm');

  const textRef = useRef(null);

  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      console.log("zxc ===========> ", textRef.current.offsetWidth)
      setTextWidth(textRef.current.offsetWidth); // Get the width of the content
    }
  }, []);


  return (
    <div
      ref={guideRef}
      id='module-container'
      component={MotionViewport}
      style={{
        height: `100%`,
      }}
    >
      <div style={{ height: mdUp ? '50px' : '24px' }} />
      <div
        style={{
          height: '100%'
        }}>
        <div
          style={{
            position: 'relative'
          }}>


          <div style={{ display: 'flex', flexDirection: mdUp ? 'row' : 'column', background: 'linear-gradient(to top, #EAF7FF 68%, transparent 68%)' }}>

            <div style={{ flex: '1 1 0%', minWidth: 0, position: 'relative', display: mdUp ? 'block' : 'none' }}>
              <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
                {/* <Box component="img" src="/icons/person.svg" sx={{ height: 700, cursor: 'pointer', objectFit: 'cover' }} /> */}
              </div>

              <Box sx={{
                position: 'absolute',
                top: '24%',
                left: '18%',
                display: { xs: 'none', md: 'block' },
                // zIndex: 2,
              }}>
                <Box
                  component="img"
                  src={"/icons/golive.svg"}
                  sx={{
                    width: '100%',
                    cursor: 'pointer',
                    objectFit: 'fill',
                  }}
                />
              </Box>


              <Box sx={{
                position: 'absolute',
                bottom: '27%',
                right: '15%',
                display: { xs: 'none', md: 'block' },
                // zIndex: 2,
              }}>
                <Box
                  component="img"
                  src={"/icons/plan.svg"}
                  sx={{
                    width: '100%',
                    cursor: 'pointer',
                    objectFit: 'fill',
                  }}
                />
              </Box>

              <Box sx={{
                position: 'absolute',
                bottom: '15%',
                left: '10%',
                display: { xs: 'none', md: 'block' },
                // zIndex: 2,
              }}>
                <Box
                  component="img"
                  src={"/icons/solutions.svg"}
                  sx={{
                    width: '100%',
                    cursor: 'pointer',
                    objectFit: 'fill',
                  }}
                />
              </Box>

            </div>


            <div style={{ flex: '1 1 0%', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: mdUp ? 'center' : 'flex-start', padding: mdUp ? 0 : '0 16px' }}>
              <div style={{ padding: '5px 15px', backgroundColor: COLORS.Orange, borderRadius: 25, }}>
                <p style={{ color: 'white', fontSize: '14px' }}>Бид хэн бэ?</p>
              </div>

              <div style={{ height: '20px' }} />

              <p
                style={{
                  color: 'black',
                  fontSize: mdUp ? '2.25rem' : '1.5rem',
                  fontWeight: '700',
                  paddingRight: mdUp ? '200px' : '0'
                }}
              >
                Манай баг таны IT төслийг  бизнесийн судалгаанаас процесст нэвтрэх хүртэл гүйцэтгэлийг бүрэн хийж гүйцэтгэнэ.
              </p>

              <div style={{ height: mdUp ? '120px' : '24px' }} />

              <p
                style={{
                  color: 'black',
                  fontSize: mdUp ? '0.9rem' : '0.95rem',
                  fontWeight: '300',
                  paddingRight: mdUp ? '200px' : '0'
                }}
              >
                “Бидний бизнесийг хөгжүүлэх шинэ санал санаачилга таны болон бусдыг саналаас илүү биш байж болно. Гэвч манай баг таны болон өөрсдийн гаргасан бизнес санааг боловсруулж бодит бизнест нэвтрүүлэх эцсийн үр дүнд хүрэх амжилтаар үргэлж тэргүүлдэг.”
              </p>

              <div style={{ height: mdUp ? '20px' : '12px' }} />

              <p
                style={{
                  color: 'black',
                  fontSize: mdUp ? '0.9rem' : '0.95rem',
                  fontWeight: 300,
                  paddingRight: mdUp ? '250px' : '0',
                  alignSelf: mdUp ? 'flex-end' : 'flex-start',
                }}
              >
                “<strong style={{ fontWeight: 700 }}>В.Балдандорж</strong>” үүсгэн байгуулагч
              </p>

              <div style={{ height: mdUp ? '50px' : '24px' }} />

              <hr style={{ border: '1px solid #ccc', width: mdUp ? '80%' : '100%', margin: 0 }} />

              {/* Stats strip */}
              <div
                style={{
                  width: mdUp ? '80%' : '100%',
                  padding: mdUp ? '24px 16px' : '16px 12px',
                  marginTop: '16px',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${mdUp ? 4 : smUp ? 2 : 1}, minmax(0, 1fr))`,
                    gap: '24px',
                  }}
                >
                  {[{
                    value: '50+',
                    lines: ['Үйлчилгээг', 'үзүүлсэн төсөл'],
                  },
                  {
                    value: '7+',
                    lines: ['Нэвтрүүлсэн', 'төсөл'],
                  },
                  {
                    value: '10+',
                    lines: ['Ажилласан жилийн', 'туршлага'],
                  },
                  {
                    value: '2+',
                    lines: ['Өөрийн хэрэгцээнд', 'IT төсөл'],
                  }].map((item, idx) => (
                    <div key={idx} style={{ textAlign: 'left' }}>
                      <div
                        style={{
                          fontWeight: 800,
                          color: '#111827',
                          fontSize: mdUp ? '40px' : '32px',
                          lineHeight: 1.1,
                        }}
                      >
                        {item.value}
                      </div>
                      <div
                        style={{
                          marginTop: '6px',
                          color: '#4B5563',
                          fontSize: mdUp ? '14px' : '13px',
                          lineHeight: 1.4,
                          fontWeight: 400,
                        }}
                      >
                        {item.lines[0]}<br />{item.lines[1]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div style={{ height: mdUp ? '70px' : '32px' }} />

              <Box sx={{ textAlign: 'left' }}>
                <Button
                  variant="contained"
                  rel="noopener"
                  sx={{
                    backgroundColor: COLORS.ButtonColor,
                    color: 'black',
                    alignSelf: 'center',
                    height: '40px',
                    borderRadius: '0px',
                    border: '2px solid black',
                    fontSize: '13px',
                    fontWeight: 300,
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
              </Box>

              <div style={{ height: '20px' }} />

            </div>
          </div>


        </div>
      </div>
    </div >
  );
}
