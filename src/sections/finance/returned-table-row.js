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
import { formatMoney, formatStringDate } from 'src/utils/formatter';
import LoadingButton from '@mui/lab/LoadingButton';
import { useCallback, useMemo, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';
import Typography from '@mui/material/Typography';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Divider } from '@mui/material';
import { getLoanInfoByLoanCode, confirmAccountStatement } from 'src/api/finance';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

export default function ReturnedTableRow({
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
  onAddNone,
  onNoteList,
  onDetail,
  getData,
}) {
  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { user, login } = useAuthContext();

  const [isConfirming, setIsConfirming] = useState(false)
  const [isLoadingSearchBtn, setIsLoadingSearchBtn] = useState(false)

  const [isLoadingConfirmBtn, setIsLoadingConfirmBtn] = useState(false)

  const popover = usePopover();

  const [checkedOnlyMinusRemainder, setCheckedOnlyMinusRemainder] = useState(false)

  const StatementSchema = Yup.object().shape({
    statementId: Yup.number(),
    dataId: Yup.number(),
    journalNo: Yup.string().required("Журнал бөглөнө үү!"),
    account: Yup.string().required("Данс бөглөнө үү!"),
    amount: Yup.number().required("Дүн бөглөнө үү!"),
    date: Yup.string().required("Гүйлгээний огноо бөглөнө үү!"),
    transactionValue: Yup.string().required("Гүйлгээний утга бөглөнө үү!"),
    rdInput: Yup.string().required("Регистр бөглөнө үү!"),
    loanNum: Yup.string().required("Зээлийн дугаар бөглөнө үү!"),

    name: Yup.string().required("Овог нэр бөглөнө үү!"),
    phone: Yup.string().required("Утас бөглөнө үү!"),
    rd: Yup.string().required("Регистр бөглөнө үү!"),
    loadedLoanNum: Yup.string().required("Зээлийн дугаар бөглөнө үү!"),
    extendAmount: Yup.string().required("Сунгах дүн бөглөнө үү!"),
    closeAmount: Yup.string().required("Хаах дүн бөглөнө үү!"),
    // onlyMinusRemainder: Yup.boolean(),
    desc: Yup.string(), //.required("Тайлбар бөглөнө үү!"),
    password: Yup.string().required("Нууц үг бөглөнө үү!"),
  });

  const defaultValues = useMemo(
    () => ({
      journalNo: "",
      account: "",
      amount: "",
      date: "",
      rdInput: "",
      loanNum: "",

      name: "",
      phone: "",
      rd: "",
      loadedLoanNum: "",
      extendAmount: "",
      closeAmount: "",
      // onlyMinusRemainder: false,
      desc: "",
      password: "",
      zeelId: ""
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(StatementSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    trigger,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (formFrontData) => {

  });

  const onSearchByLoanCode = async () => {
    try {
      if (values.rdInput === "") {
        enqueueSnackbar("Регистрын дугаар оруулна уу!", { variant: 'error' })
        return;
      }
      if (values.loanNum === "") {
        enqueueSnackbar("Зээлийн дугаар оруулна уу!", { variant: 'error' })
        return;
      }
      setIsLoadingSearchBtn(true)
      const { success, msg, data } = await getLoanInfoByLoanCode({ zeel_code: values.loanNum, dataid: values.journalNo, txndate: values.date, regno: values.rdInput }, login);
      if (!success) {
        logout();
        router.push(paths.auth.jwt.login);
      }
      console.log("data", data);
      if (data.zeelamounts.length > 0) {
        setValue("statementId", data.zeelamounts[0].id);
        setValue("dataId", data.zeelamounts[0].dataId);
        setValue("name", data.zeelamounts[0].fname);
        setValue("phone", data.zeelamounts[0].phone);
        setValue("rd", data.zeelamounts[0].rd);
        setValue("loadedLoanNum", values.loanNum);
        setValue("extendAmount", data.zeelamounts[0].expAmt);
        setValue("closeAmount", data.zeelamounts[0].closeAmt);
        setValue("zeelId", data.zeelamounts[0].zeelid);
      } else {
        enqueueSnackbar("Зээл хаах болон сунгах дүн олдсонгүй.", { variant: 'error' })
      }
      setIsLoadingSearchBtn(false)
    } catch (error) {
      setIsLoadingSearchBtn(false)
    }
  }

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
            }}
          >
            {row.statementId ?? ""}
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
            {row?.cdate} {row?.ctime}
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
            {row?.info ?? ""}
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
            {row?.typename ?? ""}
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
      </TableRow >

      {/* Харилцагч дэлгэрэнгүй */}
      <ConfirmDialog
        open={confirm.value}
        maxWidth="xl"
        onClose={() => {
          confirm.onFalse();
          reset();
          setIsLoadingSearchBtn(false)
        }}
        title="Гүйлгээ холбох"
        cancelText={"Хаах"}
        action={
          <LoadingButton loading={isLoadingConfirmBtn} variant="contained" color="primary" onClick={async () => {
            const isValid = await methods.trigger();
            if (isValid) {
              var body = {
                "statementid": values.journalNo,
                "acc": values.account,
                "statement_amt": parseInt(values.amount),
                "statement_date": values.date,
                "statement_info": values.transactionValue,
                "dataid": values.dataId,
                "zeelid": parseInt(values.zeelId),
                // "zeelid": values.loanNum.toString(),
                "closeamt": parseInt(values.closeAmount),
                "expamt": parseInt(values.extendAmount),
                "note": values.desc,
                "admin_pass": values.password,
                "admin_username": user.username,
                "isonly": checkedOnlyMinusRemainder ? "Y" : "N"
              }
              console.log("body", body);
              try {
                setIsLoadingConfirmBtn(true)
                const { success, msg, data } = await confirmAccountStatement(body, login);
                console.log(success, msg, data)
                if (!success) {
                  if (msg === "Дахин нэвтэрнэ үү!") {
                    logout();
                    router.push(paths.auth.jwt.login);
                  } else {
                    enqueueSnackbar(msg, { variant: 'error' })
                  }
                } else {
                  enqueueSnackbar(msg)
                  confirm.onFalse();
                  getData();
                }
                console.log("data", data);
                setIsLoadingConfirmBtn(false)
              } catch (error) {
                setIsLoadingConfirmBtn(false)
              }
            }
          }}>
            {"Баталгаажуулах"}
          </LoadingButton>
        }
        content={
          <Box sx={{ width: '100%', height: '80vh' }}>
            <Box sx={{ height: "20px" }} />
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Stack direction="row" spacing={5} >
                <Stack direction="column" spacing={2} flexGrow={1}>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Журнал №:</Typography>
                    <RHFTextField disabled name="journalNo" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Данс:</Typography>
                    <RHFTextField disabled name="account" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Дүн:</Typography>
                    <RHFTextField disabled name="amount" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Гүйлгээний огноо:</Typography>
                    <RHFTextField disabled name="date" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Гүйлгээний утга:</Typography>
                    <RHFTextField disabled multiline name="transactionValue" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Регистр:</Typography>
                    <RHFTextField name="rdInput" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Зээлийн дугаар:</Typography>
                    <Stack sx={{ width: '60%' }} spacing={3} direction="row" justifyContent={"space-between"}>
                      <RHFTextField name="loanNum" label="" sx={{ width: '80%' }} />
                      <LoadingButton
                        loading={isLoadingSearchBtn}
                        sx={{ marginTop: '10px' }}
                        variant="contained"
                        size='small'
                        color='secondary'
                        onClick={onSearchByLoanCode}
                      >
                        Хайх
                      </LoadingButton>
                    </Stack>
                  </Stack>
                </Stack>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderWidth: '1',
                    borderColor: 'black',
                  }}
                />
                <Stack direction="column" spacing={2} flexGrow={1}>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Овог нэр:</Typography>
                    <RHFTextField disabled name="name" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Утас:</Typography>
                    <RHFTextField disabled name="phone" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Регистр:</Typography>
                    <RHFTextField disabled name="rd" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Зээлийн дугаар:</Typography>
                    <RHFTextField disabled name="loadedLoanNum" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Сунгах дүн:</Typography>
                    <RHFTextField disabled name="extendAmount" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Хаах дүн:</Typography>
                    <RHFTextField disabled name="closeAmount" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent={"start"}>
                    <Checkbox
                      value={checkedOnlyMinusRemainder}
                      size="small"
                      onClick={() => { setCheckedOnlyMinusRemainder(!checkedOnlyMinusRemainder) }}
                    />
                    <Typography
                      onClick={() => { setCheckedOnlyMinusRemainder(!checkedOnlyMinusRemainder) }}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          cursor: 'pointer',
                        }
                      }}
                      whiteSpace={'nowrap'}
                      variant="subtitle2">
                      Зөвхөн үлдэгдэл хасах
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Тайлбар:</Typography>
                    <RHFTextField name="desc" label="" sx={{ width: '60%' }} />
                  </Stack>
                  <Stack direction="row" spacing={10} alignItems="center" justifyContent={"space-between"}>
                    <Typography sx={{ width: '30%' }} whiteSpace={'nowrap'} variant="subtitle2">Нууц үг:</Typography>
                    <RHFTextField type={"password"} name="password" label="" sx={{ width: '60%' }} />
                  </Stack>
                </Stack>
              </Stack>
            </FormProvider>
            <Box sx={{ height: "20px" }} />
          </Box >
        }
      />
    </>
  );
}

ReturnedTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
