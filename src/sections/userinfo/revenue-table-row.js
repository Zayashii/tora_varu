import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import { TableHead } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function RevenueTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow, page, rowsPerPage, index }) {
  // const { items, status, orderNumber, createdAt, customer, totalQuantity, subTotal } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>

      <TableCell>
        <Box
          onClick={onViewRow}
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

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={row.latinName}
          secondary={row.email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
          sx={{
            pb: "2px"
          }}
        />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 1 && 'success') || (row.status === 0 && 'error') ||
            'default'
          }
        >
          {(row.status === 1 && 'Active') || (row.status === 0 && 'Disabled') || row.status}
        </Label>
        <br />
        {row.lastLogin != null && row.lastLogin.split(" ").length > 0 ? row.lastLogin.split(" ")[1] : ""}
      </TableCell>

      {/* <TableCell align="center"> {12} </TableCell> */}

      {/* <TableCell> {fCurrency(12)} </TableCell> */}

      {/* <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'completed' && 'success') ||
            (status === 'pending' && 'warning') ||
            (status === 'cancelled' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell> */}

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton> */}
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <>
      <TableRow>
        <TableCell sx={{ p: 0, border: 'none' }} colSpan={12}>
          <Collapse
            in={collapse.value}
            timeout="auto"
            unmountOnExit
            sx={{ bgcolor: 'background.neutral' }}
          >
            <Stack component={Paper} sx={{ m: 1.5 }}>
              <TableHead>
                <TableRow sx={{ display: "flex", justifyContent: "space-between" }}>
                  <TableCell align="center" sx={{ width: "100%" }}>
                    DATE
                  </TableCell>
                  <TableCell align="center" sx={{ width: "100%" }}>
                    PAYMENT STATUS
                  </TableCell>
                  <TableCell align="center" sx={{ width: "100%" }}>
                    AMOUNT
                  </TableCell>
                </TableRow>
              </TableHead>
              {row.loans.map((item) => {
                return <>
                  <Stack
                    key={item.id}
                    direction="row"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <TableCell align="center" sx={{ width: "100%" }}>
                      {item.endDate}
                    </TableCell>
                    <TableCell align="center" sx={{ width: "100%" }}>
                      <Label
                        variant="soft"
                        color={
                          (item.status === 10 ? 'success' : 'error')
                        }
                      >
                        {(item.status === 10 ? "Paid" : "UnPaid")}
                      </Label>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "100%" }}>
                      {item.status === 10 ? 0 : item.uldegdel}
                    </TableCell>
                  </Stack>
                </>;
              }
              )}
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

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

RevenueTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
