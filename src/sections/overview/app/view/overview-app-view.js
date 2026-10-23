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
import { useState, useEffect } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { getLoanInfo } from 'src/api/dashboard';
import { formatDateToString } from "../../../../utils/formatter"
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------


const defaultFilters = {
  begindate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  enddate: new Date(),
};


export default function OverviewAppView() {
  const { user } = useMockedUser();
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuthContext();


  const [filters, setFilters] = useState(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  async function getData() {
    try {
      setIsLoading(true)
      const { success, data } = await getLoanInfo({ begindate: formatDateToString(filters.begindate), enddate: formatDateToString(filters.enddate) });
      console.log("res bn ->", success, data)
      if (!success) {
        enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
        logout();
        router.push(paths.auth.jwt.login);
        return;
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
      ) : <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Нийт харилцагч"
            total={data?.totaldatas ?? 0}
            icon="mdi:users"
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Нийт авсан зээл"
            total={data?.totalzeels ?? 0}
            icon="mdi:users-check"
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Хаасан зээлийн тоо"
            icon="solar:hand-money-outline"
            total={data?.closedzeels ?? 0}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Сунгасан зээлийн тоо"
            icon="game-icons:pay-money"
            total={data?.expzeels ?? 0}
          />
        </Grid>


        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Нийт актив"
            icon="mdi:users"
            total={data?.count_activezeels ?? 0}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Нийт зээлийн дүн"
            icon="grommet-icons:money"
            total={data?.active_amount_zeel ?? 0}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Хугацаа хэтэрсэн зээлийн тоо"
            icon="typcn:warning"
            total={data?.count_expiredzeels ?? 0}
          />
        </Grid>


        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Нийт зээлийн үлдэгдэл дүн"
            icon="grommet-icons:money"
            total={data?.active_ap_amount_zeel ?? 0}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <AppAreaInstalled
            title="Харилцагчийн тоо"
            subheader=""
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2025',
                  data: [
                    {
                      name: 'Харилцагчийн тоо',
                      data: Array(12).fill(0).map((_, index) => {
                        const dataPoint = data?.grapic_data?.find(item => item.month - 1 === index);
                        return dataPoint ? dataPoint.qtydata : 0;
                      }),
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <AppAreaInstalled
            title="Зээлийн актив"
            subheader=""
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2025',
                  data: [
                    {
                      name: 'Зээлийн актив',
                      data: Array(12).fill(0).map((_, index) => {
                        const dataPoint = data?.grapic_zeel?.find(item => item.month - 1 === index);
                        return dataPoint ? dataPoint.qtyzeels : 0;
                      }),
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="New Invoice"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid> */}
      </Grid>
      }
    </Container>
  );
}
