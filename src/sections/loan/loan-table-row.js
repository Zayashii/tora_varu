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
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';


// ----------------------------------------------------------------------

export default function LoanTableRow({
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
}) {
  const confirm = useBoolean();
  const router = useRouter()


  const popover = usePopover();

  const isOverdue = row.status === "Хэтэрсэн";
  const cellSx = {
    backgroundColor: isOverdue ? '#ff4d4d' : '',
    color: isOverdue ? '#eae8ed' : 'inherit',
  };

  return (
    <>
      <TableRow hover selected={selected}
        sx={{
          backgroundColor: isOverdue ? '#ff4d4d' : '',
          '&:hover': {
            backgroundColor: isOverdue ? '#e60000' : '#f5f5f5',
          },
        }}
      >

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {row?.sequence}
          </Box>
        </TableCell>


        <TableCell sx={cellSx}>
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

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {row?.rd ?? ""}
          </Box>
        </TableCell>

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {row?.phone ?? ""}
          </Box>
        </TableCell>


        {/* <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {formatStringDate(row?.reqDate) ?? ""}
          </Box>
        </TableCell> */}


        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {formatStringDate(row?.startDate) ?? ""}
          </Box>
        </TableCell>

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {row?.days ?? ""}
          </Box>
        </TableCell>


        <TableCell sx={cellSx}>
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

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {row?.status ?? ""}
          </Box>
        </TableCell>

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {formatMoney(row?.uldegdel) ?? ""}
          </Box>
        </TableCell>

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {formatMoney(row?.rate_amt) ?? ""}
          </Box>
        </TableCell>

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {formatMoney(row?.aldangi) ?? ""}
          </Box>
        </TableCell>

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {formatMoney(row?.expamt) ?? ""}
          </Box>
        </TableCell>

        <TableCell sx={cellSx}>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {formatMoney(row?.closeamt) ?? ""}
          </Box>
        </TableCell>

        <TableCell sx={cellSx} align="right">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" sx={cellSx} />
          </IconButton>
        </TableCell>



        {/* <TableCell sx={cellSx} align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}


        {/* <TableCell sx={cellSx} align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow >


      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 240 }}
      >
        <MenuItem
          onClick={() => {
            // onDetail();
            popover.onClose();
            router.push(paths.dashboard.loan.extendLoan(row.id))
          }}
        >
          <Iconify icon="material-symbols:calendar-clock" />
          Зээл сунгах
        </MenuItem>

        <MenuItem
          onClick={() => {
            // onSelectLoanHistory();
            router.push(paths.dashboard.loan.closeLoan(row.id))
            popover.onClose();
          }}
        >
          <Iconify icon="material-symbols:check-circle-rounded" />
          Зээл хаах
        </MenuItem>

      </CustomPopover>


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

LoanTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
