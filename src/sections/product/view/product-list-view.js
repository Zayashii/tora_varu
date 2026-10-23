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
import ProductTableRow from '../product-table-row';
import { getProductList } from 'src/api/user';
import { useSnackbar } from 'src/components/snackbar';
import Box from '@mui/material/Box';
import { useAuthContext } from 'src/auth/hooks';
import ProductNewEditForm from '../product-new-edit-form';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: '№', width: '10px' },
  { id: 'Бүтээгдэхүүн нэр', label: 'Бүтээгдэхүүн нэр' },
  { id: 'Дээд дүн', label: 'Дээд дүн', },
  { id: 'Эхлэх', label: 'Эхлэх', },
  { id: 'Доод дүн', label: 'Доод дүн', },
  { id: 'Хүү', label: 'Хүү', },
  { id: 'Үндсэн сар', label: 'Үндсэн сар' },
  { id: 'Хөнгөлөх сар', label: 'Хөнгөлөх сар' },
  { id: 'Төлөв', label: 'Төлөв' },
  { id: 'Сунгалтын тоо', label: 'Сунгалтын тоо' },
  { id: 'Сунгалтын шимтгэл %', label: 'Сунгалтын шимтгэл %' },
  { id: 'Тохиргоо', label: 'Тохиргоо' },
];

// ----------------------------------------------------------------------

export default function ProductListView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 50
  });
  const { logout } = useAuthContext();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(null);

  const confirm = useBoolean();
  const detailPage = useBoolean();

  const onSuccessEditProduct = () => {
    getData();
    detailPage.onFalse();
  }

  async function getData() {
    setIsLoading(true)
    const { success2, data2 } = await getProductList();
    console.log("res bn ->", data2)

    if (!success2) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data2)
    setTableData(data2)
    setIsLoading(false)
  }

  useEffect(() => {
    getData();
  }, []);

  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const notFound = (!tableData.length);

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
      totalRowsFiltered: tableData.length,
    });
  }, [tableData.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Бүтээгдэхүүн жагсаалт"
          links={[
            // {
            //   name: 'Бүтээгдэхүүн',
            //   href: paths.dashboard.product.root,
            // },
            { name: 'Жагсаалт' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Бүтээгдэхүүн нэмэх
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <TablePaginationCustom
            count={tableData.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

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
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row, index) => (
                          <ProductTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => {
                              setCurrentProduct(row)
                              detailPage.onTrue();
                            }}
                            onViewRow={() => handleViewRow(row.id)}
                            index={index}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          
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

      {/* Бүтээгдэхүүн засах */}
      <ConfirmDialog
        open={detailPage.value}
        maxWidth="xxl"
        onClose={() => {
          setCurrentProduct(null)
          detailPage.onFalse();
        }}
        title="Бүтээгдэхүүн засах"
        cancelText={"Хаах"}
        content={
          <Box sx={{ width: '100%', height: '80vh' }}>
            <Box sx={{ height: "20px" }} />
            <ProductNewEditForm currentProduct={currentProduct} onSucess={onSuccessEditProduct} />
            <Box sx={{ height: "20px" }} />
          </Box>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, stock, publish } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (product) => product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.publish));
  }

  return inputData;
}
