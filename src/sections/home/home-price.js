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
import Iconify from 'src/components/iconify';
import Button from '@mui/material/Button';
import { LoadingScreen } from 'src/components/loading-screen';
import { getSubs } from 'src/api/subscription';
import { useSnackbar } from 'src/components/snackbar';
import { formatMoney } from 'src/utils/formatter';

// ----------------------------------------------------------------------

export default function HomePrice({ priceRef }) {
  const mdUp = useResponsive('up', 'md');

  const textRef = useRef(null);

  const [textWidth, setTextWidth] = useState(0);

  const [isLoading, setIsLoading] = useState(true)

  const [bundles, setBundles] = useState([])

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (textRef.current) {
      console.log("zxc ===========> ", textRef.current.offsetWidth)
      setTextWidth(textRef.current.offsetWidth); // Get the width of the content
    }
  }, []);

  async function getData() {
    try {
      setIsLoading(true)
      const { success, msg, data } = await getSubs()
      if (!success) {
        if (msg === "Дахин нэвтэрнэ үү!") {
          setIsLoading(false)
          enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
          logout()
          router.push(paths.auth.jwt.login);
          return;
        } else {
          enqueueSnackbar(msg, { variant: 'error' })
          setIsLoading(false)
          return;
        }
      }
      const list = Object.entries(data).map(([key, value], index) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        isSelected: index === 0, // first category selected
        durations: value.map((item, i) => ({
          ...item,
          isSelected: i === 0 // first item in duration selected
        }))
      }));

      setBundles(list)

      console.log("list ========>", list);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getData();
  }, [])

  const selectDuration = (bundleIdx, durationIdx) => {
    const updated = bundles.map((bundle, i) => {
      if (i === bundleIdx) {
        return {
          ...bundle,
          isSelected: true,
          durations: bundle.durations.map((duration, j) => ({
            ...duration,
            isSelected: j === durationIdx,
          })),
        };
      } else {
        return {
          ...bundle,
          isSelected: false,
        };
      }
    });

    setBundles(updated);
  };

  const datas = [
    {
      'name': 'STANDART',
      'price': '00.0₮/сар',
      'user': [
        {
          'count': '5',
          'name': 'Хэрэглэгч'
        },
        {
          'count': '100',
          'name': 'Харилцагч'
        },
      ],
      'packages': [
        'Стандарт багц',
        'Стандарт багц',
        'Стандарт багц',
        'Стандарт багц',
      ]
    },
    {
      'name': 'STANDART',
      'price': '00.0₮/сар',
      'user': [
        {
          'count': '5',
          'name': 'Хэрэглэгч'
        },
        {
          'count': '100',
          'name': 'Харилцагч'
        },
      ],
      'packages': [
        'Стандарт багц',
        'Стандарт багц',
        'Стандарт багц',
        'Стандарт багц',
      ]
    },
    {
      'name': 'PLUS',
      'price': '00.0₮/сар',
      'user': [
        {
          'count': '5',
          'name': 'Хэрэглэгч'
        },
        {
          'count': '100',
          'name': 'Харилцагч'
        },
      ],
      'packages': [
        'Стандарт багц',
        'Стандарт багц',
        'Стандарт багц',
        'Стандарт багц',
      ]
    },
  ];

  return (
    <div
      ref={priceRef}
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
                fontSize: '1.25rem',  // from text-xl
                fontWeight: '700',     // from font-bold
                paddingBottom: '0.75rem',
              }}
            >
              “ХУРГАН ЗЭЭЛ”  СИСТЕМ
            </p>
            <p
              style={{
                color: COLORS.Primary,
                fontSize: '2.25rem',  // from text-4xl
                fontWeight: '700',
              }}
            >
              ПРОГРАММ АШИГЛАХ ЭРХ АВАХ
            </p>
          </div>
        </div>


        {isLoading ? <LoadingScreen
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 1.5,
            bgcolor: 'background.default',
            height: '55vh',
            width: '100%',
          }} /> : <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gridAutoRows: 'minmax(400px, auto)',
              gap: '8%', // Adjust spacing between items
              paddingLeft: '20%',
              paddingRight: '20%',
              paddingTop: '100px',
            }}
          >
          {bundles.map((el, index) => {
            return (
              <div
                key={index}
                style={{
                  position: 'relative',
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  borderColor: COLORS.Primary,
                  borderRadius: '20px',
                  padding: '10px',
                }}
              >
                <div
                  style={{
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderColor: COLORS.Primary,
                    borderRadius: '20px',
                    padding: '10px 40px',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'green',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    fontSize: 14,
                  }}
                >
                  <p style={{ margin: 0, color: COLORS.Primary, fontSize: '18px', fontWeight: 'bold' }}>{el.name.toUpperCase()}</p>
                </div>
                <div
                  style={{
                    paddingTop: '150px',
                    paddingBottom: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <p
                    style={{
                      fontSize: '60px',
                      color: COLORS.Primary,
                      fontWeight: 'bolder',
                    }}
                  >
                    {formatMoney(bundles[index].durations.find(d => d.isSelected)?.price)}₮/{bundles[index]?.durations.find(d => d.isSelected)?.month} Сар
                  </p>
                  {/* <div style={{ height: '40px', }} />
                  <div style={{ height: '1px', width: '70%', backgroundColor: COLORS.Green }} />
                  <div style={{ height: '15px', }} /> */}
                  <div>

                    {/* <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: '15px',
                      }}
                    >
                      <div
                        style={{
                          height: '30px',
                          width: '35px',
                          backgroundColor: COLORS.Green2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          justifyItems: 'center',
                          alignContent: 'center',
                          borderRadius: '5px',
                        }}
                      >
                        <p
                          style={{
                            color: COLORS.Primary,
                            fontSize: '12px',
                          }}
                        >
                          5
                        </p>
                      </div>
                      <div
                        style={{
                          paddingLeft: '15px',
                          color: COLORS.Primary,
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        1
                      </div>
                    </div> */}
                    {/* {
                      el.user.map(item => {
                        return <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: '15px',
                          }}
                        >
                          <div
                            style={{
                              height: '30px',
                              width: '35px',
                              backgroundColor: COLORS.Green2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              justifyItems: 'center',
                              alignContent: 'center',
                              borderRadius: '5px',
                            }}
                          >
                            <p
                              style={{
                                color: COLORS.Primary,
                                fontSize: '12px',
                              }}
                            >
                              {item.count}
                            </p>
                          </div>
                          <div
                            style={{
                              paddingLeft: '15px',
                              color: COLORS.Primary,
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            {item.name}
                          </div>
                        </div>
                      })
                    } */}
                  </div>
                  <div style={{ height: '1px', width: '70%', backgroundColor: COLORS.Green }} />
                  <div style={{ height: '40px', }} />
                  {
                    el.durations.map((e, idx) => {
                      return <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingBottom: '1px',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          selectDuration(index, idx)
                        }}
                      >
                        <Iconify icon="ic:round-check-circle" width={34} sx={{ ml: 1, color: e.isSelected ? COLORS.Green : COLORS.Green2 }} />
                        <p style={{ paddingLeft: '3px', color: e.isSelected ? COLORS.Secondary : COLORS.Secondary, fontSize: '20px', }}>{e.type}</p>
                      </div>
                    })
                  }
                  <div style={{ height: '20px', }} />
                  <Button variant="contained" target="_blank" rel="noopener" href={paths.minimalUI}
                    sx={{
                      backgroundColor: COLORS.Third,
                      color: 'white',
                      width: '140px',
                      height: '40px',
                      borderRadius: '20px 20px 20px 20px',
                      fontSize: '13px',
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
                  </Button>
                  <div style={{ height: '10px', }} />
                  <Button variant="contained" target="_blank" rel="noopener" href={paths.minimalUI}
                    sx={{
                      backgroundColor: 'white',
                      color: COLORS.Primary,
                      width: '140px',
                      height: '40px',
                      borderRadius: '20px 20px 20px 20px',
                      fontSize: '13px',
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
                    НЭВТРЭХ
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        }
      </div>
    </div >
  );
}
