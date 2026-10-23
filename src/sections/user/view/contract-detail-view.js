'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useMemo } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
// api
import { useGetProducts } from 'src/api/product';
// components
import { useSettingsContext } from 'src/components/settings';
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
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';

import { getUserList } from 'src/api/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { Box, height, width } from '@mui/system';
import { useSnackbar } from 'src/components/snackbar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import LoadingButton from '@mui/lab/LoadingButton';
import { addNote, getNotes } from 'src/api/user';
import Stack from '@mui/material/Stack';
import NoteItem from './note-item';
import UserNewEditForm from '../user-new-edit-form';
import { getUserDataById } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import { FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from '@mui/material';
import { getBankList } from 'src/api/user';
import { getProductList } from 'src/api/user';
import { formatMoney } from 'src/utils/formatter';
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
import { useForm, } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import EcommerceYearlySales from 'src/sections/overview/e-commerce/ecommerce-yearly-sales';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sequence', label: '№', width: '10px' },
  { id: 'rd', label: 'РД' },
  { id: 'lname', label: 'Овог', },
  { id: 'fname', label: 'Нэр', },
  { id: 'phone', label: 'Утас', },
  { id: 'shopaddress', label: 'Ажлын газар', },
  { id: 'Дүүрэг', label: 'Дүүрэг' },
  { id: 'address', label: 'Хаяг' },
  { id: 'productName', label: 'Зээл' },
  { id: 'cdate', label: 'Бүртгүүлсэн огноо' },
  { id: '', label: '' },
];

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
  name: "",
  phone: "",
  rd: "",
  selectedExceedDays: [defaultExceedDays[0]],
};


// ----------------------------------------------------------------------

