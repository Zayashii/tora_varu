'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Stack } from '@mui/system';
import { COLORS } from 'src/layouts/config-layout';
import Button from '@mui/material/Button';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import SmsPay from 'src/components/custom/sms-pay';
import { useSearchParams, useRouter } from 'src/routes/hooks';
import { getSubDesc, getSubQpay, getSubs } from 'src/api/subscription';
import { useAuthContext } from 'src/auth/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
import { formatMoney } from 'src/utils/formatter';

//

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function SelectBundleView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { enqueueSnackbar } = useSnackbar();


  const [payAmount, setPayAmount] = useState(0)

  const [discountAmount, setDiscountAmount] = useState(0)

  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))

  const [step, setStep] = useState(1)

  const [isLoading, setIsLoading] = useState(false)

  const [bundles, setBundles] = useState([])

  const { logout, login } = useAuthContext();

  const [invoiceData, setInvoiceData] = useState()

  const [price, setPrice] = useState(0)

  const [desc, setDesc] = useState('')

  async function getData() {
    try {
      setIsLoading(true)
      const { success, msg, data } = await getSubs({}, login)
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

  useEffect(() => {
    updateEndDate()
  }, [bundles])


  const updateEndDate = () => {
    const today = new Date();

    // Get the month value from selected duration (you want month, not price)
    let month = bundles
      .find(cat => cat.isSelected)
      ?.durations.find(d => d.isSelected)?.month ?? 0;

    today.setMonth(today.getMonth() + month);

    // Set formatted date string based on updated 'today'
    setEndDate(today.toISOString().slice(0, 10));
  };


  const selectBundle = (index) => {
    const updated = bundles.map((bundle, i) => ({
      ...bundle,
      isSelected: i === index,
    }));
    setBundles(updated);
  };

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

  const InvoiceSchema = Yup.object().shape({
    // username: Yup.string().required('Хэрэглэгчийн нэр бөглөнө үү'),
    // rd: Yup.string().required('Хувь хүний РД бөглөнө үү'),
    // email: Yup.string().required('И-мэйл хаяг бөглөнө үү').email('И-мэйл хаяг зөв оруулна уу'),
  });

  const defaultValues = {
    username: '',
    rd: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(InvoiceSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      let selectedBundleId = bundles
        .find(cat => cat.isSelected)
        ?.durations.find(d => d.isSelected)?.id
      const { success, msg, data } = await getSubQpay({ subid: selectedBundleId }, login)
      const { success2, msg2, data2 } = await getSubDesc({ subid: selectedBundleId }, login)

      console.log("success, msg, data", success, msg, data);
      console.log("success2, msg2, data2", success2, msg2, data2);

      if (!success || !success2) {
        if (msg === "Дахин нэвтэрнэ үү!" || msg2 === "Дахин нэвтэрнэ үү!") {
          setIsLoading(false)
          enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
          logout()
          router.push(paths.auth.jwt.login);
          return;
        } else {
          const fallbackError = 'Алдаа гарлаа!';
          const primaryMessage = typeof msg === 'string' && msg ? msg : fallbackError;
          const secondaryMessage = typeof msg2 === 'string' && msg2 ? msg2 : null;
          enqueueSnackbar(primaryMessage, { variant: 'error' })
          if (secondaryMessage) {
            enqueueSnackbar(secondaryMessage, { variant: 'error' })
          }
          setIsLoading(false)
          return;
        }
      }
      setInvoiceData(data)
      setDesc(data2.txninfo)
      setStep(2)
      let purePrice = bundles
        .find(cat => cat.isSelected)
        ?.durations.find(d => d.isSelected)?.price - bundles
          .find(cat => cat.isSelected)
          ?.durations.find(d => d.isSelected)?.discount
      setPrice(purePrice)
      enqueueSnackbar('Амжилттай');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Алдаа гарлаа!", { variant: 'error' })
    }
  });

  const router = useRouter();



  return (
    <>
      {isLoading ? <LoadingScreen
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1.5,
          bgcolor: 'background.default',
          height: '55vh',
          width: '100%',
        }}
      /> : step === 1 ? <Container maxWidth={settings.themeStretch ? false : 'xxl'}>
        <div style={{
          paddingTop: isSmDown ? '30px' : '50px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}>
          <div style={{
            position: 'absolute',
            top: isSmDown ? 10 : 15,
            left: isSmDown ? 12 : 20,
            cursor: 'pointer',
          }} onClick={() => { router.push(paths.dashboard.root); }}>
            <Iconify icon="ic:twotone-keyboard-backspace" width={23} sx={{ color: 'black' }} />
          </div>
          <Stack
            display="flex"
            flexDirection={{ xs: 'column', lg: 'row' }}
            alignItems={{ xs: 'stretch', lg: 'flex-start' }}
            gap={{ xs: 4, md: 6 }}
          >
            <Stack
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              flexWrap="wrap"
              sx={{
                width: { xs: '100%', lg: '60vw' },
                gap: { xs: 3, md: 5 },
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
                      padding: isMdDown ? '40px 20px 70px' : '100px',
                      width: isMdDown ? '100%' : 'auto',
                      minWidth: isMdDown ? '100%' : '320px',
                      boxSizing: 'border-box',
                      flex: isMdDown ? '1 1 100%' : '0 1 auto',
                    }}
                  >
                    <div
                      style={{
                        borderWidth: '3px',
                        borderStyle: 'solid',
                        borderColor: COLORS.Primary,
                        borderRadius: '20px',
                        padding: isSmDown ? '8px 20px' : '10px 40px',
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: isSmDown ? '-18px' : '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'green',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        fontSize: 14,
                      }}
                    >
                      <p style={{ margin: 0, color: COLORS.Primary, fontSize: isSmDown ? '16px' : '18px', fontWeight: 'bold' }}>{el.name}</p>
                    </div>
                    <div
                      style={{
                        paddingTop: isMdDown ? '90px' : '150px',
                        paddingBottom: isMdDown ? '90px' : '150px',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignContent: 'center',
                        alignItems: 'center',
                        gap: isSmDown ? '8px' : '12px',
                      }}>
                      <p
                        style={{
                          fontSize: isSmDown ? '20px' : '25px',
                          color: COLORS.Secondary,
                          textAlign: 'center',
                        }}
                      >
                        Хугацаа сонгох
                      </p>
                      <div style={{ height: isSmDown ? '12px' : '20px', }} />
                      <div>
                        {
                          el.durations.map((item, durationIdx) => {
                            return <div key={item.id || durationIdx} onClick={() => { selectDuration(index, durationIdx) }}>
                              {
                                item.isSelected ? <>
                                  <div style={{ height: '15px', }} />
                                  <div style={{ height: '2px', width: '100%', backgroundColor: COLORS.Green, alignSelf: 'center', justifySelf: 'center' }} />
                                  <div style={{ height: '15px', }} />
                                </> : <></>
                              }
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: isSmDown ? 'column' : 'row',
                                  alignItems: isSmDown ? 'flex-start' : 'center',
                                  paddingBottom: '15px',
                                  justifyContent: 'space-between',
                                  cursor: 'pointer',
                                  gap: isSmDown ? '4px' : 0,
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    paddingRight: isSmDown ? '0px' : '30px',
                                    color: COLORS.Primary,
                                    fontSize: '16px',
                                    fontWeight: item.isSelected ? 'bold' : null,
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {item.month} САР
                                </div>
                                <p
                                  style={{
                                    color: COLORS.Primary,
                                    fontSize: '25px',
                                    fontWeight: item.isSelected ? 'bold' : null,
                                  }}
                                >
                                  {formatMoney(item.price)}₮
                                </p>
                              </div>
                              {
                                item.isSelected ? <>
                                  <div style={{ height: '2px', width: '100%', backgroundColor: COLORS.Green, alignSelf: 'center', justifySelf: 'center' }} />
                                  <div style={{ height: '15px', }} />
                                </> : <></>
                              }
                            </div>
                          })
                        }
                      </div>

                      <div style={{
                        position: isMdDown ? 'relative' : 'absolute',
                        bottom: isMdDown ? 'auto' : 120,
                        marginTop: isMdDown ? '12px' : '0px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => selectBundle(index)}>
                          <div
                            style={{
                              width: '30px',
                              height: '30px',
                              backgroundColor: COLORS.Green,
                              borderRadius: '50%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            {el.isSelected && <Iconify icon="mdi:check-bold" width={20} sx={{ color: 'white' }} />}
                          </div>
                          <div style={{
                            color: COLORS.Primary,
                            fontSize: '15px',
                            fontWeight: el.isSelected ? 'bold' : null,
                          }}>БАГЦ СОНГОХ</div>
                        </div>
                      </div>
                      <div style={{ height: isSmDown ? '24px' : '40px', }} />
                    </div>
                  </div>
                );
              })}
            </Stack>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Stack
                display={"flex"}
                flexGrow={1}
                flexDirection={"column"}
                sx={{
                  width: '100%',
                  maxWidth: 520,
                  mx: { xs: 'auto', lg: 0 },
                }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    id='module-title'
                    style={{
                      // paddingRight: '15%',
                      paddingTop: isSmDown ? '20px' : '60px',
                      textAlign: isSmDown ? 'center' : 'left',
                    }}>
                    <p
                      style={{
                        color: COLORS.Primary,
                        fontWeight: 400,
                        fontSize: isSmDown ? '1.1rem' : '1.5rem',
                        paddingBottom: 3,
                        margin: 0,
                      }}
                    >
                      “ХУРГАН ЗЭЭЛ”  СИСТЕМ
                    </p>
                    <p
                      style={{
                        color: COLORS.Primary,
                        fontWeight: 'bold',
                        fontSize: isSmDown ? '1.6rem' : '2.25rem',
                        margin: 0,
                      }}
                    >
                      ТӨЛБӨРИЙН НЭХЭМЖЛЭЛ
                    </p>
                  </div>


                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ height: isSmDown ? '40px' : '100px' }} />
                    <div style={{ height: '2px', width: isSmDown ? '100%' : '70%', backgroundColor: COLORS.Green, alignSelf: 'center', justifySelf: 'center' }} />

                    <div style={{ height: '10px' }} />
                    <div style={{
                      display: 'flex',
                      flexDirection: isSmDown ? 'column' : 'row',
                      alignItems: 'center',
                      width: isSmDown ? '100%' : '70%',
                      justifyContent: isSmDown ? 'center' : 'space-between',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      gap: isSmDown ? '6px' : 0,
                      textAlign: isSmDown ? 'center' : 'left',
                    }}>
                      <div
                        style={{
                          paddingRight: '30px',
                          color: COLORS.Primary,
                          fontSize: '20px',
                        }}
                      >
                        Төлөх дүн
                      </div>
                      <p
                        style={{
                          color: COLORS.Primary,
                          fontSize: '30px',
                          fontWeight: 'bold',
                        }}
                      >
                        {
                          bundles
                            .find(cat => cat.isSelected)
                            ?.durations.find(d => d.isSelected)?.price - bundles
                              .find(cat => cat.isSelected)
                              ?.durations.find(d => d.isSelected)?.discount
                        }₮
                      </p>

                    </div>

                    <div style={{ height: '10px' }} />
                    <div style={{ height: '2px', width: isSmDown ? '100%' : '70%', backgroundColor: COLORS.Green, alignSelf: 'center', justifySelf: 'center' }} />

                    <div style={{ height: '10px' }} />
                    <div style={{
                      display: 'flex',
                      flexDirection: isSmDown ? 'column' : 'row',
                      alignItems: 'center',
                      width: isSmDown ? '100%' : '70%',
                      justifyContent: isSmDown ? 'center' : 'space-between',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      gap: isSmDown ? '6px' : 0,
                      textAlign: isSmDown ? 'center' : 'left',
                    }}>
                      <div
                        style={{
                          paddingRight: '30px',
                          color: COLORS.Primary,
                          fontSize: '20px',
                        }}
                      >
                        Хөнгөлөлтийн дүн
                      </div>
                      <p
                        style={{
                          color: COLORS.Primary,
                          fontSize: '30px',
                          fontWeight: 'bold',
                        }}
                      >
                        {bundles
                          .find(cat => cat.isSelected)
                          ?.durations.find(d => d.isSelected)?.discount}₮
                      </p>
                    </div>

                    <div style={{ height: '10px' }} />
                    <div style={{ height: '2px', width: isSmDown ? '100%' : '70%', backgroundColor: COLORS.Green, alignSelf: 'center', justifySelf: 'center' }} />
                    <div style={{ height: '10px' }} />

                    <div style={{
                      display: 'flex',
                      flexDirection: isSmDown ? 'column' : 'row',
                      alignItems: 'center',
                      width: isSmDown ? '100%' : '70%',
                      justifyContent: isSmDown ? 'center' : 'flex-end',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      gap: isSmDown ? '6px' : 0,
                      textAlign: isSmDown ? 'center' : 'left',
                    }}>
                      <div
                        style={{
                          paddingRight: '30px',
                          color: 'red',
                          fontSize: '15px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        ДУУСАХ ХУГАЦАА
                      </div>
                      <p
                        style={{
                          color: 'red',
                          fontSize: '15px',
                          fontWeight: 'bold',
                        }}
                      >
                        {endDate} өдөр
                      </p>
                    </div>
                  </div>

                </div>
                <div style={{ height: isSmDown ? '40px' : '100px' }} />
                {/* <p style={{
                  color: COLORS.Primary,
                  fontSize: '15px',
                }}>
                  Хэрэглэгчийн доорх мэдээллийн дагуу НӨАТ тооцож баримт илгээнэ
                </p> */}
                {/* <div style={{ height: '20px' }} />
                <Stack display="flex" flexDirection="row">

                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(3, 1fr)',
                    }}
                  >
                    <RHFTextField name="username" label="Хэрэглэгчийн нэр" />
                    <RHFTextField name="rd" label="Хувь хүний РД" />
                    <RHFTextField name="email" label="И-Мэйл хаяг" />
                  </Box>
                </Stack> */}
                {/* <div style={{ height: '20px' }} />
                <p style={{
                  color: 'red',
                  fontSize: '13px',
                }}>
                  Таны мэдээлэл буруу байвал системийн бүртгэл хэсэг уруу шилжиж мэдээллийг шинэчилнэ үү?
                </p> */}

                {/* <RHFTextField name="rd" label="Хувь хүний РД" /> */}

                <div style={{ height: '20px' }} />
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{
                    backgroundColor: COLORS.Green,
                    '&:hover': {
                      backgroundColor: '#2e7d32',
                    },
                    width: isSmDown ? '100%' : '100px',
                    alignSelf: isSmDown ? 'stretch' : 'center',
                  }}>
                  ТӨЛӨХ
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Stack>
        </div>
      </Container > : <SmsPay addBundle={true} setStep={setStep} invoiceData={invoiceData} price={price} desc={desc} />
      }

    </>
  );
}
