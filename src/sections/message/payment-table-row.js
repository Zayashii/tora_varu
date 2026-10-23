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
// ----------------------------------------------------------------------

export default function PaymentTableRow({
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

  const popover = usePopover();

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
              display: "flex",
              justifyContent: "center",
            }}
          >
            {row?.utas ?? ""}
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
              display: "flex",
              justifyContent: "center",
            }}
          >
            {formatStringDate(row?.lastlogin) ?? ""}
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
              display: "flex",
              justifyContent: "center",
            }}
          >
            {row?.utas ?? ""}
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
              display: "flex",
              justifyContent: "center",
            }}
          >
            {row?.utas ?? ""}
          </Box>
        </TableCell>
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

PaymentTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
