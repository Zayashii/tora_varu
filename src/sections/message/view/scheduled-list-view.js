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
import ScheduledTableRow from '../scheduled-table-row';
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
import { getConsumerList } from 'src/api/settings';
import { useAuthContext } from 'src/auth/hooks';
import SmsRecharge from 'src/components/custom/sms-recharge';
import SmsPay from 'src/components/custom/sms-pay';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'no', label: '№', width: '10px' },
    { id: 'МСЖ-ийн төрөл', label: 'МСЖ-ийн төрөл', align: 'center' },
    { id: 'Агуулга', label: 'Агуулга', align: 'center' },
    { id: 'Тоолуур/сар/', label: 'Тоолуур/сар/', align: 'center' },
    { id: 'Төлбөр', label: 'Төлбөр', align: 'center' },
    { id: 'Төлөв', label: 'Төлөв', align: 'center' },
    { id: 'Тохиргоо', label: 'Тохиргоо', align: 'center' },
];

const defaultFilters = {
    name: "",
    phone: "",
    rd: "",
};

// ----------------------------------------------------------------------

export default function ScheduledMessageListView() {
    const router = useRouter();
    const { logout, login } = useAuthContext();

    const table = useTable();
    const { enqueueSnackbar } = useSnackbar();

    const [step, setStep] = useState(1)


    const settings = useSettingsContext();

    const [tableData, setTableData] = useState([]);

    const [filters, setFilters] = useState(defaultFilters);

    const [isLoading, setIsLoading] = useState(true);

    const [reLoadData, setReloadData] = useState(false);

    const [total, setTotal] = useState(0);

    const clearFilter = () => {
        setFilters(defaultFilters);
        table.onResetPage()
        setReloadData(!reLoadData);
    }

    async function getData() {
        setIsLoading(true)

        const { success, data } = await getConsumerList({ pagenumber: table.page + 1, pagesize: table.rowsPerPage }, login);
        console.log("res bn ->", data)

        if (!success) {
            enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
            logout()
            router.push(paths.auth.jwt.login);
            return;
        }
        console.log("data bn 3 ->", data)
        setTableData(data.users)
        setTotal(data.totalqtyuser)
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
        <>{step === 1 ?
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading={
                        <>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                            }}>
                                <div style={{ paddingRight: '50px' }}>Төлөвлөсөн мессеж</div>
                                <LoadingButton
                                    variant="contained"
                                    sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
                                    startIcon={<Iconify icon="material-symbols:docs-add-on" />}
                                    onClick={() => {
                                        setStep(2)
                                    }}
                                >
                                    Төлбөр цэнэглэх
                                </LoadingButton>

                            </div>
                        </>
                    }
                    links={[
                        <></>
                    ]}
                    action={
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            border: '1px solid #e0e0e0',
                            borderRadius: '12px',
                            padding: '12px',
                            backgroundColor: '#fff',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingLeft: '8px' }}>
                                <p style={{
                                    fontSize: '15px',
                                    color: '#969696'
                                }}>
                                    Үлдэгдэл багц
                                </p>
                                <p style={{
                                    fontSize: '12px',
                                    color: 'black',
                                    fontWeight: 'bold'
                                }}>756.0₮</p>
                            </div>
                            <div style={{
                                width: '1px',
                                height: '40px',
                                backgroundColor: '#969696'
                            }} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <p style={{
                                    fontSize: '15px',
                                    color: '#969696'
                                }}>
                                    Хугацаа
                                </p>
                                <p style={{
                                    fontSize: '12px',
                                    color: 'black',
                                    fontWeight: 'bold'
                                }}>2025-06-30</p>
                            </div>
                            <Button
                                // component={RouterLink}
                                // href={paths.dashboard.settings.newConsumer}
                                variant="contained"
                            >
                                Дэлгэрэнгүй
                            </Button>
                        </div>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Card>

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
                                                    <ScheduledTableRow
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
                </Card>
            </Container>
            : step === 2 ? <SmsRecharge setStep={setStep} /> : <SmsPay setStep={setStep} />
        }
        </>
    );
}

// ----------------------------------------------------------------------
