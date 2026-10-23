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
import AppWidgetSummary from 'src/sections/overview/app/app-widget-summary';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { getLoanInfo } from 'src/api/dashboard';
import { formatDateToString } from 'src/utils/formatter';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Card } from '@mui/material';
import AppCurrentDownload from 'src/sections/overview/app/app-current-download';
import BookingStatistics from 'src/sections/overview/booking/booking-statistics';
// ----------------------------------------------------------------------


const defaultFilters = {
  begindate: new Date('2024-06-01T00:00:00'),
  enddate: new Date(),
};

const TABLE_HEAD = [
  { id: 'disctrict', label: 'Дүүрэг', with: '33.3%' },
  { id: 'work', label: 'Ажил', with: '33.3%' },
  { id: 'home', label: 'Гэр', with: '33.3%' },
];


export default function UserInfoView() {
  const { user } = useMockedUser();
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { logout, login } = useAuthContext();
  const table = useTable({ defaultRowsPerPage: 50, defaultDense: true });

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  async function getData() {
    try {
      setIsLoading(true)
      const { success, data } = await getLoanInfo({ begindate: formatDateToString(filters.begindate), enddate: formatDateToString(filters.enddate) }, login);
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
      setData(data);
      setIsLoading(false)
    } catch (error) {
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


  useEffect(() => {
    getData();
  }, []);


  useEffect(() => {
    getData();
  }, [filters]);

  {/* <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid> */}

  {/* <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid> */}

  const notFound = (!tableData.length) || !tableData.length;


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

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
      </Stack>


      {isLoading ? (
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
      ) :
        <Stack
          sx={{
            flexDirection: 'row'
          }}
        >
          <Stack
            sx={{
              flexDirection: 'column',
              flex: 0.6,
            }}
          >
            <Grid container spacing={3}>

              <Grid xs={12} md={4}>
                <AppWidgetSummary
                  title="Нийт харилцагч"
                  total={data?.totaldatas ?? 0}
                  icon="mdi:users"
                />
              </Grid>

              <Grid xs={12} md={4}>
                <AppWidgetSummary
                  title="Идэвхитэй харилцагч"
                  total={data?.totalzeels ?? 0}
                  icon="mdi:users-check"
                />
              </Grid>

              <Grid xs={12} md={4}>
                <AppWidgetSummary
                  title="Идэвхигүй харилцагч"
                  icon="mdi:users"
                  total={data?.closedzeels ?? 0}
                />
              </Grid>

            </Grid>

            <div style={{ height: '100px' }} />

            <Card>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 560 }}>
                  <TableHeadCustom
                    headLabel={[
                      { id: '', label: '', width: '33.3%' },
                      { id: 'location', width: '33.3%', label: <span style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', fontSize: '15px' }}>Байршлаар</span> },
                      { id: '', label: '', width: '33.3%' },

                    ]}
                  />
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
                    {tableData
                      .map((row, index) => (
                        <RevenueTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          page={table.page}
                          rowsPerPage={table.rowsPerPage}
                          index={index}
                        />
                      ))}

                    {/* <TableEmptyRows
                                height={denseHeight}
                                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                              /> */}

                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </Card>
          </Stack>

          <div style={{ width: '50px' }} />

          <Stack
            sx={{
              flexDirection: 'column',
              flex: 0.4,
            }}
          >
            <Grid xs={12} md={6} lg={4}>
              <AppCurrentDownload
                title="Хүйсийн харьцаа"
                chart={{
                  series: [
                    { label: 'Mac', value: 12244 },
                    { label: 'Window', value: 53345 },
                    { label: 'iOS', value: 44313 },
                    { label: 'Android', value: 78343 },
                  ],
                }}
              />
            </Grid>

            <div style={{ height: '50px' }} />

            <Grid xs={12}>
              <BookingStatistics
                title="Насны харьцаа"
                chart={{
                  colors: [theme.palette.primary.main, theme.palette.error.light],
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                  series: [
                    {
                      type: 'Week',
                      data: [
                        {
                          name: 'Sold',
                          data: [10, 41, 35, 151, 49, 62, 69, 91, 48],
                        },
                        {
                          name: 'Canceled',
                          data: [10, 34, 13, 56, 77, 88, 99, 77, 45],
                        },
                      ],
                    },
                    {
                      type: 'Month',
                      data: [
                        {
                          name: 'Sold',
                          data: [148, 91, 69, 62, 49, 51, 35, 41, 10],
                        },
                        {
                          name: 'Canceled',
                          data: [45, 77, 99, 88, 77, 56, 13, 34, 10],
                        },
                      ],
                    },
                    {
                      type: 'Year',
                      data: [
                        {
                          name: 'Sold',
                          data: [76, 42, 29, 41, 27, 138, 117, 86, 63],
                        },
                        {
                          name: 'Canceled',
                          data: [80, 55, 34, 114, 80, 130, 15, 28, 55],
                        },
                      ],
                    },
                  ],
                }}
              />
            </Grid>
          </Stack>
        </Stack>
      }
    </Container>
  );
}
