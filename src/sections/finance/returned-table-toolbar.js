import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ReturnedTableToolbar({
  filters,
  onFilters,
  clearFilter,
  reLoadData,
  setReloadData,
  statuses,
  selectedStatus,
}) {
  const popover = usePopover();

  const handleFilterBeginDate = useCallback(
    (event) => {
      onFilters('begindate', event);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (event) => {
      onFilters('enddate', event);
    },
    [onFilters]
  );


  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <DatePicker
            label="Эхлэх огноо"
            value={filters.begindate}
            onChange={handleFilterBeginDate}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
            sx={{
              maxWidth: { md: 300 },
            }}
          />

          <DatePicker
            label="Дуусах огноо"
            value={filters.enddate}
            onChange={handleFilterEndDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{
              maxWidth: { md: 300 },
            }}
          />


          {/* <RHFSelect
            fullWidth
            value={selectedStatus}
            name="status"
            label="Төлөв"
            sx={{
              maxWidth: { md: 300 },
            }}
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </RHFSelect> */}

          <Button
            variant="contained"
            onClick={() => {
              setReloadData(!reLoadData)
            }}
          >
            Хайх
          </Button>
          <Button
            variant="text"
            onClick={() => {
              clearFilter();
            }}
          >
            Цэвэрлэх
          </Button>
          <div style={{ width: "1px" }}></div>

          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

ReturnedTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  clearFilter: PropTypes.func,
  reLoadData: PropTypes.object,
  setReloadData: PropTypes.func
};
