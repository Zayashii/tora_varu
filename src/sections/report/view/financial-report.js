'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSettingsContext } from 'src/components/settings';
import { Card } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, {
    RHFSelect,
    RHFEditor,
    RHFUpload,
    RHFSwitch,
    RHFTextField,
    RHFMultiSelect,
    RHFAutocomplete,
    RHFMultiCheckbox,
} from 'src/components/hook-form';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { display } from '@mui/system';
import { Grid } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { ReportCT } from 'src/api/report';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { formatMoney } from 'src/utils/formatter';



const defaultFilters = {
    begindate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    enddate: new Date(),
};

export default function FinancialReportView() {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { logout } = useAuthContext();
    const settings = useSettingsContext();
    const [filters, setFilters] = useState(defaultFilters);
    const [isLoading, setIsLoading] = useState([])

    const NewProductSchema = Yup.object().shape({
        activezeel_rate: Yup.number(),
        activeexp_zeel_rate: Yup.number(),
        activezeel_aldangi: Yup.number(),
        undsenamt: Yup.number(),
        rateamt: Yup.number(),
    });

    const defaultValues = useMemo(
        () => ({
            activezeel_rate: 0.0,
            activeexp_zeel_rate: 0.0,
            activezeel_aldangi: 0.0,
            undsenamt: 0.0,
            rateamt: 0.0,
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewProductSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = handleSubmit(async (formFrontData) => { });

    async function getData() {
        setIsLoading(true)
        const { success, msg, data } = await ReportCT({ BeginDate: filters.begindate, EndDate: filters.enddate });
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
        setValue('activezeel_rate', formatMoney(data.activezeel_rate));
        setValue('activeexp_zeel_rate', formatMoney(data.activeexp_zeel_rate));
        setValue('activezeel_aldangi', formatMoney(data.activezeel_aldangi));
        setValue('undsenamt', formatMoney(data.undsenamt));
        setValue('rateamt', formatMoney(data.rateamt));
        setIsLoading(false)
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Тайлан 1"
                links={[
                    { name: '' },
                ]}
                action={
                    <></>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Card
                sx={{
                    padding: '30px',
                }}>
                <Stack>
                    <Stack
                        spacing={2}
                        alignItems={{ xs: 'flex-end', md: 'center' }}
                        direction={{
                            xs: 'column',
                            md: 'row',
                        }}
                        sx={{
                            pr: { xs: 2.5, md: 1 },
                            pb: { xs: 3, md: 3 },
                        }}
                    >
                        <DatePicker
                            label="Эхлэх огноо"
                            format="dd/MM/yyyy"
                            value={filters.begindate}
                            maxDate={filters.enddate}
                            onChange={(value) => {
                                setFilters((prevFilters) => ({
                                    ...prevFilters,
                                    begindate: value,
                                }));
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}
                            sx={{
                                maxWidth: { md: 300 },
                            }}
                        />

                        <DatePicker
                            label="Дуусах огноо"
                            format="dd/MM/yyyy"
                            value={filters.enddate}
                            minDate={filters.begindate}
                            onChange={(value) => {
                                setFilters((prevFilters) => ({
                                    ...prevFilters,
                                    enddate: value,
                                }));
                            }}
                            slotProps={{ textField: { fullWidth: true } }}
                            sx={{
                                maxWidth: { md: 300 },
                            }}
                        />

                        <Button
                            variant="contained"
                            onClick={() => {
                                getData()
                            }}
                        >
                            Хайх
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => {
                            }}
                        >
                            Нийт тайлан
                        </Button>
                    </Stack>
                    <div style={{ height: '50px' }} />
                    {isLoading ? <LoadingScreen sx={{ paddingTop: '200px', paddingBottom: '200px' }} /> :
                        <FormProvider methods={methods} onSubmit={onSubmit}>
                            <Grid container spacing={5}>
                                <Grid item xs={12} md={6}>
                                    <RHFTextField disabled name="activezeel_rate" label="Хугацаандаа байгаа зээлийн хүүгийн орлого" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RHFTextField disabled name="undsenamt" label="Зээлийн ҮНДСЭН төлбөрт хүлээн авсан мөнгөн дүн" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RHFTextField disabled name="activezeel_aldangi" label="Хугацаа хэтэрсэн зээлийн хүүгийн орлого" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RHFTextField disabled name="activeexp_zeel_rate" label="Зээлийн ХҮҮГИЙН төлбөрт хүлээн авсан мөнгөн дүн" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RHFTextField disabled name="rateamt" label="Нэмэгдүүлсэн хүүгийн орлого" />
                                </Grid>
                            </Grid>
                        </FormProvider>
                    }
                </Stack>


            </Card>
        </Container>
    )
}