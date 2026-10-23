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
import ExpiredLoanTableRow from '../expiredloan-table-row';

import { getExpiredLoanList } from 'src/api/loan';
import { LoadingScreen } from 'src/components/loading-screen';
import { Box, height, width } from '@mui/system';
import { useSnackbar } from 'src/components/snackbar';
import Stack from '@mui/material/Stack';
import { useAuthContext } from 'src/auth/hooks';
import { getProductList } from 'src/api/user';
import ExpiredLoanTableToolbar from '../expiredloan-table-toolbar';
import { useForm, FormProvider } from "react-hook-form";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sequence', label: '№', width: '10px' },
  { id: 'rd', label: 'РД' },
  { id: 'fname', label: 'Овог', },
  { id: 'lname', label: 'Нэр', },
  { id: 'phone', label: 'Утас', },
  { id: 'productName', label: 'ЗТ', },
  { id: 'amount', label: 'Үндсэн зээл' },
  { id: 'uldegdel', label: 'Үлдэгдэл' },
  { id: 'rateAmt', label: 'Хүү' },
  { id: 'rateAmtInRate', label: 'Алданги' },
  // { id: 'totalAmt', label: 'Нийт' },
  { id: 'closeAmt', label: 'Хаах дүн' },
  { id: 'expAmt', label: 'Сунгах дүн' },
  { id: 'endDate', label: 'Төлөлтийн өдөр' },
  { id: 'expDays', label: 'ХХХ' },
];

const defaultFilters = {
  name: "",
  phone: "",
  rd: "",
};

// ----------------------------------------------------------------------

export default function ExpiredLoanListView() {
  const router = useRouter();
  const { logout, login } = useAuthContext();

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 100
  });

  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);

  const [reLoadData, setReloadData] = useState(false);

  const [total, setTotal] = useState(0);

  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [summary, setSummary] = useState(null)


  const methods = useForm({
    defaultValues: {
      product: null,
    },
  });

  const { reset, setValue, watch } = methods;

  const clearFilter = () => {
    setFilters(defaultFilters);
    table.onResetPage()
    setReloadData(!reLoadData);
    setSelectedProduct(null)
    setValue("product", null)
  }

  async function getProductData() {
    const { success2, msg2, data2 } = await getProductList({}, login);

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
    const activeProducts = data2.filter(item => item.status === 1)
    setProducts(activeProducts)
    if (activeProducts.length > 0) {
      // setValue("product", activeProducts[0])
      // setSelectedProduct(activeProducts[0])
    }
  }

  useEffect(() => {
    if (watch("product") !== null && watch("product") !== undefined) {
      const selectedProd = watch("product")
      const prod = products.find(item => item.id === selectedProd.id)
      setSelectedProduct(prod)
    }
  }, [watch("product")])

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

    const { success, msg, data } = await getExpiredLoanList({ pagenumber: table.page + 1, pagesize: table.rowsPerPage, productid: selectedProduct?.id ?? null }, login);
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
    data.zeel.map((el, index) => {
      el.sequence = table.page * table.rowsPerPage + index + 1
    })
    setTableData(data.zeel)
    setTotal(data.qtytotalzeel)
    setSummary(data.summary)
    setIsLoading(false)
  }

  useEffect(() => {
    getData();
  }, [reLoadData, table.rowsPerPage, table.page]);

  useEffect(() => {
    getProductData();
  }, []);

  const dataInPage = table.page * table.rowsPerPage;

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
    var sortedData = [...sortByKey(tableData, table.orderBy, table.order)]
    setTableData(sortedData)
  }, [table.onSort]);

  console.log('selectedProduct', selectedProduct);

  const tdStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    fontSize: '14px',
    padding: '6px',
    whiteSpace: 'nowrap'
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Хугацаа хэтэрсэн зээлийн жагсаалт"
          links={[
            { name: 'Жагсаалт' },
          ]}
          action={
            <></>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>

          <table style={{ margin: '22px', fontSize: '11px', width: '250px', borderCollapse: 'collapse', border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>
            <tbody>
              <tr style={{
                border: '1px solid #dddddd',
                backgroundColor: '#e5e5e5',
                textAlign: 'left',
                fontSize: '14px',
                padding: '5px'
              }}>
                <td style={tdStyle}><b>Зээлийн багц</b></td>
                <td style={tdStyle}>{summary?.totalamt ?? ""}</td>
              </tr>
              <tr style={{
                border: '1px solid #dddddd',
                textAlign: 'left',
                fontSize: '14px',
                padding: '5px'
              }}>
                <td style={tdStyle}><b>ХХЗ тоо</b></td>
                <td style={tdStyle}>{summary?.totalexpqty ?? ""}</td>
              </tr>
              <tr style={{
                border: '1px solid #dddddd',
                backgroundColor: '#e5e5e5',
                textAlign: 'left',
                fontSize: '14px',
                padding: '5px'
              }}>
                <td style={tdStyle}><b>ХХЗ дүн</b></td>
                <td style={tdStyle}>{summary?.totalexpamt ?? ""}</td>
              </tr>
              <tr style={{
                border: '1px solid #dddddd',
                textAlign: 'left',
                fontSize: '14px',
                padding: '5px'
              }}>
                <td style={tdStyle}><b>ХХХарилцагчийн тоо</b></td>
                <td style={tdStyle}>{summary?.custqty ?? ""}</td>
              </tr>
            </tbody>
          </table>

          <FormProvider {...methods}>
            <ExpiredLoanTableToolbar
              filters={filters}
              onFilters={handleFilters}
              products={products}
              selectedProduct={selectedProduct}
              reLoadData={reLoadData}
              setReloadData={setReloadData}
              clearFilter={clearFilter}
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
                      <TableSkeleton colSpan={15} key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData
                        .map((row, index) => (
                          <ExpiredLoanTableRow
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
                            onJumpToDetail={() => router.push(paths.dashboard.user.detail(row.dataId))}
                          />
                        ))}
                    </>
                  )}
                  {isLoading ? <></> : <TableNoData notFound={notFound} colSpan={15} />}
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
