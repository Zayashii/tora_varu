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
import LoanTableRow from '../loan-table-row';
import LoanTableToolbar from '../loan-table-toolbar';

import { getLoanList } from 'src/api/loan';
import { LoadingScreen } from 'src/components/loading-screen';
import { Box, height, width } from '@mui/system';
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
import { importLoanByExcel } from 'src/api/loan';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sequence', label: '№', width: '10px' },
  { id: 'fullname', label: 'Овог нэр', },
  { id: 'rd', label: 'РД' },
  { id: 'phone', label: 'Утас', },
  // { id: 'reqDate', label: 'Хүсэлт огноо', },
  { id: 'startDate', label: 'Олгосон огноо' },
  { id: 'days', label: 'Хугацаа' },
  { id: 'amount', label: 'Зээлийн дүн' },
  { id: 'status', label: 'Төлөв' },
  { id: 'uldegdel', label: 'Үлдэгдэл' },
  { id: 'rate_amt', label: 'Хүү төг' },
  { id: 'aldangi', label: 'Алданги' },
  { id: 'expamt', label: 'Сунгах дүн' },
  { id: 'closeamt', label: 'Хаах дүн' },
  { id: '', label: '' },
];

const defaultFilters = {
  name: "",
  phone: "",
  rd: "",
};

// ----------------------------------------------------------------------

export default function LoanListView() {
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

  const fileInputRef = useRef(null);


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formdata = new FormData();
      formdata.append("file", file)
      const { success, data } = await importLoanByExcel(formdata)
      if (success) {
        enqueueSnackbar(data)
        getData()
      } else {
        enqueueSnackbar(data, { variant: 'error' })
      }
    }
    //   setSelectedFile(file);
    // } else {
    //   setSelectedFile(null); // Reset if no file selected
    // }
  };

  const handleButtonClick = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click(); // Trigger the file input click
  };

  const clearFilter = () => {
    setFilters(defaultFilters);
    table.onResetPage()
    setReloadData(!reLoadData);
  }

  async function getData() {
    setIsLoading(true)
    let params = {};
    if (filters.name !== null && filters.name !== "") {
      params.fname = filters.name
    }
    if (filters.phone !== null && filters.phone !== "") {
      params.phone = filters.phone
    }
    if (filters.rd !== null && filters.rd !== "") {
      params.regno = filters.rd
    }
    params.pageno = table.page + 1
    params.pagesize = table.rowsPerPage

    const { success, data } = await getLoanList(params);
    console.log("res bn ->", data)

    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data)
    data.zeel.map((el, index) => {
      el.sequence = table.page * table.rowsPerPage + index + 1
    })
    setTableData(data.zeel)
    setTotal(data.totalqtyzeel)
    setIsLoading(false)
  }

  useEffect(() => {
    getData();
  }, [reLoadData, table.rowsPerPage, table.page]);

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
    console.log("called ", table.order, table.orderBy);
    console.log(tableData);
    // if (table.orderBy === "sequence") {
    //   setTableData([...tableData.reverse()])
    //   return
    // }
    var sortedData = [...sortByKey(tableData, table.orderBy, table.order)]
    setTableData(sortedData)
  }, [table.onSort]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Зээлийн жагсаалт"
          links={[
            { name: 'Жагсаалт' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.loan.createManually}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Зээл үүсгэх
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <LoanTableToolbar
            filters={filters}
            onFilters={handleFilters}
            clearFilter={clearFilter}
            reLoadData={reLoadData}
            setReloadData={() => {
              setReloadData(!reLoadData)
              console.log("called");
              table.onResetPage();
            }}
          //
          />

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
                          <LoanTableRow
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
        <input
          ref={fileInputRef}
          type='file'
          id='userExcel'
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div
          style={{
            paddingTop: "20px",
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
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
            ЭКСЭЛ-C ОРУУЛАХ
          </Button>
          {/* <Button variant="contained" rel="noopener" href={paths.auth.jwt.register}
            sx={{
              backgroundColor: 'yellow',
              color: 'white',
              width: '120px',
              height: '35px',
              borderRadius: '20px 20px 20px 20px',
              fontSize: '11px',
              fontWeight: 'bold',
              // fontFamily: 'Open Sans Condensed", sans-serif',
              '&:hover': {
                backgroundColor: 'red',
                color: 'white',
                boxShadow: 'none',
                borderColor: 'transparent',
                opacity: 0.5,
              },
            }}
          >
            БҮРТГҮҮЛЭХ
          </Button> */}
        </div>
      </Container>

    </>
  );
}

// ----------------------------------------------------------------------