export default function ContractDetailView({ id }) {
  const router = useRouter();
  const { logout } = useAuthContext();

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 50
  });
  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);

  const [reLoadData, setReloadData] = useState(false);

  const [total, setTotal] = useState(0);

  const [noteText, setNoteText] = useState("")
  const [noteId, setNoteId] = useState(null)
  const [isSavingNote, setIsSavingNote] = useState(false)

  const [notes, setNotes] = useState([])
  const [isLoadingNoteList, setIsLoadingNoteList] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [isShowDetail, setIsShowDetail] = useState(false)
  const [banks, setBanks] = useState([])
  const [products, setProducts] = useState([])
  const [loanList, setLoanList] = useState([])
  const [selectedLoan, setSelectedLoan] = useState([])


  const [totalzeel, setTotalzeel] = useState(0)
  const [totalexpzeel, setTotalexpzeel] = useState(0)
  const [maxexpday, setMaxexpday] = useState(0)
  const [totalexpdays, setTotalexpdays] = useState(0)

  const [status, setStatus] = useState(0)


  const [graphTime, setGraphTime] = useState(defaultTime)
  const [exceedDays, setExceedDays] = useState(defaultExceedDays)
  const [chartData, setChartData] = useState()
  const [isGraphLoading, setIsGraphLoading] = useState(true);


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


  const changeStatus = (val) => {
    setStatus(val)
  }

  const StatementSchema = Yup.object().shape({
    statementId: Yup.number(),
  });



  const getUserDetail = async () => {
    setIsDetailLoading(true);
    try {
      const { success, data } = await getUserDataById({ dataid: id })
      if (!success) {
        enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
        logout()
        router.push(paths.auth.jwt.login);
        return;
      }
      setCurrentUser(data.datalist[0])
      setLoanList(data.zeellist)
      setTotalzeel(data.totalzeel)
      setTotalexpzeel(data.totalexpzeel)
      setMaxexpday(data.maxexpday)
      setTotalexpdays(data.totalexpdays)
      setIsDetailLoading(false);
    } catch (error) {
      console.log("catch error ", error);
      setIsDetailLoading(false);
    }
  }

  const getNoteList = async (id) => {
    setIsLoadingNoteList(true)
    try {
      const { success, data } = await getNotes({ dataid: id })
      if (!success) {
        enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
        logout()
        router.push(paths.auth.jwt.login);
        return;
      }
      setNotes(data.datalog)
      setIsLoadingNoteList(false)
    } catch (error) {
      setIsLoadingNoteList(false)
    }
  }

  const detailPage = useBoolean();

  const clearFilter = () => {
    setFilters(defaultFilters);
    table.onResetPage()
    setReloadData(!reLoadData);
  }

  async function getData() {
    setIsLoading(true)
    const { success, data } = await getUserList({ fname: filters.name, phone: filters.phone, regno: filters.rd, pageno: table.page + 1, pagesize: table.rowsPerPage });
    console.log("res bn ->", data)

    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data)
    data.datalist.map((el, index) => {
      el.sequence = table.page * table.rowsPerPage + index + 1
    })
    setTableData(data.datalist)
    setTotal(data.totaldataqty)
    setIsLoading(false)
  }

  async function getBankNames() {
    const { success, data } = await getBankList();
    if (!success) {
      logout();
      router.push(paths.auth.jwt.login);
    }
    setBanks(data)
  }

  async function getProducts() {
    const { success2, data2 } = await getProductList();
    console.log("res bn ->", data2)

    if (!success2) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data2)
    setProducts(data2)
  }

  useEffect(() => {
    getBankNames()
    getProducts()
    getUserDetail()
  }, []);

  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const handleFilters = useCallback(
    (name, value) => {
      // table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataInPage.length,
    });
  }, [dataInPage.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      // router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  function sortByKey(array, key, order = 'asc') {
    return array.sort((a, b) => {
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return order === 'asc'
          ? a[key].localeCompare(b[key]) // Ascending for strings
          : b[key].localeCompare(a[key]); // Descending for strings
      } else {
        return order === 'asc'
          ? a[key] - b[key] // Ascending for numbers
          : b[key] - a[key]; // Descending for numbers
      }
    });
  }

  useEffect(() => {
    // console.log("called ", table.order, table.orderBy);
    // console.log(tableData);
    // if (table.orderBy === "sequence") {
    //   setTableData([...tableData.reverse()])
    //   return
    // }
    var sortedData = [...sortByKey(tableData, table.orderBy, table.order)]
    setTableData(sortedData)
  }, [table.onSort]);


  const defaultValues = useMemo(
    () => ({
      journalNo: "",
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(StatementSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    trigger,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = handleSubmit(async (formFrontData) => {

  });

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Гэрээний дэлгэрэнгүй"
          links={[
            {
              name: 'Гэрээ',
              href: paths.dashboard.user.contract,
            },
            { name: 'Дэлгэрэнгүй' },
          ]}
          action={
            <></>
            // <Button
            //   component={RouterLink}
            //   href={paths.dashboard.user.new}
            //   variant="contained"
            //   startIcon={<Iconify icon="mingcute:add-line" />}
            // >
            //   Шинэ харилцагч
            // </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {isDetailLoading ? <LoadingScreen
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 1.5,
            bgcolor: 'background.default',
            height: '55vh',
            width: '100%',
          }}
        /> : <Card sx={{ padding: '20px' }}>
          <Stack flexDirection={'column'}>


            <Stack flexDirection={'row'}>
              <Stack flexDirection={'column'}  sx={{ flex: 1 }}>

                <Typography variant="h4" >
                  Хугацаа хэтэрсэн зээл
                </Typography>

                <div style={{ height: '30px' }} />

                <Stack flexDirection={'row'} >
                  <table style={{ borderCollapse: 'collapse', border: '1px solid black', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }} >Зээлийн эрх</th>
                        <th style={{ border: '1px solid black', padding: '8px' }} >Тооцоолол</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"Борлуулалт"}</td>
                        <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 45,833,333"}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"Зардал"}</td>
                        <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 45,833,333"}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"Ашиг"}</td>
                        <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 45,833,333"}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"Зээлийн эрх"}</td>
                        <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 45,833,333"}</td>
                      </tr>
                    </tbody>
                  </table>
                </Stack>

                <div style={{ height: '30px' }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <EcommerceYearlySales
                      title="Yearly Sales"
                      subheader="(+43%) than last year"
                      chart={{
                        categories: [
                          'Jan', 'Feb', 'Mar', 'Apr', 'May',
                          'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                        ],
                        series: [
                          {
                            year: '2019',
                            data: [
                              { name: 'Total Income', data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49] },
                              { name: 'Total Expenses', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77] },
                            ],
                          },
                          {
                            year: '2020',
                            data: [
                              { name: 'Total Income', data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49] },
                              { name: 'Total Expenses', data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77] },
                            ],
                          },
                        ],
                      }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          </Stack>
        </Card>
        }
      </Container >



      <ConfirmDialog
        open={detailPage.value}
        maxWidth="xl"
        onClose={() => {
          detailPage.onFalse();
        }}
        title="Зээлийн эрхийн дэлгэрэнгүй"
        cancelText={"Хаах"}
        content={
          <Box sx={{ width: '100%', }}>
            <Box sx={{ height: "20px" }} />
            <table style={{ borderCollapse: 'collapse', border: '1px solid black', fontSize: '12px', width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '8px' }} >Ресторан Лоунж</th>
                  <th style={{ border: '1px solid black', padding: '8px' }} ></th>
                  <th style={{ border: '1px solid black', padding: '8px' }} >1 сар</th>
                  <th style={{ border: '1px solid black', padding: '8px' }} >2 сар</th>
                  <th style={{ border: '1px solid black', padding: '8px' }} >3 сар</th>
                  <th style={{ border: '1px solid black', padding: '8px' }} >4 сар</th>
                  <th style={{ border: '1px solid black', padding: '8px' }} >5 сар</th>
                  <th style={{ border: '1px solid black', padding: '8px' }} >6 сар</th>
                  <th style={{ border: '1px solid black', padding: '8px' }} >Нийт үнэлгээ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"Борлуулалтын дундаж"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{""}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"Өртөг үнэ"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"33%"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"ҮА зардал"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"33%"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"Ашиг"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"33%"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{"₮ 100,000,000"}</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center', fontWeight: 'bold' }}>{"Зээлийн эрх"}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{""}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{""}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{""}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{""}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{""}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{""}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center' }}>{""}</td>
                  <td style={{ padding: '12px', border: '1px solid black', textAlign: 'center', fontWeight: 'bold' }}>{"₮ 100,000,000"}</td>
                </tr>
              </tbody>
            </table>
          </Box>
        }
        action={
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {

            }}
          >
            Хадгалах
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
