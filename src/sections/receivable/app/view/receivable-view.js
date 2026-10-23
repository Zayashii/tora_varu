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
import { getReceivableInfo, getRevenue } from 'src/api/dashboard';
import { formatDateToString } from 'src/utils/formatter';
import AnalyticsWebsiteVisits from 'src/sections/overview/analytics/analytics-website-visits';
import { label } from 'yet-another-react-lightbox';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { fNumber } from 'src/utils/format-number';
// ----------------------------------------------------------------------

const receivableDefaultFilters = {
  begindate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  enddate: new Date(),
};

const defaultFilters = {
  begindate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  enddate: new Date(),
};


export default function ReceivableView() {
  const { user } = useMockedUser();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuthContext();

  const router = useRouter();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [isLoadingReceivable, setIsLoadingReceivable] = useState(true);
  const [receivableData, setReceivableData] = useState(null);
  const [receivableFilters, setReceivableFilters] = useState(receivableDefaultFilters);

  const [isLoading, setIsLoadng] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  const [labels, setLabels] = useState([]);
  const [amounts, setAmounts] = useState([]);

  const [totalInterestIncome, setTotalInterestIncome] = useState(0);
  const [totalAddedInterest, setAddedInterest] = useState(0);
  const [totalAdvanceInterestIncome, setTotalAdvanceInterestIncome] = useState(0);

  async function getData() {
    setIsLoadingReceivable(true)
    const { success, data } = await getReceivableInfo({ begindate: formatDateToString(receivableFilters.begindate), enddate: formatDateToString(receivableFilters.enddate) });
    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("laga -> ", data)
    setReceivableData(data);
    const totalRateAmt = data.rate_grap.reduce((sum, item) => sum + (item.rateamt || 0), 0);
    const totalAddedInterest = data.rate_grap.reduce((sum, item) => sum + (item.rateamt_inrate || 0), 0);
    setTotalInterestIncome(totalRateAmt);
    setAddedInterest(totalAddedInterest)
    setIsLoadingReceivable(false)
  }

  async function getInteresRevenueData() {
    setIsLoadng(true)
    const { success, data } = await getRevenue({ begindate: formatDateToString(filters.begindate), enddate: formatDateToString(filters.enddate) });
    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    setChartData(data.futurerate)
    const totalReve = data.futurerate.reduce((sum, item) => sum + (item.amount || 0), 0);
    setTotalAdvanceInterestIncome(totalReve)
    setIsLoadng(false)
  }

  useEffect(() => {
    getData();
    getInteresRevenueData();
  }, []);

  useEffect(() => {
    getData();
  }, [receivableFilters]);

  useEffect(() => {
    getInteresRevenueData();
  }, [filters]);

  useEffect(() => {
    console.log("chartData", chartData);
    if (chartData) {
      let labelList = [];
      let dataList = [];
      const sortedData = chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log("sortedData", sortedData);
      for (let index = 0; index < sortedData.length; index++) {
        const element = sortedData[index];
        labelList.push(element.date);
        dataList.push(element.amount);
      }
      setLabels(labelList);
      setAmounts(dataList);
    }
  }, [chartData]);

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
          value={receivableFilters.begindate}
          onChange={(value) => {
            setReceivableFilters((prevFilters) => ({
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
          value={receivableFilters.enddate}
          onChange={(value) => {
            setReceivableFilters((prevFilters) => ({
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


      <Grid container spacing={3}>

        {isLoadingReceivable ? (
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
        ) : <>
          <Grid xs={12} md={6} lg={6}>
            <AppAreaInstalled
              title={`Хүүгийн орлого (${fNumber(totalInterestIncome)})`}
              // subheader={fNumber(totalInterestIncome) + '₮'}
              useMoneyFormat={true}
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
                        name: 'Хүүгийн орлого',
                        data: Array(12).fill(0).map((_, index) => {
                          const dataPoint = receivableData.rate_grap.find(item => item.month - 1 === index);
                          return dataPoint ? dataPoint.rateamt : 0;
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
              title={`Нэмэгдүүлсэн хүү (${fNumber(totalAddedInterest)})`}
              // subheader={fNumber(totalAddedInterest) + '₮'}
              useMoneyFormat={true}
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
                        name: 'Нэмэгдүүлсэн хүү',
                        data: Array(12).fill(0).map((_, index) => {
                          const dataPoint = receivableData.rate_grap.find(item => item.month - 1 === index);
                          return dataPoint ? dataPoint.rateamt_inrate : 0;
                        }),
                      },
                    ],
                  },
                ],
              }}
            />
          </Grid>
        </>
        }
      </Grid>


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
          pt: { xs: 10, md: 10 }
        }} Харилцагчийн мэдээлэл
      >
        <DatePicker
          label="Эхлэх огноо"
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

      <Grid container spacing={3}>

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
        ) : <>
          <Grid xs={12} md={12} lg={12}>
            <AnalyticsWebsiteVisits
              title={`Урьдчилсан хүүгийн орлого (${fNumber(totalAdvanceInterestIncome)})`}
              useMoneyFormat={true}
              chart={{
                labels: labels,
                series: [
                  {
                    name: '',
                    type: 'area',
                    fill: 'gradient',
                    data: amounts,
                  },
                ],
              }}
            />
          </Grid>
        </>
        }
      </Grid>
    </Container>
  );
}
