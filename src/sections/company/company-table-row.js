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
import { RHFCheckbox } from 'src/components/hook-form';
import CompanyNewEditForm from './company-new-edit-form';
// ----------------------------------------------------------------------

export default function CompanyTableRow({
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
  getData
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
            }}
          >
            {/* {page * rowsPerPage + index + 1} */}
            {row?.id ?? ""}
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
            {row?.name ?? ""}
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
            {row?.cdate ?? ""}
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
            {row?.statusName ?? ""}
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
            {row?.phone ?? ""}
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
            {row?.userQty ?? ""}
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
            {formatMoney(row?.subscriptionAmount ?? 0)}
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
            <Checkbox
              label="Success"
              color="success"
              checked={row?.useCorprate === "Y"}
            />
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
            {row?.suscriptionType ?? ""}
          </Box>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Button onClick={handleOnEdit} variant='contained' sx={{ display: "flex", justifyContent: "center" }}>
            Засах
          </Button>
        </TableCell>


        {/* <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow >

      <ConfirmDialog
        maxWidth="xl"
        open={confirm.value}
        onClose={confirm.onFalse}
        content={
          <CompanyNewEditForm
            currentCompany={row}
            onSucess={() => {
              getData();
              confirm.onFalse();
            }}
          />
        }
      />
    </>
  );
}

CompanyTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
