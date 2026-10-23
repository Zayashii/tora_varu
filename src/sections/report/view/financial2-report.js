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
import { ReportZND } from 'src/api/report';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { formatMoney } from 'src/utils/formatter';



const defaultFilters = {
    begindate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    enddate: new Date(),
};

export default function FinancialReport2View() {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { logout } = useAuthContext();
    const settings = useSettingsContext();
    const [filters, setFilters] = useState(defaultFilters);
    const [isLoading, setIsLoading] = useState([])
    const [tableData, setTableData] = useState([])

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

    function formatTableData(apiData) {
        const {
            beginamt = [],
            totalzeelamt = [],
            totalpaidzeelamt = [],
            endamt = []
        } = apiData;

        // Create a map to structure data by collateral type
        const collateMap = new Map();

        // Helper function to update the map
        function updateMap(data, key, valueKey, qtyKey) {
            data.forEach(item => {
                if (!collateMap.has(item.collatetype_id)) {
                    collateMap.set(item.collatetype_id, {
                        id: item.collatetype_id,
                        collatetype_name: item.collatetype_name,
                        beginamt: 0,
                        beginqty: 0,
                        totalzeelamts: 0,
                        zeelqty: 0,
                        percentinmonth: 0,
                        totalpaidamts: 0,
                        paidqty: 0,
                        endamt: 0,
                        endqty: 0
                    });
                }
                collateMap.get(item.collatetype_id)[key] = item[valueKey] ?? 0;
                collateMap.get(item.collatetype_id)[qtyKey] = item.zeelqty ?? 0;
            });
        }

        // Update the map with data from each category
        updateMap(beginamt, "beginamt", "beginamt", "beginqty");
        updateMap(totalzeelamt, "totalzeelamts", "totalzeelamts", "zeelqty");
        updateMap(totalzeelamt, "percentinmonth", "percentinmonth", "zeelqty");
        updateMap(totalpaidzeelamt, "totalpaidamts", "totalpaidamts", "paidqty");
        updateMap(endamt, "endamt", "endamt", "endqty");

        // Convert map values into an array for the table
        return Array.from(collateMap.values()).map((item, index) => ({
            no: index + 1,
            collatetype_name: item.collatetype_name,
            beginamt: item.beginamt,
            beginqty: item.beginqty,
            totalzeelamts: item.totalzeelamts,
            zeelqty: item.zeelqty,
            percentinmonth: item.percentinmonth,
            totalpaidamts: item.totalpaidamts,
            paidqty: item.paidqty,
            endamt: item.endamt,
            endqty: item.endqty
        }));
    }


    async function getData() {
        setIsLoading(true)
        const { success, msg, data } = await ReportZND({ BeginDate: filters.begindate, EndDate: filters.enddate });
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
        const formattedData = formatTableData(data);
        let totalBeginAmt = 0;
        let totalBeginQty = 0;
        let totalZeelAmts = 0;
        let totalZeelQty = 0;
        let totalPaidAmts = 0;
        let totalPaidQty = 0;
        let totalEndAmt = 0;
        let totalEndQty = 0;
        let totalPercentinmonth = 0;

        // Loop through data and calculate totals
        for (let index = 0; index < formattedData.length; index++) {
            const item = formattedData[index];

            totalBeginAmt += item.beginamt || 0;
            totalBeginQty += item.beginqty || 0;
            totalZeelAmts += item.totalzeelamts || 0;
            totalZeelQty += item.zeelqty || 0;
            totalPaidAmts += item.totalpaidamts || 0;
            totalPaidQty += item.paidqty || 0;
            totalEndAmt += item.endamt || 0;
            totalEndQty += item.endqty || 0;
            totalPercentinmonth += item.percentinmonth || 0;
        }

        formattedData.unshift({
            no: "",
            collatetype_name: "НИЙТ",
            beginamt: totalBeginAmt,
            beginqty: totalBeginQty,
            totalzeelamts: totalZeelAmts,
            zeelqty: totalZeelQty,
            percentinmonth: totalPercentinmonth,
            totalpaidamts: totalPaidAmts,
            paidqty: totalPaidQty,
            endamt: totalEndAmt,
            endqty: totalEndQty
        });
        console.log("formattedData============?", formattedData);

        setTableData(formattedData)
        setIsLoading(false)
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Тайлан 2"
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
                    {isLoading ?
                        <LoadingScreen sx={{ paddingTop: '200px', paddingBottom: '200px' }} />
                        :
                        <table style={{ borderCollapse: 'collapse', border: '1px solid black', fontSize: '12px' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid black', padding: '8px' }} rowSpan={2}>№</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }} rowSpan={2}>Барьцааны ангилал</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }} colSpan={2}>Нийт зээлийн эхний үлдэгдэл</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }} colSpan={3}>Нийт олгосон зээл</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }} colSpan={2}>Нийт төлөгдсөн зээл</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }} colSpan={3}>Нийт зээлийн эцсийн үлдэгдэл</th>
                                </tr>
                                <tr>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Мөнгөн дүн</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Тоо</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Мөнгөн дүн</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Тоо</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Хүү(сараар)</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Мөнгөн дүн</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Тоо</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Мөнгөн дүн</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Тоо</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Хүү(сараар)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tableData.map((row, index) => {
                                        return (<tr>
                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{row.no ?? ""}</td>
                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{row.collatetype_name ?? ""}</td>

                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{formatMoney(row.beginamt) + "₮" ?? ""}</td>
                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{row.beginqty ?? ""}</td>

                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{formatMoney(row.totalzeelamts) + "₮" ?? ""}</td>
                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{row.zeelqty ?? ""}</td>
                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{row.percentinmonth ?? ""}</td>

                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{formatMoney(row.totalpaidamts) + "₮" ?? ""}</td>
                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{row.paidqty ?? ""}</td>

                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{formatMoney(row.endamt) + "₮" ?? ""}</td>
                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{row.endqty ?? ""}</td>
                                            <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{""}</td>
                                        </tr>)
                                    })
                                }
                            </tbody>
                        </table>
                    }
                </Stack>


            </Card>
        </Container>
    )
}