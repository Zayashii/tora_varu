'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useRef } from 'react';
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
import StatementTableRow from '../statement-table-row';
import StatementTableToolbar from '../statement-table-toolbar';

import { getStatementList } from 'src/api/finance';
import { LoadingScreen } from 'src/components/loading-screen';
import { Box, height, maxWidth, width } from '@mui/system';
import { useSnackbar } from 'src/components/snackbar';
import { RHFTextField } from 'src/components/hook-form';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import LoadingButton from '@mui/lab/LoadingButton';
import { addNote, getNotes } from 'src/api/user';
import Stack from '@mui/material/Stack';
import { getUserDataById } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import { formatDateToString } from 'src/utils/formatter';
import { useForm, FormProvider } from "react-hook-form";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { getCollateralTypes } from 'src/api/collateral';

import { RHFSelect } from 'src/components/hook-form';
import MenuItem from '@mui/material/MenuItem';
import { importStatementByExcel } from 'src/api/finance';
import { getBankList } from 'src/api/user';

// ----------------------------------------------------------------------


const TABS = [
  {
    value: 'general',
    label: 'Жагсаалт',
    icon: <Iconify icon="material-symbols:checklist-rtl-rounded" width={24} />,
  },
  {
    value: 'excel',
    label: 'Эксэл-с оруулах',
    icon: <Iconify icon="material-symbols:upload-file" width={24} />,
  },
];

const TABLE_HEAD = [
  { id: 'Журнал №', label: 'Журнал №', width: '10px' },
  { id: 'Гүйлгээ орсон данс', label: 'Гүйлгээ орсон данс' },
  { id: 'Данс', label: 'Данс', },
  { id: 'Дүн', label: 'Дүн', },
  { id: 'Гүйлгээний утга', label: 'Гүйлгээний утга', },
  { id: 'Регистр', label: 'Регистр', },
  { id: 'Утас', label: 'Утас' },
  { id: 'Нэр', label: 'Нэр' },
  { id: 'Огноо', label: 'Огноо' },
  { id: 'Төлөв', label: 'Төлөв' },
  { id: 'Үйлдэл', label: 'Үйлдэл' },
];

const defaultFilters = {
  begindate: new Date(new Date().setDate(new Date().getDate() - 3)),
  enddate: new Date(),
};

// ----------------------------------------------------------------------

