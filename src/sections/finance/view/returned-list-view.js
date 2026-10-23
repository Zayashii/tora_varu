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
import ReturnedTableRow from '../returned-table-row';
import ReturnedTableToolbar from '../returned-table-toolbar';

import { getReturnedJournal } from 'src/api/finance';
import { LoadingScreen } from 'src/components/loading-screen';
import { Box, height, width } from '@mui/system';
import { useSnackbar } from 'src/components/snackbar'
import { useAuthContext } from 'src/auth/hooks';
import { formatDateToString } from 'src/utils/formatter';
import { useForm, FormProvider } from "react-hook-form";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '№', label: '№', width: '10px' },
  { id: 'Гүйлгээ №', label: 'Гүйлгээ №', },
  { id: 'Нэр', label: 'Нэр' },
  { id: 'Огноо', label: 'Огноо' },
  { id: 'Дансны нэр', label: 'Дансны нэр', },
  { id: 'Дүн', label: 'Дүн', },
  { id: 'Утга', label: 'Утга', },
  { id: 'Төрөл', label: 'Төрөл' },
  { id: 'Засвар', label: 'Засвар' },
];

const defaultFilters = {
  begindate: new Date(new Date().setDate(new Date().getDate() - 3)),
  enddate: new Date(),
};

// ----------------------------------------------------------------------

export default function ReturnedListView() {
  const router = useRouter();
  const { logout, login } = useAuthContext();

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

  const [statuses, setStatuses] = useState(['Бүгд', 'Баталгаажсан', 'Баталгаажаагүй']);

  const [selectedStatus, setSelectedStatus] = useState(statuses[0])

  const [noteText, setNoteText] = useState("")
  const [noteId, setNoteId] = useState(null)
  const [isSavingNote, setIsSavingNote] = useState(false)

  const methods = useForm();

  const clearFilter = () => {
    setFilters(defaultFilters);
    setReloadData(!reLoadData);
    setSelectedStatus(null)
    methods.setValue("status", statuses[0])
  }

  async function getData() {
    setIsLoading(true)
    const { success, msg, data } = await getReturnedJournal({ begindate: formatDateToString(filters.begindate), enddate: formatDateToString(filters.enddate), pageno: table.page + 1, pagesize: table.rowsPerPage }, login);
    console.log("res bn ->", data)

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
    setTableData(data.zeel)
    setTotal(data.qtyjournal)
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

  // const selectedStatus = methods.watch("status") || statuses[0];

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Буцаасан гүйлгээний жагсаалт"
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

        <Card>
          <FormProvider {...methods}>
            <ReturnedTableToolbar
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
                          <ReturnedTableRow
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
    </>
  );
}

// ----------------------------------------------------------------------
