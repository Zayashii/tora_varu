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

// ----------------------------------------------------------------------

export default function MainService({ serviceRef }) {
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
  const servicesData = [
    {
      icon: '/icons/main-service/1.svg',
      title: 'Бизнес процессийн зураглал гаргах',
      lines: [
        "Бизнес дизайн стратегийн уялдааг шинжилж, өдөр тутам цаашлаад сар, улирал, жилийн хугацаанд хийгдэг бүх процессыг орхигдуулахгүй зураглаж бизнесийн  big process map  гаргана. Таны бизнес процессыг мэргэжлийн өнцөгөөс харж зураглах бөгөөд процессын дахвцал болон цоорхой хэсгүүдийг бүрэн тодорхойлно. Процессыг хэмжиж түүнийг гүйцэтгэх ур чадвар болон шаардлагатай хүн цагийг тооцож гаргана. Компанийн бодлогын бичиг баримтын суурь баримт болно. Систем шаардлага гаргахад мөн суурь болно."
      ],
    },
    {
      icon: '/icons/main-service/2.svg',
      title: 'Программын шаардлага тодорхойлох',
      lines: [
        'Таны бизнес модель түүний процессын судалгааг үндэслэн ямар программ хангамж шаардлагатай вэ гэдгийг бүрэн тодохойлж өгнө. Таны бизнесын процесс дээр систем нэвтрэхэд өөрчлөгдөх зураглал гаргана. Системийн архитиктур төлөвлөлт буюу Table design, фунцын төлөвлөгөө, сервер сервис төлөвлөлтийг гаргаж өгнө. Системийн дэлэгцийг хэрэглэгчийн шаардлага дээр тулгуурлаж UX гаргах muckup зураг гаргана. Дээрх шаардлагууд дээр тулгуурлан систем хөгжүүлэх үндсэн шаардлагын бичиг баримт боловсруулж гаргана.'
      ],
    },
    {
      icon: '/icons/main-service/3.svg',
      title: 'Системийн шинжилгээ, анализ',
      lines: [
        'Таны бизнестээ ашиглаж байгаа программ хагамжийн дараах хэсгүүдэд судалгаа хийж сайжруулах дүгнэлт гаргана. ',
      ],
      orders: [
        'Back-end хэсэгт мэдээллийн урсгал, Фунц, бусад үйлдлүүдийг шалгаж шаардлагаггүй ажилгаануудыг цэвэрлэнэ. ',
        'Front-end хэсэгт системийн хэрэглэгчийн ашгилдаг дэлгэц цонхнуудыг илүү хялбар ойлгомжтой ашиглах боломжуудыг санал болгоно. Шаардлагагүй үйлдэл алхамуудыг арилгаж илүү хялбар ажилгаатай болгоно.',
      ]
    },
    {
      icon: '/icons/main-service/4.svg',
      title: 'IT төслийг удирдах, гүйцэтгэх',
      lines: [
        'Танай компанийн нэвтрүүлж буй программ хангамжыг төсөлд бүх түвшинд хамтарч ажиллана. Ингэхдээ зөвлөх үйлчилгээ үзүүлэхээс эхлээд өөрсдийн багаар төслийг удирдаж гүйцэтгэх бүрэн боломжтой.',
      ],
      orders: [
        'Системийн шаардлага: ',
        'Программ хөгжүүлэх',
        'Тест хийх гарын авлага боловсруулах',
        'Нэвтрүүлэх бэлтгэл ажил сургалт болон мастер дата тохируулах',
        'Систем нэвтрүүлэх бодит орчинд системийг зөв аюулгүй нэвтрүүлэх',
        'Системийн супортын ажлын төлөвлөгөө гэрээ боловсрулуах',
      ]
    },
    {
      icon: '/icons/main-service/5.svg',
      title: 'KPI-ийн үнэлгээ, тогтолцоо үүсгэх',
      lines: [
        'Бизнесийн процесс зураглал дээрх ажлын байр бүрээр бүтээмжийн онцлогт тохирсон хэмжих нэгж гаргах. Харилцан адилгүй хэмжих нэгжийг компанийн түвшинд нэгдсэн нэг нэгжид шилжүүлж цалин урамшуулал олгох тооцоололд тохируулах.  ',
        'KPI-ийн үнэлгээг хүний оролцоогүй систем дээр суурилсан автомт болгож сайжруулах ажлуудыг хийж гүйцэтгэнэ. KPI-ийн үнэлгээний тайланд хяналт шинжилгээ хийж сайжруулах болон өөрчлөх саналыг боловсруулна. ',
      ],
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
      }}
      ref={serviceRef}
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

        {/* Services section (header + 5 cards) */}
        <div
          id='services-section'
          style={{
            paddingTop: '60px',
            paddingBottom: '20px',
            paddingLeft: lgUp ? '120px' : smUp ? '40px' : '16px',
            paddingRight: lgUp ? '120px' : smUp ? '40px' : '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: mdUp ? 'row' : 'column',
              alignItems: mdUp ? 'center' : 'flex-start',
              justifyContent: mdUp ? 'space-between' : 'flex-start',
              gap: mdUp ? '20px' : '12px',
              textAlign: mdUp ? 'left' : 'left',
              width: '100%',
            }}
          >
            <div style={{ maxWidth: mdUp ? '800px' : '100%', textAlign: 'left', width: '100%' }}>
              <p
                style={{
                  margin: 0,
                  fontSize: lgUp ? '48px' : mdUp ? '40px' : smUp ? '32px' : '24px',
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1.1,
                }}
              >
                Үндсэн үйлчилгээ
              </p>
              <p
                style={{
                  marginTop: '12px',
                  marginBottom: 0,
                  color: '#4B5563',
                  fontSize: mdUp ? '16px' : '14px',
                  lineHeight: 1.6,
                }}
              >
                Манай багийн хийж гүйцэтгэсэн зөвлөх үйлчилгээ Санхүүгийн салбар болон Үйлвэрлэл худалдааны салбарт түлхүү ажилласан. Та бидний үзүүлдэг үйлчилгээны талаар дэлгэрэнгүй мэдээлэл авах бол уулзалт товлох бүрэн боломжтой.
              </p>
            </div>

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
          </div>

          <div style={{ height: smUp ? '100px' : '24px' }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${lgUp ? 5 : mdUp ? 3 : smUp ? 2 : 1}, minmax(0, 1fr))`,
              gap: lgUp ? '24px' : '16px',
              marginTop: '36px',
            }}
          >
            {servicesData.map((s, idx) => (
              <div
                key={idx}
                style={{
                  border: '2px solid #000',
                  borderRadius: '0px',
                  backgroundColor: '#fff',
                  padding: smUp ? '24px' : '16px',
                  minHeight: smUp ? '420px' : 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: smUp ? 64 : 48,
                    height: smUp ? 64 : 48,
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
                  <Logo imageSrc={s.icon} size={smUp ? 40 : 32} disabledLink sx={{}} />
                </div>
                <p
                  style={{
                    margin: 0,
                    textAlign: 'left',
                    fontWeight: 700,
                    color: '#111827',
                    fontSize: smUp ? '18px' : '16px',
                    marginTop: '20px'
                  }}
                >
                  {s.title}
                </p>
                <div style={{ marginTop: '12px' }}>
                  {s.lines.map((t, i) => (
                    <p
                      key={i}
                      style={{
                        margin: 0,
                        marginBottom: '10px',
                        color: '#374151',
                        fontSize: smUp ? '14px' : '13px',
                        lineHeight: 1.6,
                        textAlign: 'left',
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
        </div>
      </div>

      <div style={{ height: '50px' }} />

      <hr style={{ border: '1px solid #ccc', width: '90%', margin: '0 auto' }} />

      <div style={{
        height: '20px'
      }} />
    </div>
  );
}
