import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fCurrency } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { formatStringDate, formatMoney } from 'src/utils/formatter';
import LoadingButton from '@mui/lab/LoadingButton';
import FormProvider, {
    RHFTextField,
} from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Stack } from '@mui/system';
import Scrollbar from 'src/components/scrollbar';
import Table from '@mui/material/Table';
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
import TableBody from '@mui/material/TableBody';
// ----------------------------------------------------------------------



const TABLE_HEAD = [
    { id: 'Гүйлгээ №', label: 'Гүйлгээ №', },
    { id: 'Дансны нэр', label: 'Дансны нэр', },
    { id: 'Дүн', label: 'Дүн' },
    { id: 'Огноо', label: 'Огноо' },
];



export default function CheckedMoneyJournalTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    onEditRow,
    onViewRow,
    page,
    rowsPerPage,
    index,
    onSelectLoanHistory,
    handleOnEdit,
    onCheck,
    checkedRows,
    setCheckedRows
}) {
    const confirm = useBoolean();
    const returnModal = useBoolean();
    const returnLoading = useBoolean();

    const popover = usePopover();

    const table = useTable({
        defaultDense: true,
        defaultRowsPerPage: 50
    });

    const NewJobSchema = Yup.object().shape({
        imageUrl: Yup.mixed().nullable(),
        pdfUrl: Yup.mixed().nullable(),
        content: Yup.string(),
    });

    const defaultValues = useMemo(
        () => ({
            imageUrl: null,
            pdfUrl: null,
            content: '',
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewJobSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <>
            <TableRow hover selected={selected}>

                <TableCell>
                    <Box
                        // onClick={onViewRow}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        {row?.statementId ?? ""}
                    </Box>
                </TableCell>

                <TableCell>
                    <Box
                        // onClick={onViewRow}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        {row?.statementType ?? ""}
                    </Box>
                </TableCell>


                <TableCell>
                    <Box
                        // onClick={onViewRow}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        {formatMoney(row?.amount) ?? ""}
                    </Box>
                </TableCell>

                <TableCell>
                    <Box
                        // onClick={onViewRow}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        {`${formatStringDate(row?.cdate)} ${row?.ctime ?? ""}`}
                    </Box>
                </TableCell>

                {/* <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}


                {/* <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
            </TableRow >

            {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 240 }}
      >
        <MenuItem
          onClick={() => {
            onDetail();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Дэлгэрэнгүй
        </MenuItem>

        <MenuItem
          onClick={() => {
            onSelectLoanHistory();
            popover.onClose();
          }}
        >
          <Iconify icon="fa-solid:history" />
          Зээлийн түүх
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOnEdit();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Мэдээлэл засах
        </MenuItem>

        <MenuItem
          onClick={() => {
            onAddNone();
            popover.onClose();
          }}
        >
          <Iconify icon="ic:round-note-add" />
          Тэмдэглэл оруулах
        </MenuItem>

        <MenuItem
          onClick={() => {
            onNoteList();
            popover.onClose();
          }}
        >
          <Iconify icon="material-symbols:note" />
          Тэмдэглэл жагсаалт авах
        </MenuItem>

      </CustomPopover> */}

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />

        </>
    );
}

CheckedMoneyJournalTableRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onViewRow: PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};
