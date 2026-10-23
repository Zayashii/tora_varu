'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
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
import LoanHistoryTableRow from '../loan-history-table-row';
import LoanHistoryTableToolbar from '../loan-history-table-toolbar';

import { getLoanHistoryList } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ЗД', label: 'ЗД' },
  { id: 'З/төрөл', label: 'З/төрөл', },
  { id: 'ААЗ', label: 'ААЗ', },
  { id: 'ҮЗҮ', label: 'ҮЗҮ', },
  { id: 'Бод/Хүү', label: 'Бод/Хүү', },
  { id: 'Бод/Нэм/Хүү', label: 'Бод/Нэм/Хүү' },
  { id: 'ААХ	', label: 'ААХ	' },
  { id: 'ДХ', label: 'ДХ' },
  { id: 'ХХХ', label: 'ХХХ' },
  { id: 'Сунгах дүн', label: 'Сунгах дүн' },
  { id: 'Хаах дүн', label: 'Хаах дүн' },
  { id: 'Төлөв', label: 'Төлөв' },
];

const defaultFilters = {
  name: "",
  phone: "",
  rd: "",
};

// ----------------------------------------------------------------------

export default function LoanHistoryListView({ id }) {
  const router = useRouter();
  const { logout } = useAuthContext();

  const table = useTable({ defaultRowsPerPage: 1000 });

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);

  const [reLoadData, setReloadData] = useState(false);

  // const [total, setTotal] = useState(0);

  const confirm = useBoolean();

  const clearFilter = () => {
    setFilters(defaultFilters);
    table.onResetPage()
    setReloadData(!reLoadData);
  }

  async function getData() {
    setIsLoading(true)
    const { success, data } = await getLoanHistoryList({ dataid: id });
    console.log("res bn ->", data)

    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data)
    setTableData(data)
    // setTotal(data.totaldataqty)
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
          heading="Зээлийн жагсаалт"
          links={[
            {
              name: 'Харилцагчийн жагсаалт',
              href: paths.dashboard.user.root,
            },
            { name: 'Зээлийн жагсаалт' },
          ]}
          action={
            <></>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* <LoanHistoryTableToolbar
            filters={filters}
            onFilters={handleFilters}
            clearFilter={clearFilter}
            reLoadData={reLoadData}
            setReloadData={() => table.onResetPage()}
          //
          /> */}

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
                          <LoanHistoryTableRow
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
                          />
                        ))}
                    </>
                  )}

                  {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  /> */}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/* <TablePaginationCustom
            count={total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          /> */}
        </Card>
      </Container>

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

// ----------------------------------------------------------------------
