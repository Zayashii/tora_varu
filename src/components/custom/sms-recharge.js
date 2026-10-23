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
import { Typography } from '@mui/material';
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




export default function SmsRecharge({ user, setStep }) {
    const settings = useSettingsContext();
    const { logout, login } = useAuthContext();

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
            setStep(3)
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


    return <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
            heading={
                <>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}>
                        <div style={{ paddingRight: '50px' }}>Мессеж төлбөр цэнэглэх</div>
                    </div>
                </>
            }
            links={[
                <></>
            ]}
            action={
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '12px',
                    backgroundColor: '#fff',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingLeft: '8px' }}>
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
                        width: '1px',
                        height: '40px',
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
                    >
                        Дэлгэрэнгүй
                    </Button>
                </div>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
        />

        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div
                style={{
                    position: 'relative',
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderColor: COLORS.Primary,
                    borderRadius: '20px',
                    padding: '10px',
                    width: '60%',
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 15,
                    left: 20,
                    cursor: 'pointer',
                }} onClick={() => {setStep(1)}}>
                    <Iconify icon="ic:twotone-keyboard-backspace" width={23} sx={{ color: 'black' }} />
                </div>
                <div
                    style={{
                        paddingTop: '30px',
                        paddingBottom: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignContent: 'center',
                        alignItems: 'center',
                        paddingLeft: '50px',
                        paddingRight: '50px'
                    }}>
                    <p
                        style={{
                            fontSize: '30px',
                            color: COLORS.Green,
                            fontWeight: 'bolder',
                        }}
                    >
                        Багц сонгох
                    </p>
                    <div style={{ height: '30px' }} />


                    {bundles.map((el, index) => (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}>
                            {
                                el.isSelected && <>
                                    <div style={{ height: '15px', }} />
                                    <div style={{ height: '1px', width: '70%', backgroundColor: COLORS.Green }} />
                                    <div style={{ height: '15px', }} />
                                </>
                            }
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: '10px 0',
                                }}
                            >
                                <div style={{ fontSize: '16px', flex: 1, textAlign: 'center', textTransform: 'uppercase', color: COLORS.Primary, fontWeight: el.isSelected ? 'bold' : 'normal' }}>{el.name}</div>

                                <div style={{ fontSize: '18px', flex: 1, textAlign: 'center', fontWeight: el.isSelected ? 'bold' : 'normal' }}>{el.price}₮</div>


                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => selectBundle(index)}>
                                    <div
                                        style={{
                                            width: '35px',
                                            height: '35px',
                                            backgroundColor: COLORS.Green,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {el.isSelected && <Iconify icon="mdi:check-bold" width={23} sx={{ color: 'white' }} />}
                                    </div>
                                    <div>БАГЦ СОНГОХ</div>
                                </div>
                            </div>
                            {
                                el.isSelected && <>
                                    <div style={{ height: '15px', }} />
                                    <div style={{ height: '1px', width: '70%', backgroundColor: COLORS.Green }} />
                                    <div style={{ height: '15px', }} />
                                </>
                            }
                        </div>
                    ))}

                    {/* <div style={{ height: '40px', }} />
                    <div style={{ height: '1px', width: '70%', backgroundColor: COLORS.Green }} />
                    <div style={{ height: '15px', }} />
                    <div>

                    </div>
                    <div style={{ height: '1px', width: '70%', backgroundColor: COLORS.Green }} />
                    <div style={{ height: '40px', }} /> */}

                </div>
            </div>
            <div style={{ paddingRight: '60px', paddingLeft: '60px', display: 'flex', flexDirection: 'column', width: '40%' }}>
                <Typography
                    variant="h7"
                    sx={{
                        color: COLORS.Primary,
                        pb: 1,
                        lineHeight: 1,
                    }}
                >
                    "ХУРГАН ЗЭЭЛ" СИСТЕМД
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        color: COLORS.Primary,
                        pb: 0.5,
                        lineHeight: 1,
                    }}
                >
                    ТӨЛБӨРИЙН НЭХЭМЖЛЭЛ
                </Typography>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: '30px',
                        width: '70%',
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
                            00.0₮
                        </p>
                    </div>
                    <div style={{ height: '2px', width: '70%', backgroundColor: COLORS.Green, marginTop: '3px' }} />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: '5px',
                        width: '70%'
                    }}>
                        <p style={{
                            color: 'red',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            ДУУСАХ ХУГАЦАА
                        </p>
                        <p style={{
                            color: 'red',
                            fontWeight: 'bold',
                            fontSize: '15px'
                        }}>
                            2025.12.12
                        </p>
                    </div>
                </div>

                <p style={{
                    color: COLORS.Primary,
                    marginTop: '60px',
                    marginBottom: '30px',
                    fontSize: '13px'
                }}>
                    Хэрэглэгчийн доорх мэдээллийн дагуу НӨАТ тооцож баримт илгээнэ
                </p>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(1, 1fr)',
                        }}
                    >
                        <RHFTextField name="username" label="Хэрэглэгчийн нэр" />
                        <RHFTextField name="rd" label="Хувь хүний РД" />
                        <RHFTextField name="email" label="И-Мэйл хаяг" />
                    </Box>


                    <p style={{
                        color: 'red',
                        marginTop: '10px',
                        marginBottom: '20px',
                        fontSize: '13px'
                    }}>
                        Таны мэдээлэл буруу байвал системийн бүртгэл хэсэг уруу шилжиж мэдээллийг шинэчилнэ үү?
                    </p>

                    <div style={{
                        display: 'flex',
                        alignSelf: 'center',
                        justifySelf: 'center'
                    }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            sx={{
                                width: '100px',
                                height: '40px',
                                fontSize: '14px',
                            }}
                        >
                            Төлөх
                        </Button>
                    </div>
                </FormProvider>
            </div>
        </div>
    </Container>
}