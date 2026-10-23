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
import MoneyJournalTableRow from '../moneyjournal-table-row';
import MoneyJournalTableToolbar from '../moneyjournal-table-toolbar';

import { getMoneyJournalList } from 'src/api/finance';
import { LoadingScreen } from 'src/components/loading-screen';
import { Box, height, width } from '@mui/system';
import { useSnackbar } from 'src/components/snackbar';
import Stack from '@mui/material/Stack';
import { useAuthContext } from 'src/auth/hooks';
import { formatDateToString } from 'src/utils/formatter';
import { useForm, FormProvider } from "react-hook-form";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '', width: '10px' },
  { id: 'no', label: '№', width: '10px' },
  { id: 'Харилцагч', label: 'Харилцагч', },
  { id: 'Огноо', label: 'Огноо' },
  { id: 'Гүйлгээ №', label: 'Гүйлгээ №', },
  { id: 'Утга', label: 'Утга', },
  { id: 'Дүн', label: 'Дүн' },
  { id: 'Төрөл', label: 'Төрөл' },
  { id: 'Дансны төрөл', label: 'Дансны төрөл' },
  { id: 'МГ төрөл', label: 'МГ төрөл' },
  { id: 'Засвар', label: 'Засвар' },
  { id: '', label: '' },
];

const defaultFilters = {
  begindate: new Date(),
  // begindate: new Date('2024-06-01T00:00:00'),
  enddate: new Date(),
};

// ----------------------------------------------------------------------

export default function MoneyJournalListView() {
  const router = useRouter();
  const { logout, login } = useAuthContext();

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 50
  });
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(false);

  const [reLoadData, setReloadData] = useState(false);

  const [total, setTotal] = useState(0);

  const isFirstRender = useRef(true);

  const [types, setTypes] = useState([

    { case: null, return: "Бүгд" },

    { case: "ze", return: "Олголт" },

    { case: "fe", return: "Шимтгэл" },

    { case: "pa", return: "Төлөлт" },

    { case: "pe", return: "Сунгалт" },

    { case: "ra", return: "Хүү" },

    { case: "rr", return: "Алданги" },

    { case: "lo", return: "Бага дүнтэй" }

  ]);

  const [selectedType, setSelectedType] = useState(types[0])

  const [checkedRows, setCheckedRows] = useState([])


  const clearFilter = () => {
    setFilters(defaultFilters);
    table.onResetPage()
    setReloadData(!reLoadData);
  }

  async function getData() {
    setIsLoading(true)
    const { success, msg, data } = await getMoneyJournalList({ begindate: formatDateToString(filters.begindate), enddate: formatDateToString(filters.enddate), pageno: (table.page + 1), pagesize: table.rowsPerPage, type: selectedType.case }, login);
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
    console.log("data bn 3 ->", data)
    setTableData(data.zeel)
    setTotal(data.qtyjournal)
    setIsLoading(false)
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Mark the first render as completed
      return; // Skip the first call
    }
    getData();
  }, [reLoadData]);

  useEffect(() => {
    getData();
  }, [table.rowsPerPage, table.page])

  useEffect(() => {
    if (methods.watch("type") !== null && methods.watch("type") !== undefined) {
      const selectedData = methods.watch("type")
      console.log("selectedData===========> ", selectedData);
      const data = types.find(item => item.case === selectedData.case)
      console.log("asdasd", data);
      setSelectedType(data)
    }
  }, [methods.watch("type")])


  const dataInPage = (tableData ?? []).slice(
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
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Журнал жагсаалт"
          links={[
            { name: 'Жагсаалт' },
          ]}
          action={
            <></>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <FormProvider {...methods}>
            <MoneyJournalTableToolbar
              filters={filters}
              onFilters={handleFilters}
              clearFilter={clearFilter}
              reLoadData={reLoadData}
              setReloadData={() => {
                setReloadData(!reLoadData)
                console.log("called");
                table.onResetPage();
              }}
              types={types}
              selectedType={selectedType}
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
                          <MoneyJournalTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row)}
                            onSelectRow={() => table.onSelectRow(row)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            page={table.page}
                            rowsPerPage={table.rowsPerPage}
                            index={index}
                            onSelectLoanHistory={() => router.push(paths.dashboard.user.loanHistory(row.id))}
                            handleOnEdit={() => router.push(paths.dashboard.user.edit(row.id))}
                            onCheck={() => {
                              if (checkedRows.includes(row)) {
                                const filtered = checkedRows.filter(item => item !== row);
                                setCheckedRows(filtered)
                              } else {
                                setCheckedRows([...checkedRows, row])
                              }
                            }}
                            checkedRows={checkedRows}
                            setCheckedRows={setCheckedRows}
                            login={login}
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
