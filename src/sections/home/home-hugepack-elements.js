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

export default function HomeHugePackElements({ introRef }) {
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
      id='module-container'
      component={MotionViewport}
      style={{
        height: `100%`,
        minHeight: '100vh',
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
                fontWeight: 400,
                fontSize: '1.5rem',
                paddingBottom: 3,
              }}
            >
              “ХУРГАН ЗЭЭЛ”  СИСТЕМ
            </p>
            <p
              style={{
                color: COLORS.Primary,
                fontWeight: 'bold',
                fontSize: '2.25rem',
              }}
            >
              СИСТЕМИЙН МОДУЛИУДЫН ТАЙЛБАР
            </p>
          </div>
        </div>

        <div
          id='module-mobile-view'
          style={{
            flexGrow: 1,
            display: 'none'
          }}
        >
          <div
            id="free-mobile"
            style={{
              height: 'auto',
              backgroundColor: COLORS.Third,
              borderRadius: '20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              marginLeft: '20px',
              marginRight: '20px',
              paddingTop: '10px',
              marginTop: '20px'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '1.5rem', // Tailwind "text-2xl"
                    fontWeight: 'bold', // Tailwind "font-bold"
                    color: '#ffffff', // Tailwind "text-white"
                  }}
                >“ҮНЭГҮЙ”</p>
                <p
                  style={{
                    fontSize: '1.25rem', // Tailwind "text-xl"
                    fontWeight: 400, // Tailwind "font-normal"
                    paddingBottom: '12px', // Tailwind "pb-3" (3 * 4px = 12px)
                    color: '#ffffff', // Tailwind "text-white"
                  }}
                >
                  АШИГЛАХ БОЛОМЖТОЙ ҮНДСЭН МОДУЛЬ
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: mdUp ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(150px, 1fr))',
                  gridAutoRows: '1fr',
                  gap: '20px',
                  padding: '20px', // Padding around the grid view items
                }}
              >
                {descriptionList.map((el, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: COLORS.Primary,
                      borderRadius: '20px',
                      padding: '15px', // Padding inside each grid item
                      backgroundColor: 'white',
                      height: '100%',
                      textAlign: 'center', // Centers text horizontally
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '600',
                        marginBottom: '10px',
                        fontSize: '1rem',
                        color: COLORS.Primary,
                      }}
                    >
                      {el.title}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start', // Centers content vertically
                        alignItems: 'center', // Centers content horizontally
                      }}
                    >
                      {el.content.map((item, idx) => (
                        <p
                          key={idx}
                          style={{
                            fontSize: '0.75rem', // Tailwind "text-xs"
                            color: '#374151', // Tailwind "text-gray-700"
                            lineHeight: 1.25, // Tailwind "leading-tight"
                            paddingBottom: '8px', // Tailwind "pb-2" (2 * 4px = 8px)
                            margin: '5px 0', // Adds consistent spacing
                          }}
                        >
                          {idx + 1}. {item}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            id="paid-mobile"
            style={{
              height: 'auto',
              backgroundColor: COLORS.Green,
              borderRadius: '20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              marginLeft: '20px',
              marginRight: '20px',
              paddingTop: '10px',
              marginTop: '20px'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '1.5rem', // Tailwind "text-2xl"
                    fontWeight: 'bold', // Tailwind "font-bold"
                    color: '#ffffff', // Tailwind "text-white"
                  }}
                >
                  “ТӨЛБӨРТЭЙ”
                </p>
                <p
                  style={{
                    fontSize: '1.25rem', // Tailwind "text-xl"
                    fontWeight: 400, // Tailwind "font-normal"
                    paddingBottom: '12px', // Tailwind "pb-3" (3 * 4px = 12px)
                    color: '#ffffff', // Tailwind "text-white"
                  }}
                >
                  АШИГЛАХ БОЛОМЖТОЙ НЭМЭЛТ МОДУЛЬ
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: mdUp ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(150px, 1fr))',
                  gridAutoRows: '1fr',
                  gap: '20px',
                  padding: '20px', // Padding around the grid view items
                }}
              >
                {descriptionList.map((el, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: COLORS.Primary,
                      borderRadius: '20px',
                      padding: '15px', // Padding inside each grid item
                      backgroundColor: 'white',
                      height: '100%',
                      textAlign: 'center', // Centers text horizontally
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '600',
                        marginBottom: '10px',
                        fontSize: '1rem',
                        color: COLORS.Primary,
                      }}
                    >
                      {el.title}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start', // Centers content vertically
                        alignItems: 'center', // Centers content horizontally
                      }}
                    >
                      {el.content2.map((item, idx) => (
                        <p
                          key={idx}
                          style={{
                            fontSize: '0.75rem', // Tailwind "text-xs"
                            color: '#374151', // Tailwind "text-gray-700"
                            lineHeight: 1.25, // Tailwind "leading-tight"
                            paddingBottom: '8px', // Tailwind "pb-2" (2 * 4px = 8px)
                            margin: '5px 0',
                          }}
                        >
                          {idx + 1}. {item}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>



        <div
          id='module-desktop-view'
          style={{
            position: 'relative',
            display: 'block'
          }}
        >
          <div
            id='free'
            style={{
              height: '33%',
              width: 'calc(100% - 40px)',
              backgroundColor: COLORS.Third,
              position: 'absolute',
              paddingLeft: '20px',
              paddingRight: '20px',
              left: '20px',
              top: '180px',
              borderRadius: '20px'
            }}>
            <div
              style={{
                height: '100%',
                width: 'calc(29.5% - 40px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                justifyItems: 'center',
                alignContent: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '1.5rem', // Tailwind "text-2xl"
                  fontWeight: 'bold', // Tailwind "font-bold"
                  color: '#ffffff', // Tailwind "text-white"
                }}
              >
                “ҮНЭГҮЙ”
              </p>
              <p
                style={{
                  fontSize: '1.25rem', // Tailwind "text-xl"
                  fontWeight: 400, // Tailwind "font-normal"
                  paddingBottom: '12px', // Tailwind "pb-3" (3 * 4px = 12px)
                  color: '#ffffff', // Tailwind "text-white"
                  textAlign: 'center'
                }}
              >
                АШИГЛАХ БОЛОМЖТОЙ ҮНДСЭН МОДУЛЬ
              </p>
            </div>
          </div>


          <div
            id='paid'
            style={{
              height: '25%',
              width: 'calc(100% - 40px)',
              backgroundColor: COLORS.Green,
              position: 'absolute',
              paddingLeft: '20px',
              paddingRight: '20px',
              left: '20px',
              top: `calc(230px + 35%)`,
              borderRadius: '20px',
            }}>
            <div
              style={{
                height: '100%',
                width: 'calc(29.5% - 40px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                justifyItems: 'center',
                alignContent: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '1.5rem', // Tailwind "text-2xl"
                  fontWeight: 'bold', // Tailwind "font-bold"
                  color: '#ffffff', // Tailwind "text-white"
                }}

              >
                “ТӨЛБӨРТЭЙ”
              </p>
              <p
                style={{
                  fontSize: '1.25rem', // Tailwind "text-xl"
                  fontWeight: 400, // Tailwind "font-normal"
                  paddingBottom: '12px', // Tailwind "pb-3" (3 * 4px = 12px)
                  color: '#ffffff', // Tailwind "text-white"
                  textAlign: 'center'
                }}
              >
                АШИГЛАХ БОЛОМЖТОЙ НЭМЭЛТ МОДУЛЬ
              </p>
            </div>
          </div>


          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              position: 'relative',
              paddingTop: "40px",
              paddingRight: '40px',
            }}
          >
            {descriptionList.map((el) => {
              return <div
                style={{
                  width: '13.5%',
                  // height: '100%',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: COLORS.Primary,
                  borderRadius: '20px',
                  position: 'relative',
                  marginLeft: '10px'
                }}
              >
                <div
                  style={{
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: COLORS.Primary,
                    borderRadius: '20px',
                    padding: '5px 15px',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'green',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    fontSize: 14
                  }}
                >
                  <p style={{ margin: 0 }}>{el.title}</p>
                </div>
                <div
                  style={{
                    paddingTop: "150px",
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                >
                  <div
                    id='item-height'
                    style={{
                      height: '280px'
                    }}
                  >
                    {el.content.map((item, index) => {
                      return <p key={index} style={{
                        color: '#ffffff', // Tailwind "text-white"
                        lineHeight: 1.25, // Tailwind "leading-tight"
                        fontSize: '0.75rem', // Tailwind "text-xs"
                        paddingBottom: '8px', // Tailwind "pb-2" (2 * 4px = 8px)
                      }}
                      >{index + 1}. {item}</p>
                    })}
                  </div>

                  {el.content2.map((item, index) => {
                    return <p key={index} style={{
                      color: '#ffffff', // Tailwind "text-white"
                      lineHeight: 1.25, // Tailwind "leading-tight"
                      fontSize: '0.75rem', // Tailwind "text-xs"
                      paddingBottom: '8px', // Tailwind "pb-2" (2 * 4px = 8px)
                    }}
                    >{index + 1}. {item}</p>
                  })}
                  <div style={{
                    height: '30px'
                  }} />
                </div>
              </div>
            })}
          </div>
        </div>
      </div>

      <div style={{
        height: '20px'
      }} />
    </div>
  );
}