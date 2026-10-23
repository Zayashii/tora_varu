import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingButton from '@mui/lab/LoadingButton';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableSkeleton,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { COLORS } from 'src/layouts/config-layout';
import { Typography, useMediaQuery } from '@mui/material';
import FormProvider, {
    RHFSwitch,
    RHFTextField,
    RHFUploadAvatar,
    RHFAutocomplete,
} from 'src/components/hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { paths } from 'src/routes/paths';
import { useSearchParams, useRouter } from 'src/routes/hooks';
import { formatMoney } from 'src/utils/formatter';
import { checkSubQpay } from 'src/api/subscription';
import { useTheme } from '@mui/material/styles';



export default function SmsPay({ user, addBundle, setStep, invoiceData, price, desc }) {
    const settings = useSettingsContext();
    const { logout, login } = useAuthContext();
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    const [isCheckBtnLoading, setIsCheckBtnLoading] = useState(false);

    const table = useTable();
    const { enqueueSnackbar } = useSnackbar();

    const InvoiceSchema = Yup.object().shape({
        username: Yup.string().required('Хэрэглэгчийн нэр бөглөнө үү'),
        rd: Yup.string().required('Хувь хүний РД бөглөнө үү'),
        email: Yup.string().required('И-мэйл хаяг бөглөнө үү').email('И-мэйл хаяг зөв оруулна уу'),
    });

    const defaultValues = {
        username: user?.username || '',
        rd: user?.rd || '',
        email: user?.email || '',
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

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            enqueueSnackbar('Update success!');
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    const [bundles, setBundles] = useState([
        {
            name: 'нэр сар',
            price: '00.0',
            isSelected: true,
        },
        {
            name: 'гурван сар',
            price: '00.0',
            isSelected: false,
        },
        {
            name: 'зургаан сар',
            price: '00.0',
            isSelected: false,
        }
    ])

    const selectBundle = (index) => {
        const updated = bundles.map((bundle, i) => ({
            ...bundle,
            isSelected: i === index,
        }));
        setBundles(updated);
    };

    const router = useRouter();

    return <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
            heading={
                <>
                    <div style={{
                        display: 'flex',
                        flexDirection: isSmDown ? 'column' : 'row',
                        alignContent: 'center',
                        alignItems: isSmDown ? 'flex-start' : 'center',
                        gap: isSmDown ? '4px' : 0,
                    }}>
                        <div style={{ paddingRight: isSmDown ? '0px' : '50px' }}>{addBundle ? "Төлбөр төлөх QPay" : "Мессеж төлбөр цэнэглэх"}</div>
                    </div>
                </>
            }
            links={[
                <></>
            ]}
            action={
                addBundle ? <></> : <div style={{
                    display: 'flex',
                    flexDirection: isSmDown ? 'column' : 'row',
                    alignItems: isSmDown ? 'flex-start' : 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: isSmDown ? '12px 14px' : '12px',
                    backgroundColor: '#fff',
                    gap: isSmDown ? '10px' : '12px',
                    width: isSmDown ? '100%' : 'auto',
                    boxSizing: 'border-box',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isSmDown ? 'flex-start' : 'flex-end', paddingLeft: '8px' }}>
                        <p style={{
                            fontSize: '15px',
                            color: '#969696'
                        }}>
                            Үлдэгдэл багц
                        </p>
                        <p style={{
                            fontSize: '12px',
                            color: 'black',
                            fontWeight: 'bold'
                        }}>756.0₮</p>
                    </div>
                    <div style={{
                        width: isSmDown ? '100%' : '1px',
                        height: isSmDown ? '1px' : '40px',
                        backgroundColor: '#969696'
                    }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <p style={{
                            fontSize: '15px',
                            color: '#969696'
                        }}>
                            Хугацаа
                        </p>
                        <p style={{
                            fontSize: '12px',
                            color: 'black',
                            fontWeight: 'bold'
                        }}>2025-06-30</p>
                    </div>
                    <Button
                        // component={RouterLink}
                        // href={paths.dashboard.settings.newConsumer}
                        variant="contained"
                        sx={{
                            width: isSmDown ? '100%' : 'auto',
                        }}
                    >
                        Дэлгэрэнгүй
                    </Button>
                </div>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
        />

        <div style={{ display: 'flex', flexDirection: isMdDown ? 'column' : 'row', gap: isMdDown ? '24px' : '32px' }}>
            <div
                style={{
                    position: 'relative',
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderColor: COLORS.Primary,
                    borderRadius: '20px',
                    padding: isSmDown ? '12px' : '16px',
                    width: isMdDown ? '100%' : '60%',
                    boxSizing: 'border-box',
                }}
            >
                <div
                    style={{
                        paddingTop: isSmDown ? '12px' : '30px',
                        paddingBottom: isSmDown ? '60px' : '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignContent: 'center',
                        alignItems: 'center',
                        paddingLeft: isSmDown ? '16px' : '40px',
                        paddingRight: isSmDown ? '16px' : '40px',
                        gap: isSmDown ? '16px' : '24px',
                    }}>

                    {/* <div style={{
                        position: 'absolute',
                        top: 15,
                        left: 20,
                        cursor: 'pointer',
                    }} onClick={() => { setStep(2) }}>
                        <Iconify icon="ic:twotone-keyboard-backspace" width={23} sx={{ color: 'black' }} />
                    </div> */}

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <img
                            src={"data:image/png;base64," + invoiceData?.qr_image}
                            alt="QR code"
                            style={{
                                width: '100%',
                                maxWidth: isSmDown ? '260px' : '360px',
                                height: 'auto',
                                objectFit: 'contain',
                                display: 'flex',
                                alignSelf: 'center',
                                justifySelf: 'center',
                                alignContent: 'center',
                                justifyContent: 'center',
                                justifyItems: 'center'
                            }}
                        />

                        <div style={{
                            display: 'flex',
                            flexDirection: isSmDown ? 'column' : 'row',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: isSmDown ? '10px' : '50px',
                            gap: isSmDown ? '12px' : '0px',
                            width: '100%',
                        }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{
                                    width: isSmDown ? '100%' : '100px',
                                    height: '40px',
                                    fontSize: '14px',
                                }}
                                onClick={() => {
                                    if (addBundle) {
                                        setStep(1)
                                    } else {
                                        setStep(2)
                                    }
                                }}
                            >
                                Буцах
                            </Button>

                            <div style={{ width: isSmDown ? '0px' : '30px' }} />

                            <LoadingButton
                                onClick={async () => {
                                    try {
                                        setIsCheckBtnLoading(true)
                                        const { success, msg, data } = await checkSubQpay({ invoiceno: invoiceData?.khurgan_invoiceno }, login)

                                        console.log("zxc=>?", success, msg, data);


                                        if (!success) {
                                            if (msg === "Дахин нэвтэрнэ үү!") {
                                                setIsCheckBtnLoading(false)
                                                enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
                                                logout()
                                                router.push(paths.auth.jwt.login);
                                                return;
                                            } else {
                                                enqueueSnackbar(msg, { variant: 'error' })
                                                setIsCheckBtnLoading(false)
                                                return;
                                            }
                                        }
                                        enqueueSnackbar(msg)
                                        if (addBundle) {
                                            router.push(paths.dashboard.root);
                                        } else {
                                            router.push(paths.dashboard.settings.message.payment);
                                        }
                                    } catch (error) {
                                        console.log(error);
                                    } finally {
                                        setIsCheckBtnLoading(false)
                                    }
                                }}
                                variant="contained"
                                color="success"
                                loading={isCheckBtnLoading}
                                sx={{
                                    width: isSmDown ? '100%' : '150px',
                                    height: '40px',
                                    fontSize: '14px',
                                }}
                            >
                                Төлбөр шалгах
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{
                paddingRight: isMdDown ? '0px' : '60px',
                paddingLeft: isMdDown ? '0px' : '60px',
                display: 'flex',
                flexDirection: 'column',
                width: isMdDown ? '100%' : '40%',
                alignSelf: 'center',
                justifySelf: 'center',
                boxSizing: 'border-box'
            }}>

                <Typography
                    variant="h6"
                    sx={{
                        color: COLORS.Primary,
                        pb: 0.5,
                        lineHeight: 1,
                    }}
                >
                    ТӨЛБӨРИЙН МЭДЭЭЛЭЛ
                </Typography>

                <div style={{ height: isSmDown ? '16px' : '30px' }} />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isSmDown ? '12px' : '0px',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: isSmDown ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isSmDown ? 'flex-start' : 'center',
                        paddingTop: isSmDown ? '16px' : '30px',
                        width: '100%',
                        gap: isSmDown ? '4px' : 0,
                    }}>
                        <p style={{
                            color: COLORS.Primary,
                            fontSize: '13px'
                        }}>
                            Банк
                        </p>
                        <p style={{
                            color: COLORS.Primary,
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            ХААН БАНК
                        </p>
                    </div>
                    <div style={{ height: '2px', width: '100%', backgroundColor: COLORS.Green, marginTop: '3px' }} />
                    <div style={{ height: '10px' }} />

                    <div style={{
                        display: 'flex',
                        flexDirection: isSmDown ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isSmDown ? 'flex-start' : 'center',
                        paddingTop: isSmDown ? '16px' : '30px',
                        width: '100%',
                        gap: isSmDown ? '4px' : 0,
                    }}>
                        <p style={{
                            color: COLORS.Primary,
                            fontSize: '13px'
                        }}>
                            Дансны дугаар
                        </p>
                        <p style={{
                            color: COLORS.Primary,
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            5084301831
                        </p>
                    </div>
                    <div style={{ height: '2px', width: '100%', backgroundColor: COLORS.Green, marginTop: '3px' }} />
                    <div style={{ height: '10px' }} />


                    <div style={{
                        display: 'flex',
                        flexDirection: isSmDown ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isSmDown ? 'flex-start' : 'center',
                        paddingTop: isSmDown ? '16px' : '30px',
                        width: '100%',
                        gap: isSmDown ? '4px' : 0,
                    }}>
                        <p style={{
                            color: COLORS.Primary,
                            fontSize: '13px'
                        }}>
                            Данс эзэмшигч
                        </p>
                        <p style={{
                            color: COLORS.Primary,
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            ТОРУ ВАРУ ХХК
                        </p>
                    </div>
                    <div style={{ height: '2px', width: '100%', backgroundColor: COLORS.Green, marginTop: '3px' }} />
                    <div style={{ height: '10px' }} />

                    <div style={{
                        display: 'flex',
                        flexDirection: isSmDown ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isSmDown ? 'flex-start' : 'center',
                        paddingTop: isSmDown ? '16px' : '30px',
                        width: '100%',
                        gap: isSmDown ? '4px' : 0,
                    }}>
                        <p style={{
                            color: COLORS.Primary,
                            fontSize: '13px'
                        }}>
                            Төлөх дүн
                        </p>
                        <p style={{
                            color: COLORS.Primary,
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            {formatMoney(price)}₮
                        </p>
                    </div>
                    <div style={{ height: '2px', width: '100%', backgroundColor: COLORS.Green, marginTop: '3px' }} />
                    <div style={{ height: '10px' }} />

                    <div style={{
                        display: 'flex',
                        flexDirection: isSmDown ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isSmDown ? 'flex-start' : 'center',
                        paddingTop: isSmDown ? '16px' : '30px',
                        width: '100%',
                        gap: isSmDown ? '4px' : 0,
                    }}>
                        <p style={{
                            color: COLORS.Primary,
                            fontSize: '13px'
                        }}>
                            Гүйлгээний утга
                        </p>
                        <p style={{
                            color: COLORS.Primary,
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            {desc ?? ""}
                        </p>
                    </div>
                    <div style={{ height: '2px', width: '100%', backgroundColor: COLORS.Green, marginTop: '3px' }} />
                    <div style={{ height: '10px' }} />
                </div>


            </div>
        </div>
    </Container >
}
