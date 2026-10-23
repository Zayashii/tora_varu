'use client';

import { useState, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
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
// _mock
import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
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
//
import RevenueTableRow from '../revenue-table-row';
import RevenueTableToolbar from '../revenue-table-toolbar';
import OrderTableFiltersResult from '../order-table-filters-result';

import { getUserInfoList } from 'src/api/dashboard';
import { useEffect } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { width } from '@mui/system';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'no', label: '№', width: '10px' },
  { id: 'name', label: 'Овог Нэр' },
  { id: 'type', label: 'Төрөл' },
  { id: '', label: '' },
];

const defaultFilters = {
  name: null,
  phone: null,
  rd: null,
};

// ----------------------------------------------------------------------

export default function UserInfoListView() {
  const table = useTable({ defaultRowsPerPage: 50, defaultDense: true });
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuthContext();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(_orders);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);

  const [reLoadData, setReloadData] = useState(false);

  const [total, setTotal] = useState(0);

  const clearFilter = () => {
    setFilters(defaultFilters);
    table.onResetPage();
    // setReloadData(!reLoadData);
  }

  async function getData() {
    setIsLoading(true)
    // table.onResetPage();
    const { success, data } = await getUserInfoList({ fname: filters.name, phone: filters.phone, regno: filters.rd, pageno: table.page + 1, pagesize: table.rowsPerPage });
    console.log("res bn ->", data)

    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }

    for (let index = 0; index < data.datalist.length; index++) {
      const element = data.datalist[index];
      let list = [];
      for (let j = 0; j < data.zeellist.length; j++) {
        const loanEl = data.zeellist[j];
        if (element.id === loanEl.dataId) {
          list.push(loanEl);
        }
      }
      element.loans = list;
    }

    console.log("data bn 2 ->", data)
    setTableData(data.datalist)
    setTotal(data.totalqtydata)
    setIsLoading(false)
  }


  useEffect(() => {
    getData();
  }, [reLoadData, table.rowsPerPage, table.page]);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

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

      table.onUpdatePageDeleteRow(tableData.length);
    },
    [tableData.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: tableData.length,
      totalRowsFiltered: tableData.length,
    });
  }, [tableData.length, tableData.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Харилцагчийн мэдээлэл"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            { name: 'Харилцагчийн мэдээлэл' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

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
        ) : < Card >
          <RevenueTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            getData={getData}
            clearFilter={clearFilter}
            reLoadData={reLoadData}
            setReloadData={() => table.onResetPage()}
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
              dense={false}
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
          </TableContainer>

          
        </Card>}
      </Container >

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}