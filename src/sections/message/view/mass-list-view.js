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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import LoadingButton from '@mui/lab/LoadingButton';
import { addMessage, addNote, getConstant, getMsgs, getNotes } from 'src/api/user';
import Stack from '@mui/material/Stack';
import { getConsumerList } from 'src/api/settings';
import { useAuthContext } from 'src/auth/hooks';
import MassTableRow from '../mass-table-row';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormProvider, {
    RHFSwitch,
    RHFTextField,
    RHFUploadAvatar,
    RHFAutocomplete,
} from 'src/components/hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Typography } from '@mui/material';
import CustomerTableRow from '../customer-table-row';
import { formatDate } from '@fullcalendar/core';
import { formatDateTime } from 'src/utils/formatter';
import { DateTimePicker } from '@mui/x-date-pickers';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { getUserList } from 'src/api/dashboard';
import UserTableToolbar from 'src/sections/user/user-table-toolbar';
import UserTableRow from 'src/sections/user/user-table-row';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'no', label: '№', width: '10px' },
    { id: 'МСЖ-ийн нэр', label: 'МСЖ-ийн нэр', align: 'center' },
    { id: 'МСЖ-ийн текст', label: 'МСЖ-ийн текст', align: 'center' },
    { id: 'Огноо', label: 'Огноо', align: 'center' },
    { id: 'Тоо', label: 'Тоо', align: 'center' },
    { id: 'Төлбөр', label: 'Төлбөр', align: 'center' },
    { id: 'Төлөв', label: 'Төлөв', align: 'center' },
    { id: 'Тохиргоо', label: 'Тохиргоо', align: 'center' },
];

const TABLE_HEAD2 = [
    { id: '', label: '', width: '10px' },
    { id: 'Овог нэр', label: 'Овог нэр', align: 'center' },
    { id: 'Код', label: 'Код', align: 'center' },
    { id: 'РД', label: 'РД', align: 'center' },
    // { id: 'Хасах', label: 'Хасах', align: 'center' },
];

const TABLE_HEAD3 = [
    //   { id: 'sequence', label: '№', width: '10px' },
    { id: '', label: '', width: '10px' },
    { id: 'rd', label: 'РД' },
    { id: 'lname', label: 'Овог', },
    { id: 'fname', label: 'Нэр', },
    { id: 'phone', label: 'Утас', },
    { id: 'shopaddress', label: 'Ажлын газар', },
    { id: 'Дүүрэг', label: 'Дүүрэг' },
    { id: 'address', label: 'Хаяг' },
    { id: 'productName', label: 'Зээл' },
    { id: 'cdate', label: 'Бүртгүүлсэн огноо' },
];

const defaultFilters = {
    name: "",
    phone: "",
    rd: "",
};

// ----------------------------------------------------------------------

