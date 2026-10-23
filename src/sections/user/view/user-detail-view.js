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
import { RHFTextField } from 'src/components/hook-form';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import LoadingButton from '@mui/lab/LoadingButton';
import { addNote, editNewUser, getNotes } from 'src/api/user';
import Stack from '@mui/material/Stack';
import NoteItem from './note-item';
import UserNewEditForm from '../user-new-edit-form';
import { getUserDataById } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import { Typography } from '@mui/material';
import { getBankList } from 'src/api/user';
import { getProductList } from 'src/api/user';
import { formatDateToString, formatMoney } from 'src/utils/formatter';
import FormProvider from 'src/components/hook-form';
import { useForm, } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import MenuItem from '@mui/material/MenuItem';
import { addRiskDateOnLoan } from 'src/api/loan';

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

const defaultFilters = {
  name: "",
  phone: "",
  rd: "",
};

const tableContainerSx = {
  width: '100%',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
};

// ----------------------------------------------------------------------

export default function UserDetailView({ id }) {
  const router = useRouter();
  const { logout, setEndDate, login } = useAuthContext();

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 50
  });

  const popover = usePopover();


  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);
  const [isRiskLoading, setIsRiskLoading] = useState(false);

  const [reLoadData, setReloadData] = useState(false);

  const [total, setTotal] = useState(0);

  const [noteText, setNoteText] = useState("")
  const [riskDateValue, setRiskDateValue] = useState();
  const [loanRiskDateValue, setLoanRiskDateValue] = useState();

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

  const confirm = useBoolean();
  const riskDate = useBoolean();
  const noteList = useBoolean();

  const laonRiskDate = useBoolean();

  const StatementSchema = Yup.object().shape({
    statementId: Yup.number(),
  });



  const getUserDetail = async () => {
    setIsDetailLoading(true);
    try {
      const { success, msg, data } = await getUserDataById({ dataid: id }, login)
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
      setCurrentUser(data.datalist[0])
      if (data.datalist[0].riskdate !== null) {
        setRiskDateValue(new Date(data.datalist[0].riskdate))
      }
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
      const { success, msg, data } = await getNotes({ dataid: id }, login)
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
      setNotes(
        data.datalog.sort((a, b) => new Date(b.cdate) - new Date(a.cdate))
      );
      setIsLoadingNoteList(false)
    } catch (error) {
      setIsLoadingNoteList(false)
    }
  }

  const detailPage = useBoolean();

  const onDetail = () => {
    detailPage.onTrue();
  };

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
    const { success, msg, data } = await getBankList({}, login);
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
    setBanks(data)
  }

  async function getProducts() {
    const { success2, msg2, data2 } = await getProductList({}, login);
    console.log("res bn ->", data2)

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
    console.log("data bn 3 ->", data2)
    setProducts(data2)
  }

  useEffect(() => {
    getBankNames()
    getProducts()
    getUserDetail()
    getNoteList(id)
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
          heading="Харилцагчийн дэлгэрэнгүй"
          links={[
            {
              name: 'Харилцагч',
              href: paths.dashboard.user.root,
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
        /> : <Card sx={{ p: 2.5 }}>
          <Stack spacing={3}>
            <Typography variant="subtitle1">Хэрэглэгчийн дугаар: {id}</Typography>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
              <Stack spacing={3} sx={{ width: { xs: '100%', lg: '32%' } }}>
                <Box sx={tableContainerSx}>
                  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <colgroup>
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '100%' }} />
                    </colgroup>
                    <tr>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          backgroundColor: '#e5e5e5',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}
                        colSpan={2}>
                        Хэрэглэгчийн мэдээлэл
                      </th>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Регистр
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.rd ?? ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Эцэг /эх/-ийн нэр
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.lname ?? ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Нэр
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.fname ?? ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Амьдарч буй хаяг
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.address ?? ""}
                      </td>
                    </tr>
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Хүйс
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.genderName ?? ""}
                      </td>
                    </tr>}
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Төрсөн он сар
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.bdate ?? ""}
                      </td>
                    </tr>}
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Имэйл хаяг
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.email ?? ""}
                      </td>
                    </tr>}
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Гэрлэсэн эсэх
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.merredDescr ?? ""}
                      </td>
                    </tr>}
                  </table>
                </Box>

                <Box sx={tableContainerSx}>
                  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <colgroup>
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '100%' }} />
                    </colgroup>
                    <tr>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          backgroundColor: '#e5e5e5',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}
                        colSpan={2}>
                        Дэлгүүрийн мэдээлэл
                      </th>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Байгууллагын нэр
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.company ?? ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Байгууллагын регистр
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.companyreg ?? ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Дэлгүүрийн нэр
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.shopname ?? ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Хаяг байршил
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.shopaddress ?? ""}
                      </td>
                    </tr>
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Дэлгүүрийн мэдээлэл
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.ajil ?? ""}
                      </td>
                    </tr>}
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Обектын эзэмшил
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.isobjectDescr ?? ""}
                      </td>
                    </tr>}
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Тайлбар
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.descr ?? ""}
                      </td>
                    </tr>}
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Банк
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {banks?.find(el => el.code === currentUser?.bankCode)?.name ?? ""}
                      </td>
                    </tr>}
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Данс
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.acc ?? ""}
                      </td>
                    </tr>}
                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Зээлийн эрх
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {products?.find(el => el.id === currentUser?.productId)?.name ?? ""}
                      </td>
                    </tr>}
                  </table>
                </Box>

                <Box sx={tableContainerSx}>
                  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <colgroup>
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '100%' }} />
                    </colgroup>
                    <tr>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          backgroundColor: '#e5e5e5',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}
                        colSpan={2}>
                        Холбоо барих
                      </th>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Өөрийн дугаар
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.phone ?? ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Хэн болох
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.familymember ?? ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Утас
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.familymemberPhone ?? ""}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Хэн болох 2
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.familymember2 ?? ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Утас 2
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.familymember2Phone ?? ""}
                      </td>
                    </tr>


                    {isShowDetail && <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        Facebook хаяг
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        {currentUser?.social ?? ""}
                      </td>
                    </tr>}
                  </table>
                </Box>
                <Button
                  onClick={() => {
                    setIsShowDetail(!isShowDetail)
                  }}
                  variant="contained"
                  width='100px'
                >
                  {!isShowDetail ? `Дэлгэрэнгүй` : `Хурааангуй`}
                </Button>
              </Stack>
              <Stack spacing={3} sx={{ width: { xs: '100%', lg: '68%' } }}>
                <Box sx={tableContainerSx}>
                  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <tr>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          backgroundColor: '#e5e5e5',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                        }}
                        colSpan={13}>
                        Идэвхтэй байгаа зээлийн мэдээлэл
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        ЗД
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        З/төрөл
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        ААЗ
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        ҮЗҮ
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        Бод/Хүү
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        Бод/Нэм/Хүү
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        ААХ
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        ДХ
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        ХХХ
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        Сунгах дүн
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        Хаах дүн
                      </th>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                        Хүү алданги зогсоох өдөр
                      </th>
                      <th
                        colSpan={2}
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}>
                      </th>
                    </tr>
                    {loanList.map(el => {
                      return <tr
                        style={{
                          backgroundColor: el.isRisked ? '#f8ff9c' : null,
                        }}
                      >
                        <td
                          onClick={() => {
                            setSelectedLoan(el)
                            detailPage.onTrue();
                          }}
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: 'blue'
                          }}>
                          {el?.code ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {el?.productName ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {formatMoney(el?.amount) ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {formatMoney(el?.uldegdel) ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {formatMoney(el?.rateAmt) ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {formatMoney(el?.rateAmtinRate) ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {el?.startDate ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {el?.endDate ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {el?.expDays ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {formatMoney(el?.expAmt) ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {formatMoney(el?.closeAmt) ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          {el?.riskDate ?? ""}
                        </td>
                        <td
                          style={{
                            border: '1px solid #dddddd',
                            textAlign: 'left',
                            fontSize: '14px',
                            padding: '5px'
                          }}>
                          <IconButton
                            color={popover.open ? 'inherit' : 'default'}
                            onClick={(event) => {
                              setSelectedLoan(el);
                              popover.onOpen(event);
                            }}
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </td>
                      </tr>
                    })}
                    <tr>
                      <th colSpan={3} style={{
                        border: '1px solid #dddddd',
                        textAlign: 'left',
                        fontSize: '11px',
                        padding: '5px'
                      }}>
                        Нийт авсан зээл: {totalzeel}
                      </th>
                      <th colSpan={3} style={{
                        border: '1px solid #dddddd',
                        textAlign: 'left',
                        fontSize: '11px',
                        padding: '5px'
                      }}>
                        Нийт хугацаа хэтэрсэн зээл: {totalexpzeel}
                      </th>
                      <th colSpan={3} style={{
                        border: '1px solid #dddddd',
                        textAlign: 'left',
                        fontSize: '11px',
                        padding: '5px'
                      }}>
                        ХИ хугацаа хэтэрсэн өдөр: {maxexpday}
                      </th>
                      <th colSpan={4} style={{
                        border: '1px solid #dddddd',
                        textAlign: 'left',
                        fontSize: '11px',
                        padding: '5px'
                      }}>
                        Нийт хугацаа хэтэрсэн өдөр: {totalexpdays}
                      </th>
                    </tr>
                  </table>
                </Box>
                <Box sx={tableContainerSx}>
                  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <tr>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          backgroundColor: '#e5e5e5',
                          textAlign: 'center',
                          fontSize: '14px',
                          padding: '5px'
                        }}
                        colSpan={4}>
                        Удидлага
                      </th>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                        }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              paddingTop: '3px',
                              paddingBottom: '3px',
                              paddingLeft: '20px',
                              paddingRight: '20px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid black')}
                            onMouseLeave={(e) => (e.currentTarget.style.border = '')}
                            onClick={(e) => {
                              router.push(paths.dashboard.user.loanHistory(id))
                            }}
                          >
                            <Iconify
                              width={50}
                              icon="tabler:report-money"
                            />
                            <p style={{ fontSize: '12px' }}>
                              Зээлийн түүх
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                        }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              paddingTop: '3px',
                              paddingBottom: '3px',
                              paddingLeft: '20px',
                              paddingRight: '20px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid black')}
                            onMouseLeave={(e) => (e.currentTarget.style.border = '')}
                            onClick={() => {
                              confirm.onTrue();
                            }}
                          >
                            <Iconify
                              width={50}
                              icon="ic:outline-note-add"
                            />
                            <p style={{ fontSize: '12px' }}>
                              Тэмдэглэл оруулах
                            </p>
                          </div>
                        </div>
                      </td>

                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                        }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              paddingTop: '3px',
                              paddingBottom: '3px',
                              paddingLeft: '20px',
                              paddingRight: '20px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid black')}
                            onMouseLeave={(e) => (e.currentTarget.style.border = '')}
                            onClick={() => {
                              router.push(paths.dashboard.user.edit(id))
                            }}
                          >
                            <Iconify
                              width={50}
                              icon="material-symbols:person-edit-rounded"
                            />
                            <p style={{ fontSize: '12px' }}>
                              Мэдээлэл засах
                            </p>
                          </div>
                        </div>
                      </td>

                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                        }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              paddingTop: '3px',
                              paddingBottom: '3px',
                              paddingLeft: '20px',
                              paddingRight: '20px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid black')}
                            onMouseLeave={(e) => (e.currentTarget.style.border = '')}
                            onClick={() => {
                              riskDate.onTrue();
                            }}
                          >
                            <Iconify
                              width={50}
                              icon="material-symbols:date-range"
                            />
                            <p style={{ fontSize: '12px' }}>
                              Хүү алданги зогсоох огноо
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* <td
                      style={{
                        border: '1px solid #dddddd',
                        textAlign: 'left',
                        fontSize: '14px',
                        padding: '5px',
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            paddingTop: '3px',
                            paddingBottom: '3px',
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid black')}
                          onMouseLeave={(e) => (e.currentTarget.style.border = '')}
                          onClick={() => {
                            getNoteList(id)
                            noteList.onTrue()
                          }}
                        >
                          <Iconify
                            width={50}
                            icon="mdi:list-box-outline"
                          />
                          <p style={{ fontSize: '12px' }}>
                            Тэмдэглэл жагсаалт
                          </p>
                        </div>
                      </div>
                    </td> */}
                    </tr>
                  </table>
                </Box>
                <Box sx={tableContainerSx}>
                  <table style={{ border: '1px solid #dddddd', borderCollapse: 'collapse', width: '100%' }}>
                    <tr>
                      <th
                        style={{
                          border: '1px solid #dddddd',
                          backgroundColor: '#e5e5e5',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px'
                        }}
                        colSpan={4}>
                        Тэмдэглэл
                      </th>
                    </tr>
                    {isLoadingNoteList ? <tr>
                      <td
                        style={{
                          border: '1px solid #dddddd',
                          textAlign: 'left',
                          fontSize: '14px',
                          padding: '5px',
                          whiteSpace: 'nowrap'
                        }}>
                        <LoadingScreen sx={{ height: '200px' }} />
                      </td>
                    </tr> :
                      notes.map((note, index) => {
                        return <tr >
                          <td style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
                              <p style={{ margin: '0px' }}>
                                Хэрэглэгч : <strong>{note.createdusername}</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                Огноо : {note.cdate}
                              </p>

                              <p style={{ margin: '0px' }}>{note.info}</p>
                            </div>
                          </td>
                        </tr>
                      })
                    }
                  </table>
                </Box>

              </Stack>

            </Stack>

            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              arrow="right-top"
              sx={{ width: 300 }}
            >
              <MenuItem
                onClick={() => {
                  laonRiskDate.onTrue();
                  popover.onClose();
                }}
              >
                <Iconify icon="material-symbols:date-range" />
                Хүү алданги зогсоох огноо
              </MenuItem>

              <MenuItem
                onClick={async () => {
                  popover.onClose();
                  let bodyData = {
                    "id": selectedLoan.id,
                    "riskdate": null,
                  };
                  console.log("bodyData", bodyData);
                  const { success, msg, data } = await addRiskDateOnLoan(bodyData, login)
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
                  getUserDetail();
                  enqueueSnackbar("Огноо цуцаллаа.");
                }}
              >
                <Iconify icon="material-symbols:free-cancellation" />
                Хүү алданги зогсоох огноо цуцлах
              </MenuItem>
            </CustomPopover>
          </Stack>
        </Card>
        }
      </Container>

      <ConfirmDialog
        open={detailPage.value}
        maxWidth="lg"
        onClose={() => {
          detailPage.onFalse();
        }}
        title="Зээлийн дэлгэрэнгүй мэдээлэл"
        cancelText={"Хаах"}
        content={
          <Box sx={{ width: '100%', }}>
            <Box sx={{ height: "20px" }} />
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Stack direction="row" spacing={2}>
                <Stack direction="column" spacing={2} flexGrow={1}>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">Зээлийн дугаар:</Typography>
                    <RHFTextField disabled name="" label="" sx={{ width: '60%' }} value={selectedLoan.code} />
                  </Stack>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">Зээл авсан огноо:</Typography>
                    <RHFTextField disabled name="" label="" sx={{ width: '60%' }} value={selectedLoan.startDate} />
                  </Stack>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">Зээл авсан хугацаа:</Typography>
                    <RHFTextField disabled name="" label="" sx={{ width: '60%' }} value={(new Date(selectedLoan.endDate) - new Date(selectedLoan.startDate)) / (1000 * 60 * 60 * 24)} />
                  </Stack>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">{`Нийт хугацаа хэтэрсэн \nөдөр`}:</Typography>
                    <RHFTextField disabled name="" label="" sx={{ width: '60%' }} value={0} />
                  </Stack>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">Зээл хаах дүн:</Typography>
                    <RHFTextField disabled name="" label="" sx={{ width: '60%' }} value={formatMoney(selectedLoan.closeAmt)} />
                  </Stack>
                </Stack>
                <Stack direction="column" spacing={2} flexGrow={1}>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">Зээлийн хүү /сараар/:</Typography>
                    <RHFTextField disabled name="journalNo" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">Зээл дуусах огноо:</Typography>
                    <RHFTextField disabled name="journalNo" label="" sx={{ width: '60%' }} value={selectedLoan.endDate} />
                  </Stack>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">Хугацаа хэтэрсэн өдөр:</Typography>
                    <RHFTextField disabled name="journalNo" label="" sx={{ width: '60%' }} value={Math.max(0, Math.floor((new Date(selectedLoan.startDate).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)))} />
                  </Stack>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">Анх авсан зээлийн дүн:</Typography>
                    <RHFTextField disabled name="journalNo" label="" sx={{ width: '60%' }} value={formatMoney(selectedLoan.amount)} />
                  </Stack>
                  <Stack direction="row" >
                    <Typography sx={{ width: '30%' }} variant="subtitle2">Сунгах дүн:</Typography>
                    <RHFTextField disabled name="" label="" sx={{ width: '60%' }} value={formatMoney(selectedLoan.expAmt)} />
                  </Stack>
                </Stack>
              </Stack>
            </FormProvider>
          </Box>
        }
        action={
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              setEndDate(selectedLoan.endDate)
              router.push(
                paths.dashboard.loan.manualExtend(selectedLoan.id),
              )
            }}
          >
            Эргэн төлөлт
          </Button>
        }
      />

      {/* Тэмдэглэл оруулах */}
      <ConfirmDialog
        open={confirm.value}
        onClose={() => {
          setNoteText("");
          confirm.onFalse();
        }}
        title="Тэмдэглэл оруулах"
        content={
          <>
            <TextField
              value={noteText}
              fullWidth
              placeholder="Тэмдэглэл..."
              multiline
              rows={5}
              maxRows={5}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            loading={isSavingNote}
            onClick={async () => {
              if (noteText === "" || noteText === " ") {
                enqueueSnackbar("Тэмдэглэл оруулна уу", { variant: 'error' })
                return;
              }
              try {
                setIsLoading(true)
                const { success, msg, data } = await addNote({
                  dataid: id,
                  note: noteText,
                }, login);
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
                enqueueSnackbar("Тэмдэглэл амжилттай нэмлээ.");
                setIsLoading(false)
                // handleDeleteRows();
                console.log(noteText);
                setNoteText("");
                confirm.onFalse();
                getNoteList(id)
              } catch (error) {
                setIsLoading(false)
              }

            }}
          >
            Хадгалах
          </LoadingButton>
        }
      />

      {/* Эрсдсэн онгоо оруулах */}
      <ConfirmDialog
        open={riskDate.value}
        onClose={() => {
          setRiskDateValue("");
          riskDate.onFalse();
        }}
        title="Огноо оруулах"
        content={
          <>
            <div style={{ height: '20px' }} />
            <DatePicker
              label="Хүү алданги зогсоох огноо"
              format="yyyy-MM-dd"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: false,
                },
              }}
              value={riskDateValue}
              onChange={(val) => {
                setRiskDateValue(val)
              }}
            />
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            loading={isRiskLoading}
            onClick={async () => {
              if (riskDateValue === "" || riskDateValue === " ") {
                enqueueSnackbar("Эрсдлийн огноо сонгоно уу", { variant: 'error' })
                return;
              }
              try {
                setIsRiskLoading(true)
                const formdata = new FormData();
                let bodyData = {
                  "id": id,
                  "riskdate": formatDateToString(riskDateValue),
                  "fname": currentUser.fname,
                  "lname": currentUser.lname,
                  "rd": currentUser.rd,
                  "social": currentUser.social,
                  "bdate": currentUser.bdate,
                  "merred": currentUser.merred,
                  "company": currentUser.company,
                  "ajil": currentUser.ajil,
                  "phone": currentUser.phone,
                  "phoneLogin": currentUser.phoneLogin,
                  "email": currentUser.email,
                  "gender": currentUser.gender,
                  "address": currentUser.address,
                  "productId": currentUser.productId,
                  "companyreg": currentUser.companyreg,
                  "shopname": currentUser.shopname,
                  "shopaddress": currentUser.shopaddress,
                  "descr": currentUser.descr,
                  "familymember": currentUser.familymember,
                  "familymemberPhone": currentUser.familymemberPhone,
                  "isobject": currentUser.isobject,
                  "bankCode": currentUser.bankCode,
                  "account": currentUser.acc,
                  "pass": currentUser.pass,
                  "familymember2": currentUser.familymember2,
                  "familymemberPhone2": currentUser.familymemberPhone2,
                  "islock": currentUser.islock
                };
                for (const key in bodyData) {
                  if (bodyData[key] !== undefined && bodyData[key] !== null) {
                    formdata.append(key, bodyData[key]);
                  }
                }
                const { success, msg, data } = await editNewUser(formdata, login)
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
                enqueueSnackbar("Огноо амжилттай нэмлээ.");
                setIsRiskLoading(false)
                riskDate.onFalse();
              } catch (error) {
                setIsRiskLoading(false)
              }

            }}
          >
            Хадгалах
          </LoadingButton>
        }
      />

      {/*Зээлийн эрсдсэн онгоо оруулах */}
      <ConfirmDialog
        open={laonRiskDate.value}
        onClose={() => {
          setLoanRiskDateValue("");
          laonRiskDate.onFalse();
        }}
        title="Огноо оруулах"
        content={
          <>
            <div style={{ height: '20px' }} />
            <DatePicker
              label="Хүү алданги зогсоох огноо"
              format="yyyy-MM-dd"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: false,
                },
              }}
              value={loanRiskDateValue}
              onChange={(val) => {
                setLoanRiskDateValue(val)
              }}
            />
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            loading={isRiskLoading}
            onClick={async () => {
              if (loanRiskDateValue === "" || loanRiskDateValue === " " || loanRiskDateValue === undefined) {
                enqueueSnackbar("Эрсдлийн огноо сонгоно уу", { variant: 'error' })
                return;
              }
              try {
                setIsRiskLoading(true)
                let bodyData = {
                  "id": selectedLoan.id,
                  "riskdate": formatDateToString(loanRiskDateValue),
                };
                console.log("bodyData", bodyData);

                const { success, msg, data } = await addRiskDateOnLoan(bodyData, login)
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
                getUserDetail();
                enqueueSnackbar("Огноо амжилттай нэмлээ.");
                laonRiskDate.onFalse();
                setIsRiskLoading(false)
                riskDate.onFalse();
              } catch (error) {
                setIsRiskLoading(false)
              } finally {
                setIsRiskLoading(false)
              }

            }}
          >
            Хадгалах
          </LoadingButton>
        }
      />

      {/* Тэмдэглэл жагсаалт */}
      <ConfirmDialog
        open={noteList.value}
        maxWidth="sm"
        onClose={() => {
          setNotes([]);
          noteList.onFalse();
        }}
        title="Тэмдэглэлүүд"
        cancelText={"Хаах"}
        content={
          isLoadingNoteList ?
            <Box sx={{ width: '100%', height: '60vh' }}>
              <LoadingScreen sx={{ width: '100%' }} />
            </Box > :
            <Box sx={{ width: '100%', height: '60vh' }}>
              <Stack spacing={2}>
                {notes.map((note, index) => (
                  <NoteItem
                    note={note.info}
                    user={note.createdusername}
                    date={note.cdate}
                  />
                ))}
              </Stack>
              <Box sx={{ height: "20px" }} />
            </Box >
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