export default function StatementListView() {
  const router = useRouter();
  const { logout } = useAuthContext();

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 50
  });
  const { enqueueSnackbar } = useSnackbar();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null)

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);

  const [reLoadData, setReloadData] = useState(false);

  const [total, setTotal] = useState(0);

  const [statuses, setStatuses] = useState(['Бүгд', 'Баталгаажсан', 'Баталгаажаагүй']);

  const [selectedStatus, setSelectedStatus] = useState(statuses[0])

  const [noteText, setNoteText] = useState("")
  const [noteId, setNoteId] = useState(null)
  const [isSavingNote, setIsSavingNote] = useState(false)

  const [currentTab, setCurrentTab] = useState('general');

  const [types, setTypes] = useState([])

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const methods = useForm();

  const clearFilter = () => {
    setFilters(defaultFilters);
    setReloadData(!reLoadData);
    setSelectedStatus(null)
    methods.setValue("status", statuses[0])
  }

  const handleButtonClick = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click(); // Trigger the file input click
  };

  const handleFileSend = async (event) => {
    if (methods.watch("selectedBank") === undefined) {
      enqueueSnackbar('Банк сонгоно уу!', { variant: 'error' })
      return
    }
    if (selectedFile === null) {
      enqueueSnackbar('Файл оруулна уу!', { variant: 'error' })
      return
    }
    const formdata = new FormData();
    console.log("selectedBank", methods.watch("selectedBank"));
    formdata.append("bankid", methods.watch("selectedBank"))
    formdata.append("file", selectedFile)
    const { success, data } = await importStatementByExcel(formdata)
    if (success) {
      enqueueSnackbar(data)
      getData()
    } else {
      enqueueSnackbar(data, { variant: 'error' })
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log("asdasdasd -> ", file);

    if (file) {
      setSelectedFile(file)
    }
    else {
      setSelectedFile(null);
    }
  };

  async function getData() {
    setIsLoading(true)
    const { success, data } = await getStatementList({ begindate: formatDateToString(filters.begindate), enddate: formatDateToString(filters.enddate), pagenumber: table.page + 1, pagesize: table.rowsPerPage, StatusName: selectedStatus === "Бүгд" ? null : selectedStatus });
    console.log("res bn ->", data)

    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data)
    if (Array.isArray(data.datalist)) {
      data.datalist = data.datalist.filter(item => item.id !== undefined); // Ensure `id` exists
      data.datalist.sort((a, b) => String(a.id).localeCompare(String(b.id)));
      setTableData(data.datalist);
    } else {
      console.error('data.datalist is not an array or is improperly structured.');
    }
    setTotal(data.totaldataqty)
    methods.setValue("status", statuses[0])
    setSelectedStatus(statuses[0])
    setIsLoading(false)
  }

  useEffect(() => {
    if (methods.watch("status") !== null && methods.watch("status") !== undefined) {
      const selectedData = methods.watch("status")
      const data = statuses.find(item => item === selectedData)
      console.log("asdasd", data);
      setSelectedStatus(data)
    }
  }, [methods.watch("status")])

  useEffect(() => {
    getData();
  }, [reLoadData, table.rowsPerPage, table.page]);

  useEffect(() => {
    getExcelBanks();
  }, [])

  const dataInPage = tableData.length

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

  const getExcelBanks = async () => {
    const { success, data } = await getBankList();
    if (!success) {
      logout();
      router.push(paths.auth.jwt.login);
    }
    setTypes(data)
  }

  // const selectedStatus = methods.watch("status") || statuses[0];

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Дансны хуулга"
          links={[
            {
              name: 'Жагсаалт',
            },
          ]}
          action={
            // <Button
            //   component={RouterLink}
            //   href={paths.dashboard.user.new}
            //   variant="contained"
            //   startIcon={<Iconify icon="mingcute:add-line" />}
            // >
            //   Шинэ харилцагч
            // </Button>
            <></>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {currentTab === 'general' && <Card>
          <FormProvider {...methods}>
            <StatementTableToolbar
              filters={filters}
              onFilters={handleFilters}
              clearFilter={clearFilter}
              reLoadData={reLoadData}
              setReloadData={() => {
                setReloadData(!reLoadData)
                table.onResetPage();
              }}
              statuses={statuses}
              selectedStatus={selectedStatus}
            //
            />
          </FormProvider>

          <TablePaginationCustom
            count={total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />

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
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData
                        .map((row, index) => (
                          <StatementTableRow
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
                            handleOnEdit={() => router.push(paths.dashboard.user.edit(row.id))}
                            onAddNone={() => {
                              setNoteId(row.id)
                              confirm.onTrue();
                            }}
                            onNoteList={() => {
                              getNoteList(row.id)
                              noteList.onTrue()
                            }}
                            onDetail={() => {
                              getUserDetail(row.id)
                              detailPage.onTrue();
                            }}
                            getData={getData}
                            isShowAction={true}
                          />
                        ))}
                    </>
                  )}

                  {isLoading ? <></> : <TableNoData notFound={notFound} />}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          
        </Card>
        }
        {currentTab === 'excel' &&
          <Card sx={{ padding: '30px' }}>
            <FormProvider {...methods}>
              <Stack direction={'column'}>
                <RHFSelect
                  sx={{ maxWidth: 460 }}
                  fullWidth
                  name="selectedBank"
                  label="Дансны хуулга оруулах банк"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {types.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <input
                  ref={fileInputRef}
                  type='file'
                  id='userExcel'
                  accept=".xlsx, .xls"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <div style={{ height: '20px' }} />
                <Stack direction={"row"}
                  sx={{
                    alignContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    onClick={handleButtonClick}
                    variant="contained"
                    rel="noopener"
                    sx={{
                      backgroundColor: '#2c2c2c',
                      color: 'white',
                      width: '125px',
                      height: '40px',
                      borderRadius: '20px 20px 20px 20px',
                      fontSize: '10px',
                      fontWeight: '600',
                      // fontFamily: 'Open Sans Condensed", sans-serif',
                      '&:hover': {
                        backgroundColor: '#2c2c2c',
                        color: 'white',
                        boxShadow: 'none',
                        borderColor: 'transparent',
                        opacity: 0.5,
                      },
                    }}
                  >
                    ФАЙЛ ОРУУЛАХ
                  </Button>
                  <div style={{ width: '10px' }} />
                  {selectedFile !== null &&
                    <p style={{ fontSize: '12px' }}>
                      {selectedFile.name}
                    </p>
                  }
                </Stack>
                <div style={{ height: '20px' }} />
                <Button
                  onClick={handleFileSend}
                  variant="contained"
                  rel="noopener"
                  sx={{
                    backgroundColor: '#2c2c2c',
                    color: 'white',
                    width: '125px',
                    height: '40px',
                    borderRadius: '20px 20px 20px 20px',
                    fontSize: '10px',
                    fontWeight: '600',
                    alignSelf: 'flex-end',
                    // fontFamily: 'Open Sans Condensed", sans-serif',
                    '&:hover': {
                      backgroundColor: '#2c2c2c',
                      color: 'white',
                      boxShadow: 'none',
                      borderColor: 'transparent',
                      opacity: 0.5,
                    },
                  }}
                >
                  ФАЙЛ ИЛГЭЭХ
                </Button>
              </Stack>
            </FormProvider>
          </Card>
        }
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