export default function MassMessageListView() {
    const router = useRouter();
    const { logout, login } = useAuthContext();

    const table = useTable();
    const table2 = useTable({ defaultRowsPerPage: 10 });
    const table3 = useTable();
    const { enqueueSnackbar } = useSnackbar();

    const settings = useSettingsContext();

    const [msgList, setMsgList] = useState([])

    const [tableData, setTableData] = useState([]);

    const [modelTableData, setModelTableData] = useState([]);
    const [modalTotal, setModalTotal] = useState(0);

    const [filters, setFilters] = useState(defaultFilters);

    const [isLoading, setIsLoading] = useState(true);

    const [reLoadData, setReloadData] = useState(false);

    const [total, setTotal] = useState(0);

    const [msgType, setMsgType] = useState([])

    const [selectedMsgType, setSelectedMsgType] = useState(null)

    const [isBtnLoading, setIsBtnLoading] = useState(false)

    const newModal = useBoolean();

    const detailModal = useBoolean();

    const clearFilter = () => {
        setFilters(defaultFilters);
        table2.onResetPage()
        setReloadData(!reLoadData);
    }

    async function getData() {
        setIsLoading(true);

        const { success: userSuccess, data: userData } = await getUserList(
            { fname: filters.name, phone: filters.phone, regno: filters.rd, pageno: table2.page + 1, pagesize: table2.rowsPerPage },
            login
        );

        const { success: constantSuccess, msg, data: constantData } = await getConstant(
            { constype: "msg_totype" },
            login
        );

        const { success: msgListSuccess, msg: msgListMsg, data: msgListData } = await getMsgs({}, login);

        console.log("consumer data ->", userData);
        console.log("constant data ->", constantData);
        console.log("msgListData data ->", msgListData);

        if (!userSuccess || !constantSuccess || !msgListSuccess) {
            enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: "error" });
            logout();
            router.push(paths.auth.jwt.login);
            return;
        }

        console.log("consumer data bn 3 ->", userData);
        setTableData(userData.datalist);
        setTotal(userData.totaldataqty);

        setMsgList(msgListData.msglist)

        setMsgType(constantData)

        setIsLoading(false);
    }

    async function getModalUserListData() {
        const { success: userSuccess, data: userData } = await getUserList(
            { pageno: table3.page + 1, pagesize: table3.rowsPerPage },
            login
        );

        if (!userSuccess) {
            enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: "error" });
            logout();
            router.push(paths.auth.jwt.login);
            return;
        }

        console.log("consumer data bn 3 ->", userData);
        setModelTableData(userData.datalist);
        setModalTotal(userData.totaldataqty);
    }

    async function getUserListData() {
        const { success: userSuccess, data: userData } = await getUserList(
            { fname: filters.name, phone: filters.phone, regno: filters.rd, pageno: table2.page + 1, pagesize: table2.rowsPerPage },
            login
        );

        if (!userSuccess) {
            enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: "error" });
            logout();
            router.push(paths.auth.jwt.login);
            return;
        }

        console.log("consumer data bn 3 ->", userData);
        setTableData(userData.datalist);
        setTotal(userData.totaldataqty);
    }

    useEffect(() => {
        getModalUserListData();
    }, [reLoadData, table3.rowsPerPage, table3.page]);


    useEffect(() => {
        getUserListData();
    }, [reLoadData, table2.rowsPerPage, table2.page]);

    useEffect(() => {
        getData();
    }, [table.rowsPerPage, table.page]);

    useEffect(() => {
        setReloadData(!reLoadData);
        if (selectedMsgType === 0) {
            table2.setSelected([])
        }
    }, [selectedMsgType])

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
        [table2]
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


    const InvoiceSchema = Yup.object().shape({
        msgname: Yup.string().required('МСЖ нэр бөглөнө үү'),
        date: Yup.string().required('Огноо бөглөнө үү'),
        text: Yup.string().required('МСЖ текст бөглөнө үү').email('И-мэйл хаяг зөв оруулна уу'),
    });

    const defaultValues = {
        msgname: '',
        date: '',
        text: '',
    };

    const methods = useForm({
        resolver: yupResolver(InvoiceSchema),
        defaultValues,
    });

    const {
        setValue,
        getValues,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setStep(3)
            enqueueSnackbar('Update success!');
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <>
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
                                <div style={{ paddingRight: '50px' }}>Масс мессеж</div>
                                <LoadingButton
                                    variant="contained"
                                    sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
                                    startIcon={<Iconify icon="material-symbols:docs-add-on" />}
                                    onClick={() => {
                                        newModal.onTrue()
                                    }}
                                >
                                    Шинэ мессеж нэмэх
                                </LoadingButton>

                            </div>
                        </>
                    }
                    links={[
                        <></>
                    ]}
                    action={
                        <></>
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
                                            {msgList
                                                .map((row, index) => (
                                                    <MassTableRow
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
                                                        loginFn={login}
                                                        logoutFn={logout}
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

            <ConfirmDialog
                open={newModal.value}
                onClose={newModal.onFalse}
                title="Шинэ мсж"
                maxWidth={'md'}
                cancelText={'Хаах'}
                content={
                    <>
                        <FormProvider methods={methods} onSubmit={onSubmit}>
                            <div style={{ height: '20px' }} />
                            <Stack direction={'row'} sx={{ display: "flex", alignItems: "center" }} spacing={3}>
                                <RHFTextField name="msgname" label="МСЖ нэр" />
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <DateTimePicker
                                            {...field}
                                            label="Огноо"
                                            minutesStep={1}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!error,
                                                    helperText: error?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />

                            </Stack>
                            <div style={{ height: '20px' }} />

                            <RHFTextField name="text" label="МСЖ текст" multiline rows={3} />

                            <div style={{ height: '20px' }} />

                            <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'end', justifyContent: 'end' }}>
                                <Button variant="contained" color="error" onClick={() => { }}>
                                    Устгах
                                </Button>
                                <div style={{ width: '20px' }} />
                                <Button variant="contained" color="primary" onClick={() => { }}>
                                    Хадгалах
                                </Button>
                            </div>

                            <div style={{ height: '20px' }} />

                            <Typography sx={{ paddingRight: '30px' }} variant="subtitle2">Илгээх хэлбэр</Typography>
                            <Stack direction={'row'} sx={{ display: "flex", alignItems: "center" }} spacing={1}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="state"
                                    value={selectedMsgType}
                                    onChange={(event) => {
                                        console.log("----------------->", event.target.value);
                                        setSelectedMsgType(Number(event.target.value))
                                    }}
                                >
                                    {msgType.map((msgT) => {
                                        return <FormControlLabel value={msgT.constvalue} control={<Radio />} label={msgT.constdescr} />
                                    })}
                                    {/*                                     
                                    <FormControlLabel value="Y" control={<Radio />} label="Бүх харилцагч" />
                                    <FormControlLabel value="N" control={<Radio />} label="Сонгосон харилцагч" /> */}
                                    <Button variant="contained" color="info" onClick={() => {
                                        console.log("table2.selected", table2.selected);
                                        detailModal.onTrue();
                                    }} >
                                        Дэлгэрэнгүй
                                    </Button>
                                </RadioGroup>
                            </Stack>

                            <div style={{ height: '20px' }} />

                            {selectedMsgType === 1 ? <div>
                                <UserTableToolbar
                                    filters={filters}
                                    onFilters={handleFilters}
                                    clearFilter={clearFilter}
                                    reLoadData={reLoadData}
                                    setReloadData={() => {
                                        setReloadData(!reLoadData)
                                        table2.onResetPage();
                                    }}
                                //
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
                                        <Table size={table2.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                            <TableHeadCustom
                                                order={table2.order}
                                                orderBy={table2.orderBy}
                                                headLabel={TABLE_HEAD2}
                                                rowCount={tableData.length}
                                                numSelected={table2.selected.length}
                                                onSort={table2.onSort}
                                                onSelectAllRows={(checked) =>
                                                    table2.onSelectAllRows(
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
                                                                <CustomerTableRow
                                                                    key={row.id}
                                                                    row={row}
                                                                    selected={table2.selected.includes(row.id)}
                                                                    onSelectRow={() => table2.onSelectRow(row.id)}
                                                                    onDeleteRow={() => handleDeleteRow(row.id)}
                                                                    onEditRow={() => handleEditRow(row.id)}
                                                                    onViewRow={() => handleViewRow(row.id)}
                                                                    page={table2.page}
                                                                    rowsPerPage={table2.rowsPerPage}
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
                                    page={table2.page}
                                    rowsPerPage={table2.rowsPerPage}
                                    onPageChange={table2.onChangePage}
                                    onRowsPerPageChange={table2.onChangeRowsPerPage}
                                    //
                                    dense={table2.dense}
                                    onChangeDense={table2.onChangeDense}
                                />

                            </div> : <></>}
                        </FormProvider>
                    </>
                }
                action={
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={isBtnLoading}
                        onClick={async () => {
                            try {
                                setIsBtnLoading(true)

                                if (getValues("msgname") === "") {
                                    enqueueSnackbar("МСЖ нэр бөглөнө үү!", { variant: "error" });
                                    return
                                }

                                if (getValues("date") === "") {
                                    enqueueSnackbar("Огноо бөглөнө үү!", { variant: "error" });
                                    return
                                }

                                if (getValues("text") === "") {
                                    enqueueSnackbar("МСЖ текст бөглөнө үү!", { variant: "error" });
                                    return
                                }

                                if (selectedMsgType === null) {
                                    enqueueSnackbar("Илгээх хэлбэр сонгоно уу!", { variant: "error" });
                                    return
                                }

                                console.log(getValues("date"));

                                console.log(formatDateTime(getValues("date")));

                                let users = []

                                table2.selected.map((z) => {
                                    users.push({
                                        "dataid": z
                                    })
                                })

                                let body = {
                                    "title": getValues("msgname"),
                                    "mgstext": getValues("text"),
                                    "totype": selectedMsgType,
                                    "senddate": formatDateTime(getValues("date")),
                                    // "status": 0,
                                    "items": users,
                                }

                                const { success, msg, data } = await addMessage(body, login)

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
                                enqueueSnackbar(msg)

                                newModal.onFalse();

                            } catch (error) {
                                console.log(error);

                                enqueueSnackbar("Алдаа гарлаа", { variant: "error" });
                            } finally {
                                setIsBtnLoading(false)
                            }
                        }}>
                        Хадгалах
                    </LoadingButton>
                }
            />

            <ConfirmDialog
                open={detailModal.value}
                onClose={detailModal.onFalse}
                title=""
                maxWidth={'xxl'}
                cancelText={'Хаах'}
                content={
                    <>
                        <div>
                            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                                <TableSelectedAction
                                    dense={table3.dense}
                                    numSelected={table3.selected.length}
                                    rowCount={tableData.length}
                                    onSelectAllRows={(checked) =>
                                        table3.onSelectAllRows(
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
                                    <Table size={table3.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                        <TableHeadCustom
                                            order={table3.order}
                                            orderBy={table3.orderBy}
                                            headLabel={TABLE_HEAD3}
                                            rowCount={modelTableData.length}
                                            numSelected={table3.selected.length}
                                            onSort={table3.onSort}
                                            onSelectAllRows={(checked) =>
                                                table3.onSelectAllRows(
                                                    checked,
                                                    modelTableData.map((row) => row.id)
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
                                                    {modelTableData
                                                        .map((row, index) => (
                                                            <UserTableRow
                                                                key={row.id}
                                                                row={row}
                                                                selected={table2.selected.includes(row.id)}
                                                                onSelectRow={() => table2.onSelectRow(row.id)}
                                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                                onEditRow={() => handleEditRow(row.id)}
                                                                onViewRow={() => handleViewRow(row.id)}
                                                                page={table3.page}
                                                                rowsPerPage={table3.rowsPerPage}
                                                                index={index}
                                                                onSelectLoanHistory={() => router.push(paths.dashboard.user.loanHistory(row.id))}
                                                                handleOnEdit={() => router.push(paths.dashboard.user.edit(row.id))}
                                                                hideBtn={true}
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
                                count={modalTotal}
                                page={table3.page}
                                rowsPerPage={table3.rowsPerPage}
                                onPageChange={table3.onChangePage}
                                onRowsPerPageChange={table3.onChangeRowsPerPage}
                                //
                                dense={table3.dense}
                                onChangeDense={table3.onChangeDense}
                            />

                        </div>
                    </>}
            />
        </>
    );
}

// ----------------------------------------------------------------------
