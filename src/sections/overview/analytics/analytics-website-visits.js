import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// components
import Chart, { useChart } from 'src/components/chart';
import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AnalyticsWebsiteVisits({ title, subheader, chart, useMoneyFormat, ...other }) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return useMoneyFormat ? fNumber(value) + '₮' : value + '₮';
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return useMoneyFormat ? fNumber(`${value.toFixed(0)}`) + ' ₮' : `${value.toFixed(0)}₮`;
          }
          return useMoneyFormat ? fNumber(value) + '₮' : value + '₮';
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{
        textAlign: "center", // Aligns both title and subheader
        ".MuiCardHeader-subheader": {
          textAlign: "center", // Specifically centers the subheader
        },
      }} />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart dir="ltr" type="line" series={series} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

AnalyticsWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
