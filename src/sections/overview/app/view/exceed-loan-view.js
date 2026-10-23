'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// _mock
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
//
import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect, useCallback } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { expDashboardGraph, expDashboardTable, getLoanInfo } from 'src/api/dashboard';
import { formatDateToString } from "../../../../utils/formatter"
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Scrollbar from 'src/components/scrollbar';
import Table from '@mui/material/Table';
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
import TableBody from '@mui/material/TableBody';
import EcommerceYearlySales from '../../e-commerce/ecommerce-yearly-sales';
import {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import MenuItem from '@mui/material/MenuItem';
import { useForm, FormProvider } from 'react-hook-form';
import Card from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import ExceedLoanTableRow from 'src/sections/expired-loan/exceed-table-row';
import { getProductList } from 'src/api/user';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/system';


// ----------------------------------------------------------------------

const defaultTime = [
  {
    value: 0,
    name: 'Өдөр',
  },
  {
    value: 1,
    name: '7 хоног',
  },
  {
    value: 2,
    name: 'Сар',
  },
]

const defaultExceedDays = [
  {
    value: 'isfive',
    name: '1-5 хоног',
  },
  {
    value: 'isfifteen',
    name: '6-15 хоног',
  },
  {
    value: 'isthirthy',
    name: '16-30 хоног',
  },
  {
    value: 'isfifthy',
    name: '31-50 хоног',
  },
  {
    value: 'isninty',
    name: '50-90 хоног',
  },
  {
    value: 'ishundred',
    name: '91 дээш',
  },
]


const defaultFilters = {
  begindate: new Date('2024-06-01T00:00:00'),
  enddate: new Date(),
  selectedTime: defaultTime[0].value,
  selectedProds: null,
  selectedExceedDays: [defaultExceedDays[0]],
};

const TABLE_HEAD = [
  { id: 'category', label: 'Ангилал', textAlign: 'center' },
  { id: '1-5', label: '1-5 хоног', textAlign: 'center' },
  { id: '6-15', label: '6-15 хоног', textAlign: 'center' },
  { id: '16-30', label: '16-30 хоног', textAlign: 'center' },
  { id: '31-50', label: '31-50 хоног', textAlign: 'center' },
  { id: '50-90', label: '50-90 хоног', textAlign: 'center' },
  { id: '91+', label: '91 дээш хоног', textAlign: 'center' },
  { id: 'total', label: 'Нийт үнэ', textAlign: 'center' },
];


export default function ExceedLoanView() {
  const { user } = useMockedUser();
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { logout, login } = useAuthContext();

  const [tableData, setTableData] = useState([]);

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 50
  });

  const denseHeight = table.dense ? 34 : 34 + 20;

  const [filters, setFilters] = useState(defaultFilters);
  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isGraphLoading, setIsGraphLoading] = useState(true);

  const [products, setProducts] = useState([]);

  const [graphTime, setGraphTime] = useState(defaultTime)

  const [exceedDays, setExceedDays] = useState(defaultExceedDays)

  const [chartData, setChartData] = useState()

  const notFound = (!tableData.length) || !tableData.length;

  async function getData() {
    try {
      setIsLoading(true)
      const { success, msg, data } = await expDashboardTable({}, login);
      console.log("res bn ->", success, data)
      if (!success) {
        if (msg === "Дахин нэвтэрнэ үү!") {
          enqueueSnackbar(msg, { variant: 'error' })
          logout()
          router.push(paths.auth.jwt.login);
          return;
        }
        else {
          enqueueSnackbar(msg, { variant: 'error' })
          return;
        }
      }
      const totals = data.reduce((acc, item) => {
        acc.amt5 += item.amt5 || 0;
        acc.qty5 += item.qty5 || 0;
        acc.amt15 += item.amt15 || 0;
        acc.qty15 += item.qty15 || 0;
        acc.amt30 += item.amt30 || 0;
        acc.qty30 += item.qty30 || 0;
        acc.amt50 += item.amt50 || 0;
        acc.qty50 += item.qty50 || 0;
        acc.amt90 += item.amt90 || 0;
        acc.qty90 += item.qty90 || 0;
        acc.amt100 += item.amt100 || 0;
        acc.qty100 += item.qty100 || 0;
        acc.total_amt += item.total_amt || 0;
        acc.total_qty += item.total_qty || 0;
        return acc;
      }, {
        product_name: "Нийт",
        amt5: 0, qty5: 0,
        amt15: 0, qty15: 0,
        amt30: 0, qty30: 0,
        amt50: 0, qty50: 0,
        amt90: 0, qty90: 0,
        amt100: 0, qty100: 0,
        total_amt: 0, total_qty: 0
      });
      setTableData([...data, totals]);
      setIsLoading(false)
    } catch (error) {
      console.log("error-->", error);

      setIsLoading(false)
      if (error.code === 'ECONNABORTED') {
        enqueueSnackbar("Холболтын хугацаа дууссан. Дахин оролдоно уу.", { variant: 'warning' });
      }
      else if (error.message && error.message.includes('timeout')) {
        enqueueSnackbar("Сүлжээ удаан байна. Дахин оролдоно уу.", { variant: 'warning' });
      }
      else {
        enqueueSnackbar(error.error || "Алдаа гарлаа!", { variant: 'error' });
      }
    }
  }

  const buildWeekChartData = (response) => {
    if (!response || !filters.selectedExceedDays) return { categories: [], series: [] };

    if (
      (response.five === null || response.five.length === 0)
      && (response.fifteen === null || response.fifteen.length === 0)
      && (response.thirthy === null || response.thirthy.length === 0)
      && (response.fifthy === null || response.fifthy.length === 0)
      && (response.ninty === null || response.ninty.length === 0)
      && (response.hundred === null || response.hundred.length === 0)
    ) {
      return { categories: [], series: [] };
    }

    // Map interval keys to human-readable names
    const intervalNameMap = {
      five: '1-5 хоног',
      fifteen: '6-15 хоног',
      thirthy: '16-30 хоног',
      fifthy: '31-50 хоног',
      ninty: '50-90 хоног',
      hundred: '91 дээш',
    };

    // Step 1: Collect all unique dates
    const allDates = new Set();
    for (const group of Object.values(response)) {
      // Only process if group is an array, not null or undefined
      if (Array.isArray(group)) {
        group.forEach(item => allDates.add(item.date)); // Collect all unique dates
      }
    }

    // Step 2: Sort dates by start date
    const sortedDates = Array.from(allDates).sort(
      (a, b) => new Date(a.split('-')[0]) - new Date(b.split('-')[0])
    );

    // Step 3: Filter selected intervals and build series data
    const selectedIntervals = filters.selectedExceedDays.map(item => item.value.replace('is', '')); // Extract only the 'value' part, e.g. 'five'
    const seriesData = Object.keys(response)
      .filter(intervalKey => selectedIntervals.includes(intervalKey)) // Filter intervals based on selected filters
      .map(intervalKey => {
        const displayName = intervalNameMap[intervalKey] || intervalKey; // Fallback to key if not mapped
        const map = new Map();

        // Handle null or empty interval data
        const intervalData = response[intervalKey] || []; // Default to empty array if null

        if (intervalData.length === 0) return null; // Skip empty intervals

        intervalData.forEach(item => {
          map.set(item.date, item.amt); // Map the date to its corresponding 'amt'
        });

        const alignedData = sortedDates.map(date => map.get(date) || 0); // Use 0 if no data for the date

        return {
          name: displayName,
          data: alignedData
        };
      })
      .filter(Boolean); // Remove any null values that may have resulted from empty intervals

    // Step 4: Return final chart data with only selected intervals
    return {
      categories: sortedDates,
      series: [
        {
          year: "2025",
          data: seriesData
        }
      ]
    };
  };




  const getProds = async () => {
    try {
      const { success2, msg2, data2 } = await getProductList({}, login);
      if (!success2) {
        if (msg2 === "Дахин нэвтэрнэ үү!") {
          enqueueSnackbar(msg2, { variant: 'error' })
          logout()
          router.push(paths.auth.jwt.login);
          return;
        }
        else {
          enqueueSnackbar(msg2, { variant: 'error' })
          return;
        }
      }
      const activeProducts = data2.filter(item => item.status === 1)
      setProducts(activeProducts)
      handleFilters('selectedProds', activeProducts[0])
    } catch (error) {
      enqueueSnackbar(error.error, { variant: 'error' })
      return;
    }
  }

  const getChatData = async () => {
    try {
      setIsGraphLoading(true);
      let params = `?daytype=${filters.selectedTime}&product_id=${filters.selectedProds?.id}`;

      for (let index = 0; index < exceedDays.length; index++) {
        const element = exceedDays[index];
        if (filters.selectedExceedDays.includes(element)) {
          params += '&' + element.value + '=1';
        } else {
          params += '&' + element.value + '=0';
        }
      }

      const { success, msg, data } = await expDashboardGraph(params, login);

      if (!success) {
        if (msg === "Дахин нэвтэрнэ үү!") {
          enqueueSnackbar(msg, { variant: 'error' });
          logout();
          router.push(paths.auth.jwt.login);
          return;
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
          return;
        }
      }

      const transformed = buildWeekChartData(data);
      console.log("Transformed Chart Data:", JSON.stringify(transformed, null, 2));
      setChartData(transformed);
    } catch (error) {
      enqueueSnackbar("Алдаа гарлаа", { variant: 'error' });
    } finally {
      setIsGraphLoading(false);
    }
  };


  useEffect(() => {
    getData();
    getProds();
  }, []);

  useEffect(() => {
    if (filters.selectedProds?.id) {
      getChatData();
    }
  }, [filters]);

  const methods = useForm({
    defaultValues: {
      time: ''
    },
  });
  const { reset, setValue, watch } = methods;

  return (
    <FormProvider {...methods}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>

        <CustomBreadcrumbs
          heading="Хугацаа хэтэрсэн зээлийн мэдээлэл"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            { name: 'Мэдээлэл' },
          ]}
          action={
            <></>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />


        <Stack sx={{ flexDirection: 'column' }}>
          {/* {isLoading ? (
            <LoadingScreen
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1.5,
                bgcolor: 'background.default',
                height: '55vh',
                width: '100%',
              }}
            />
          ) : */}
          < Card >
            <Stack
              spacing={2}
              alignItems={{ xs: 'flex-end', md: 'center' }}
              direction={{
                xs: 'column',
                md: 'row',
              }}
              sx={{
                p: 2.5,
                pr: { xs: 2.5, md: 1 },
              }}
            >
              <RHFSelect
                fullWidth
                name="manager"
                label="Ажилтан"
                // value={ }
                sx={{
                  maxWidth: { md: 300 },
                }}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[].map((el) => (
                  <MenuItem key={el.id} value={el}>
                    {el.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {isLoading ? (
                      [...Array(6)].map((i, index) => (
                        <TableSkeleton colSpan={8} key={index} sx={{ height: denseHeight }} />
                      ))
                    ) : (
                      <>
                        {tableData
                          .map((row, index) => (
                            <ExceedLoanTableRow
                              key={row.id}
                              row={row}
                              selected={table.selected.includes(row.id)}
                              onSelectRow={() => table.onSelectRow(row.id)}
                              onDeleteRow={() => handleDeleteRow(row.id)}
                              onEditRow={() => handleEditRow(row.id)}
                              onViewRow={() => handleViewRow(row.id)}
                              page={table.page}
                              rowsPerPage={table.rowsPerPage}
                              index={index}
                              onSelectLoanHistory={() => router.push(paths.dashboard.user.loanHistory(row.id))}
                              handleOnEdit={() => { }}
                              onJumpToDetail={(prod_id, interval) => { router.push(paths.dashboard.loan.expiredIntervalLoan(prod_id ?? 'all', interval)) }}
                            />
                          ))}
                      </>
                    )}
                    {isLoading ? <></> : <TableNoData notFound={notFound} colSpan={15} />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          </Card>
          {/* } */}

          <div style={{ height: '50px' }} />


          {(isGraphLoading || tableData.length === 0) ? <LoadingScreen
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 1.5,
              bgcolor: 'background.default',
              height: '55vh',
              width: '100%',
            }}
          />
            : <Grid xs={12} md={6} lg={8}>
              <EcommerceYearlySales
                title={
                  <Stack sx={{ flexDirection: 'row', justifyContent: 'left', marginBottom: '20px' }}>

                    <Box
                      sx={{
                        flexShrink: 0,
                        width: { xs: 1, md: 200 },
                      }}
                    >
                      <RHFSelect
                        value={filters.selectedTime}
                        fullWidth
                        name="time"
                        label="График харах хугацаа"
                        InputLabelProps={{ shrink: true }}
                        PaperPropsSx={{ textTransform: 'capitalize' }}
                        onChange={(e) => {
                          const selectedValue = e.target.value
                          handleFilters('selectedTime', selectedValue);
                        }}
                      >
                        {
                          graphTime.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                              {el.name}
                            </MenuItem>
                          ))
                        }
                      </RHFSelect>
                    </Box>

                    <div style={{ width: '20px' }} />


                    <Box
                      sx={{
                        flexShrink: 0,
                        width: { xs: 1, md: 200 },
                      }}
                    >
                      <RHFSelect
                        fullWidth
                        value={filters.selectedProds}
                        name="product"
                        label="Зээлийн бүтээгдэхүүн"
                        InputLabelProps={{ shrink: true }}
                        PaperPropsSx={{ textTransform: 'capitalize' }}
                        onChange={(e) => {
                          const selectedValue = e.target.value
                          console.log("selectedValue", selectedValue);
                          handleFilters('selectedProds', selectedValue);
                        }}
                      >
                        {products.map((option) => (
                          <MenuItem key={option.id} value={option}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </Box>

                    {/* <FormControl
                      sx={{
                        flexShrink: 0,
                        width: { xs: 1, md: 200 },
                      }}
                    >
                      <InputLabel>Зээлийн бүтээгдэхүүн</InputLabel>

                      <Select
                        multiple
                        value={filters.selectedProds}
                        onChange={(e) => {
                          handleFilters('selectedProds', e.target.value);
                        }}
                        input={<OutlinedInput label="Зээлийн бүтээгдэхүүн" />}
                        renderValue={(selected) => selected.map((value) => value.name).join(', ')}
                        MenuProps={{
                          PaperProps: {
                            sx: { maxHeight: 240 },
                          },
                        }}
                      >
                        {products.map((option) => (
                          <MenuItem key={option.id} value={option}>
                            <Checkbox disableRipple size="small" checked={filters.selectedProds.includes(option)} />
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}

                    <div style={{ width: '20px' }} />

                    <FormControl
                      sx={{
                        flexShrink: 0,
                        width: { xs: 1, md: 200 },
                      }}
                    >
                      <InputLabel>Хугацаа хэтэрсэн хоног</InputLabel>

                      <Select
                        multiple
                        value={filters.selectedExceedDays}
                        onChange={(e) => {
                          handleFilters('selectedExceedDays', e.target.value);
                        }}
                        input={<OutlinedInput label="Хугацаа хэтэрсэн хоног" />}
                        renderValue={(selected) => selected.map((value) => value.name).join(', ')}
                        MenuProps={{
                          PaperProps: {
                            sx: { maxHeight: 240 },
                          },
                        }}
                      >
                        {exceedDays.map((option) => (
                          <MenuItem key={option.id} value={option}>
                            <Checkbox disableRipple size="small" checked={filters.selectedExceedDays.includes(option)} />
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                  </Stack>

                }
                // subheader="(+43%) than last year"
                chart={chartData}
                year={'2025'}
              />
            </Grid>
          }
        </Stack>
      </Container >
    </FormProvider >
  );
}
