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
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
import { useForm } from 'react-hook-form';
// ----------------------------------------------------------------------

export default function ScheduledTableRow({
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

  const InvoiceSchema = Yup.object().shape({
    username: Yup.string().required('Хэрэглэгчийн нэр бөглөнө үү'),
    rd: Yup.string().required('Хувь хүний РД бөглөнө үү'),
    email: Yup.string().required('И-мэйл хаяг бөглөнө үү').email('И-мэйл хаяг зөв оруулна уу'),
  });

  const defaultValues = {
    username: row?.rowname || '',
    rd: row?.rd || '',
    email: row?.email || '',
  };

  const methods = useForm({
    resolver: yupResolver(InvoiceSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
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
              display: "flex",
              justifyContent: "center",
            }}
          >
            {row?.email ?? ""}
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
            {row?.username ?? ""}
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


        <TableCell align="center">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow >

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 240 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Засах
        </MenuItem>

      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="МСЖ тохируулах"
        cancelText={'Хаах'}
        content={
          <>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Stack direction={'row'} sx={{ display: "flex", alignItems: "center" }} spacing={1}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="state"
                >
                  <FormControlLabel value="Y" control={<Radio />} label="Идэвхитэй" />
                  <FormControlLabel value="N" control={<Radio />} label="Зогсоох" />
                </RadioGroup>
              </Stack>
              <div style={{ height: '20px' }} />
              <RHFTextField name="username" type={"password"} label="Нууц үг" />
            </FormProvider>
          </>
        }
        action={
          <Button variant="contained" color="primary" onClick={onDeleteRow}>
            Хадгалах
          </Button>
        }
      />
    </>
  );
}

ScheduledTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
