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
import CheckedMoneyJournalTableRow from './checked-journal-table-row';
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
import { useSnackbar } from 'src/components/snackbar';
import { returnJournal } from 'src/api/finance';

// ----------------------------------------------------------------------



const TABLE_HEAD = [
  { id: 'Гүйлгээ №', label: 'Гүйлгээ №', },
  { id: 'Дансны нэр', label: 'Дансны нэр', },
  { id: 'Дүн', label: 'Дүн' },
  { id: 'Огноо', label: 'Огноо' },
];



export default function MoneyJournalTableRow({
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
  setCheckedRows,
  login,
  getData
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
    note: Yup.string(),
    password: Yup.string(),
  });
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      note: '',
      password: '',
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

        <TableCell padding="checkbox">
          <Checkbox checked={checkedRows.includes(row)} onClick={onCheck} />
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
            {page * rowsPerPage + index + 1}
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
            {row?.fullname ?? ""}
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
            {row?.typename}
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
            {""}
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
            {""}
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
            {row?.zasvar ?? ""}
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
            {row?.zasvar === "Залруулга" ? <LoadingButton
              variant="contained"
              loading={false}
              onClick={async () => {
                if (checkedRows.length === 0) {
                  enqueueSnackbar("Гүйлгээ сонгоно уу!", { variant: 'error' })
                  return
                }
                returnModal.onTrue();
              }}
            >
              Буцаах
            </LoadingButton>
              : <></>}
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


      <ConfirmDialog
        maxWidth={"md"}
        open={returnModal.value}
        cancelText="Хаах"
        onClose={() => {
          returnModal.onFalse()
          setValue('note', '')
          setValue('password', '')
        }
        }
        title={'Гүйлгээ буцаах'}
        content={
          <>
            <FormProvider methods={methods} onSubmit={handleSubmit}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={checkedRows.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        checkedRows.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>

                    <>
                      {checkedRows
                        .map((row, index) => (
                          <CheckedMoneyJournalTableRow
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
                          />
                        ))}
                    </>

                  </TableBody>
                </Table>
              </Scrollbar>
              <div style={{ height: '30px' }} />
              <RHFTextField name="note" label="Тэмдэглэл" multiline rows={3} />
              <div style={{ height: '30px' }} />
              <RHFTextField name="password" label="Нууц үг" type={'password'} />
            </FormProvider>
          </>
        }
        action={
          <LoadingButton
            loading={returnLoading.value}
            variant="contained"
            color="success"
            onClick={async () => {
              try {
                if (watch('note') === '') {
                  enqueueSnackbar('Тэмдэглэл оруулна уу.', { variant: 'error' })
                  return
                }
                if (watch('password') === '') {
                  enqueueSnackbar('Нууц үг оруулна уу.', { variant: 'error' })
                  return
                }
                returnLoading.onTrue()
                let body = {
                  "statement_id": checkedRows[0].statementId,
                  "note": watch('note'),
                  "password": watch('password')
                }
                const { success, msg, data } = await returnJournal(body, login);
                if (!success) {
                  if (msg === "Дахин нэвтэрнэ үү!") {
                    enqueueSnackbar(msg, { variant: 'error' })
                  }
                  else {
                    enqueueSnackbar(msg, { variant: 'error' })
                    return;
                  }
                }
                setCheckedRows([])
                getData();
                returnModal.onFalse()
              } catch (error) {
                console.log(error);
              }
              finally {
                returnLoading.onFalse()
              }
            }}
          >
            {"Буцаах"}
          </LoadingButton>
        }
      />
    </>
  );
}

MoneyJournalTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
