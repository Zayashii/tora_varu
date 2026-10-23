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
import TextField from '@mui/material';
import { Form } from 'react-hook-form';

import FormProvider, {
  RHFEditor,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import Textfield from '../_examples/mui/textfield-view/textfield';
import { color } from 'framer-motion';
import { width } from '@mui/system';
// ----------------------------------------------------------------------

export default function QuestionAndAnswerTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow, page, rowsPerPage, index, onDone, onCancelEdit, updateQuestion, updateAnswer, addNewAnswer, removeAnswer }) {
  // const { items, status, orderNumber, createdAt, customer, totalQuantity, subTotal } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const NewJobSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
  });
  const defaultValues = useMemo(
    () => ({
      title: '',
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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
    } catch (error) {
      console.error(error);
    }
  });

  const inputStyle = {
    width: '100%',
    padding: '12px 20px',
    margin: '8px 0',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };


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

      <TableCell>
        {row.isEditing ?
          <div>
            <input
              value={row?.question}
              type="text"
              style={inputStyle}
              onChange={(e) => {
                console.log("asd  --> ", e.target.value);
                updateQuestion(e.target.value, row.id)
              }}
            />
          </div>
          :
          <Box
            onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {row?.question ?? ""}
          </Box>
        }
      </TableCell>

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
          {row?.firstDate ?? ""}
        </Box>
      </TableCell>

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
          {row?.lastDate ?? ""}
        </Box>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={() => {
            console.log(collapse.value);
            if (collapse.value) {
              onCancelEdit();
            }
            collapse.onToggle();
          }}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        {row.isEditing && <IconButton color={popover.open ? 'inherit' : 'default'} onClick={onDone}>
          <Iconify icon="eva:checkmark-circle-2-fill" />
        </IconButton>}

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
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
              {/* <TableHead>
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
              </TableHead> */}
              {row.answers.map((item, idx) => {
                return <>
                  <Stack
                    key={item.id}
                    direction="row"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {row.isEditing ?
                      <TableCell align="center" sx={{ width: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <input
                            value={item.answer}
                            type="text"
                            style={inputStyle}
                            onChange={(e) => {
                              console.log("asd  --> ", e.target.value);
                              updateAnswer(e.target.value, row.id, item.id)
                            }}
                          />
                          <Iconify onClick={() => { removeAnswer(row.id, idx) }} icon="eva:minus-circle-fill" width={25} sx={{
                            marginLeft: '10px',
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }} />
                        </div>
                      </TableCell>
                      :
                      < TableCell align="center" sx={{ width: "100%" }}>
                        {item.answer}
                      </TableCell>
                    }
                  </Stack >
                </>;
              }
              )}
              {row.isEditing && <Box sx={{ padding: '10px', alignSelf: "center" }}>
                <Iconify onClick={() => addNewAnswer(row.id)} icon="eva:plus-circle-fill" width={30} sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }} />
              </Box>
              }
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
            onViewRow();
            popover.onClose();
            collapse.onTrue();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Засах
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Устгах
        </MenuItem>

      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Устгах"
        content="Асуултыг устгахдаа итгэлтэй байна уу?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Устгах
          </Button>
        }
      />
    </>
  );
}
