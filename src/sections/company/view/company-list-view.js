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
import ConsumerTableRow from '../company-table-row';
// import LoanTableToolbar from '../consumer-table-toolbar';

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
import { addEditCompany, getCompanyList } from 'src/api/settings';
import { useAuthContext } from 'src/auth/hooks';
import CompanyTableRow from '../company-table-row';
import CompanyCreatePage from 'src/app/settings/company/new/page';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Компанийн дугаар', width: '10px' },
  { id: 'name', label: 'Компанийн нэр', align: 'center' },
  { id: 'name', label: 'Бүртгэл огноо', align: 'center' },
  { id: 'active', label: 'Төлөв', align: 'center' },
  { id: 'active', label: 'Утас', align: 'center' },
  { id: 'active', label: 'Хэрэглэгчийн тоо', align: 'center' },
  { id: 'active', label: 'Төлбөр', align: 'center' },
  { id: 'useCorprate', label: 'CGW ашиглах эсэх', align: 'center' },
  { id: 'bundle', label: 'Багц', align: 'center' },
  { id: 'Тохиргоо', label: 'Тохиргоо', width: '30px', align: 'center' },
];

const defaultFilters = {
  name: "",
  phone: "",
  rd: "",
};

// ----------------------------------------------------------------------

export default function CompanyListView() {
  const router = useRouter();
  const { logout } = useAuthContext();

  const childRef = useRef();


  const table = useTable(
    {
      defaultDense: true,
      defaultRowsPerPage: 50
    }
  );
  const { enqueueSnackbar } = useSnackbar();


  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);

  const [reLoadData, setReloadData] = useState(false);

  const [total, setTotal] = useState(0);

  const confirm = useBoolean();

  const [formData, setFormData] = useState()

  const [modalLoading, setModalLoading] = useState(false)

  const clearFilter = () => {
    setFilters(defaultFilters);
    table.onResetPage()
    setReloadData(!reLoadData);
  }

  async function getData() {
    setIsLoading(true)

    const { success, msg, data } = await getCompanyList({ pagenumber: table.page + 1, pagesize: table.rowsPerPage });
    console.log("res bn ->", data)


    if (!success) {
      if (msg === "Дахин нэвтэрнэ үү!") {
        enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
        logout()
        router.push(paths.auth.jwt.login);
        return;
      } else {
        enqueueSnackbar(msg, { variant: 'error' })
        return;
      }
    } else {
      // enqueueSnackbar(msg)
    }
    setTableData(data.zeel)
    setTotal(data.qtytotalzeel)
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

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Компани жагсаалт"
          links={[
            { name: 'Жагсаалт' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                confirm.onTrue();
              }}
            >
              Шинэ компани
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* <LoanTableToolbar
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
          /> */}

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
                          <CompanyTableRow
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
                            handleOnEdit={() => router.push(paths.dashboard.settings.editCompany(row.id))}
                            getData={getData}
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
      </Container>


      <ConfirmDialog
        open={confirm.value}
        maxWidth={'xl'}
        onClose={() => {
          setFormData(null)
          confirm.onFalse();
        }}
        title=""
        content={
          <>
            <CompanyCreatePage isModal={true} setFormData={setFormData} ref={childRef} />
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            loading={modalLoading}
            onClick={async () => {
              try {
                setModalLoading(true)
                const result = await childRef.current?.submit();
                if (result?.success) {
                  confirm.onFalse();
                  getData()
                }
                console.log('Result:', result);
              } catch (error) {
                console.log(error);
              } finally {
                setModalLoading(false)
              }
            }}
          >
            Хадгалах
          </LoadingButton>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
