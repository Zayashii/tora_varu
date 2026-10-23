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

// ----------------------------------------------------------------------

export default function HomeRegisterSteps({ guideRef }) {
  const mdUp = useResponsive('up', 'md');

  const textRef = useRef(null);

  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      console.log("zxc ===========> ", textRef.current.offsetWidth)
      setTextWidth(textRef.current.offsetWidth); // Get the width of the content
    }
  }, []);

  const descriptionList = [
    {
      'title': 'ХАРИЛЦАГЧ',
      'content': [
        'Харилцагч бүртгэх',
        'Харилцагчдын жагсаалтыг харах',
        'Харилцагчдын дэлгэрэнгүй мэдээллийг харах',
        'Харилцагчдад тэмдэглэл оруулах',
        'Харилцагчийн эрхийн тохиргоо',
        'Харилцагчийн зээлийн түүх',
        'Харилцагчийн мэдээллийн дашборд',
      ],
      'content2': [
        'Харилцагчдын мэдээллийг олноор оруулах',
        'Харилцагчдын барьцаа хөрөнгийн түүх',
      ]
    },
    {
      'title': 'БАРЬЦАА',
      'content': [
        "Барьцаа хөрөнгө бүртгэх",
        "Барьцаа хөрөнгийн жагсаалт",
        "Барьцаа хөрөнгийн төлөв",
        "Барьцаа эзэмшигч болон зээлийн түүх",
      ],
      'content2': [
        'Барьцаа хөрөнгийн мэдээллийг олноор оруулах',
      ]
    },
    {
      'title': 'ЗЭЭЛ',
      'content': [
        "Зээлийн бүтээгдэхүүн үүсгэх",
        "Зээл үүсгэх",
        "Зээлийн жагсаалтын удирдлага",
        "Зээлийн төрөл ангиллын жагсаалт",
        "Зээлийн мэдээллийн дашборд",
        "Апп-с зээлийн төлөлтийн мэдээлэл харах",
        "Апп-с зээлийн жагсаалт, зээлийн лимит харах",
      ],
      'content2': [
        'Зээлийн мэдээллийг олноор оруулах',
        'Апп ашиглан харилцагч зээл авах',
        'QPAY ашиглан зээл төлөх, сунгах',
      ]
    },
    {
      'title': 'САНХҮҮ',
      'content': [
        "Ерөнхий дэвтэр",
        "Авлагын мэдээллийн дашборд",
      ],
      'content2': [
        'Дансны хуулга',
        'Гараар гүйлгээ баталгаажуулах, залруулга хийх',
        'Автомат гүйлгээ баталгаажуулалт',
        'Дансны хуулгаас гүйлгээ баталгаажуулах',
      ]
    },
    {
      'title': 'ТОХИРГОО',
      'content': [
        "Хэрэглэгч бүртгэх",
      ],
      'content2': [
        'Мессэж үйлчилгээ',
        'Бусад системтэй холбох үйлчилгээ',
        'Корпорэйт үйлчилгээ холбох',
        'Апп-н баннер зургийн удирдлага',
      ]
    },
  ];

  return (
    <div
      ref={guideRef}
      id='module-container'
      component={MotionViewport}
      style={{
        height: `100%`,
      }}
    >
      <div
        style={{
          height: '100%'
        }}>
        <div
          style={{
            position: 'relative'
          }}>
          <div
            style={{
              backgroundColor: COLORS.Primary,
              width: '180px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0 20px 20px 0px',
              position: 'absolute',
              top: '40px',
            }}
          >
            <Logo
              imageSrc='/logo/new_icon.svg'
              size={60}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}
        >
          <div
            id='module-title'
            style={{
              paddingRight: '15%',
              paddingTop: '60px'
            }}>
            <p
              style={{
                color: COLORS.Primary,
                fontSize: '1.5rem',
                fontWeight: '400',
                paddingBottom: '0.75rem',

              }}
            >
              “ХУРГАН ЗЭЭЛ”  СИСТЕМ
            </p>
            <p
              style={{
                color: COLORS.Primary,
                fontSize: '2.25rem',
                fontWeight: '700',

              }}
            >
              ПРОГРАММД БҮРТГҮҮЛЖ АШИГЛАХ
            </p>
          </div>
        </div>


        <div
          className='desktop-road'
          style={{
            display: 'flex',
            marginTop: '100px',
            paddingLeft: '50px',
            position: 'relative',
            display: 'block',
          }}
        >
          <div
            style={{
              width: '100%',
              alignSelf: 'center',
              justifySelf: 'center',
            }}
          >
            <Logo
              imageSrc='/assets/images/landing/road.svg'
              disabledLink
              size={'100%'}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              top: '22%',
              width: '15%',
              // backgroundColor: 'red'
            }}
          >
            <p
              className='road-title'
              style={{
                color: COLORS.Primary,
                fontSize: '2.25rem',
                fontWeight: '700',
                paddingBottom: '0.75rem',
              }}
            >
              АЛХАМ 1
            </p>
            <p
              className='road-desc'
              style={{
                color: COLORS.Secondary,
                fontSize: '0.875rem',
                paddingBottom: '2.5rem',
              }}
            >
              Khurganzeel.mn сайт руу нэвтрэн “Бүртгүүлэх” товчийг дарна
            </p>
            <div
              id='road-image1'
              style={{
                marginLeft: '-20px',
                width: '100%',
              }}
            >
              <Logo
                imageSrc='/assets/images/landing/link.svg'
                disabledLink
                size={'100%'}
              />
            </div>
          </div>


          <div
            id='step2'
            style={{
              position: 'absolute',
              top: '-5%',
              width: '15%',
              height: '70%',
              left: '31.5%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'red',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                className='road-title'
                style={{
                  color: COLORS.Primary,
                  fontSize: '2.25rem',
                  fontWeight: '700',
                  paddingBottom: '0.75rem',
                }}
              >
                АЛХАМ 2
              </p>
              <p
                className='road-desc'
                style={{
                  color: COLORS.Secondary,
                  fontSize: '0.875rem',
                }}
              >
                Шаардлагатай талбаруудад өөрийн мэдээллийг оруулан “Хадшалах” товчийг дарснаар таны бүртгэлтэй дугаарт систем рүү нэвтрэх нэр, нууц үгийг илгээнэ.
              </p>
              <p
                className='road-desc'
                style={{
                  color: 'red',
                  fontSize: '0.875rem',
                }}
              >
                Анхааруулга: Оруулсан утасны дугаар, и-мэйл хаяг руу нэвтрэх нэр, нууц үг илгээх тул дээрх мэдээллийг заавал үнэн зөв оруулах ёстойг анхаараарай
              </p>

            </div>
            <div
              className='road-image'
              style={{
                marginLeft: '-20px',
                width: '75%'
              }}
            >
              <Logo
                imageSrc='/assets/images/landing/board.svg'
                disabledLink
                size={'100%'}
              />
            </div>
          </div>


          <div
            style={{
              position: 'absolute',
              top: '-5%',
              width: '15%',
              right: '10%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'red',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                className='road-title'
                style={{
                  color: COLORS.Primary,
                  fontSize: '2.25rem',
                  fontWeight: '700',
                  paddingBottom: '0.75rem',
                }}
              >
                АЛХАМ 4
              </p>
              <p
                className='road-desc'
                style={{
                  color: COLORS.Secondary,
                  fontSize: '0.875rem',
                }}
              >
                Гарын авлагатай танилцсаны дараагаар  зээлийн бүтээгдэхүүнүүд болон харилцагчидын бүртгэл мэдээллийг оруулна.
              </p>

            </div>
          </div>


          <div
            style={{
              position: 'absolute',
              top: '80%',
              width: '15%',
              right: '12%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'red',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                className='road-title'
                style={{
                  color: COLORS.Primary,
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  paddingBottom: '0.75rem',
                }}
              >
                АЛХАМ 5
              </p>
              <p
                className='road-desc'
                style={{
                  color: COLORS.Secondary,
                  fontSize: '0.875rem',
                }}
              >
                Хэрвээ хэрэглэгч та хүсвэл төлбөр төлөн манай системийн нэмэлт боломжуудыг ашиглах боломжтой.
              </p>

            </div>
          </div>
        </div>
        <div
          className='desktop-road'
          style={{
            position: 'relative',
            width: '25%',
            height: '70%',
            left: '38%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // backgroundColor: 'red',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 'fit-content'
              }}>
              <p
                className='road-title'
                style={{
                  color: COLORS.Primary,
                  fontSize: '2.25rem',  // from text-4xl
                  fontWeight: 'bold',   // from font-bold
                  paddingBottom: '0.75rem',
                }}
              >
                АЛХАМ 3
              </p>
              <p
                className='road-desc'
                style={{
                  color: COLORS.Secondary,
                  fontSize: '0.875rem',
                }}
              >
                Бүртгэлтэй утасны дугаарт ирсэн нэвтрэх нэр, нууц үгийг ашиглан khurganzeel.mn сайт руу нэвтэрнэ.
              </p>
            </div>

            <div
              className='road-image-step3'
              style={{
                // backgroundColor: 'green',
                width: '60%',
                paddingLeft: '0.25rem'
              }}
            >
              <Logo
                imageSrc='/assets/images/landing/phone.svg'
                disabledLink
                size={'100%'}
              />
            </div>
          </div>
        </div>




        <div className='mobile-road'
          style={{
            display: 'none',
            justifyContent: 'center',
            paddingTop: '50px',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '30%'
            }}
          >
            <Logo
              imageSrc='/assets/images/landing/road-rotated.svg'
              disabledLink
              size={'100%'}
            />
          </div>

          <div
            style={{
              left: '35%',
              position: 'absolute',
              width: '24%',
              height: '20%',
              // backgroundColor: 'red',
            }}
          >
            <p
              className='road-title-mobile'
              style={{
                color: COLORS.Primary,
                // fontSize: '1.25rem',  // from text-xl
                // fontWeight: 'bold',    // from font-bold
                paddingBottom: '0.75rem',
              }}
            >
              АЛХАМ 1
            </p>
            <p
              className='road-desc-mobile'
              style={{
                color: COLORS.Secondary,
                fontSize: '10px',
                paddingBottom: '1.25rem',
              }}
            >
              Khurganzeel.mn сайт руу нэвтрэн “Бүртгүүлэх” товчийг дарна
            </p>
            <div
              id='road-image1-mobile'
              style={{
                marginLeft: '-20px',
                width: '100%',
              }}
            >
              <Logo
                imageSrc='/assets/images/landing/link.svg'
                disabledLink
                size={'100%'}
              />
            </div>
          </div>


          <div
            id='step2-mobile'
            style={{
              position: 'absolute',
              top: '34%',
              width: '58%',
              height: '20%',
              left: '42%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'red',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                className='road-title-mobile'
                style={{
                  color: COLORS.Primary,
                  fontSize: '1.25rem',  // from text-xl
                  fontWeight: '700',     // from font-bold
                  paddingBottom: '0.25rem',
                }}
              >
                АЛХАМ 2
              </p>
              <p
                className='road-desc-mobile'
                style={{
                  color: COLORS.Secondary,
                  fontSize: '10px'
                }}
              >
                Шаардлагатай талбаруудад өөрийн мэдээллийг оруулан “Хадшалах” товчийг дарснаар таны бүртгэлтэй дугаарт систем рүү нэвтрэх нэр, нууц үгийг илгээнэ.
              </p>
              <p
                className='road-desc-mobile'
                style={{
                  color: 'red',
                  fontSize: '10px'
                }}
              >
                Анхааруулга: Оруулсан утасны дугаар, и-мэйл хаяг руу нэвтрэх нэр, нууц үг илгээх тул дээрх мэдээллийг заавал үнэн зөв оруулах ёстойг анхаараарай
              </p>

            </div>
            {/* <div
              className='road-image-mobile'
              style={{
                marginLeft: '-20px',
                width: '75%'
              }}
            >
              <Logo
                imageSrc='/assets/images/landing/board.svg'
                disabledLink
                size={'100%'}
              />
            </div> */}
          </div>


          <div
            className=''
            style={{
              position: 'absolute',
              width: '23%',
              height: '30%',
              top: '40%',
              left: '12%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start', // Align title and description to the left
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%', // Ensures full width for alignment purposes
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%', // Ensures full width for alignment
                }}
              >
                <p
                  className='road-title-mobile'
                  style={{
                    color: COLORS.Primary,
                    fontSize: '1.25rem',  // from text-xl
                    fontWeight: '700',     // from font-bold
                    paddingBottom: '0.75rem',
                  }}
                >
                  АЛХАМ 3
                </p>
                <p
                  className='road-desc-mobile'
                  style={{
                    color: COLORS.Secondary,
                    fontSize: '10px',
                  }}
                >
                  Бүртгэлтэй утасны дугаарт ирсэн нэвтрэх нэр, нууц үгийг ашиглан khurganzeel.mn сайт руу нэвтэрнэ.
                </p>
              </div>

              <div
                id='road-image-step3-mobile'
                className='pt-1'
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Logo
                  imageSrc='/assets/images/landing/phone.svg'
                  disabledLink
                  size={'90%'}
                />
              </div>
            </div>
          </div>


          <div
            style={{
              position: 'absolute',
              top: '75%',
              width: '25%',
              left: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'red',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                className='road-title-mobile'
                style={{
                  color: COLORS.Primary,
                  fontSize: '1.25rem',  // from xl
                  fontWeight: '700',     // from font-bold
                  paddingBottom: '0.75rem',
                }}
              >
                АЛХАМ 4
              </p>
              <p
                className='road-desc-mobile'
                style={{
                  color: COLORS.Secondary,
                  fontSize: '10px',
                }}
              >
                Гарын авлагатай танилцсаны дараагаар  зээлийн бүтээгдэхүүнүүд болон харилцагчидын бүртгэл мэдээллийг оруулна.
              </p>

            </div>
          </div>


          <div
            style={{
              position: 'absolute',
              top: '85%',
              width: '20%',
              left: '21%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'red',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                className='road-title-mobile'
                style={{
                  color: COLORS.Primary,
                  fontSize: '1.25rem',  // from text-xl
                  fontWeight: '700',     // from font-bold
                  paddingBottom: '0.75rem',
                }}
              >
                АЛХАМ 5
              </p>
              <p
                className='road-desc-mobile'
                style={{
                  color: COLORS.Secondary,
                  fontSize: '10px',
                }}
              >
                Хэрвээ хэрэглэгч та хүсвэл төлбөр төлөн манай системийн нэмэлт боломжуудыг ашиглах боломжтой.
              </p>

            </div>
          </div>
        </div>
      </div>

      <div style={{
        height: '20px'
      }} />
    </div >
  );
}
