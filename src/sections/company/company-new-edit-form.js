import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
  RHFRadioGroup
} from 'src/components/hook-form';
import { addNewProduct } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { addEditCompany, getCompanyName } from 'src/api/settings';
import { HOST_API } from 'src/config-global';
import TableContainer from '@mui/material/TableContainer';
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
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import CompanyInvoiceRow from './company-invoice-table-row';
import { getBankList } from 'src/api/loan';
import { MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'Нэхэмжлэл №' },
  { id: 'price', label: 'Үнэ', },
  { id: 'date', label: 'Илгээсэн огноо', },
  { id: 'status', label: 'Төлөв', },
  { id: 'paidDate', label: 'Төлсөн огноо', },
  { id: '', label: 'Нэхэмжлэл илгээх' },
];

const CompanyNewEditForm = forwardRef(({ currentCompany, isModal, setFormData }, ref) => {
  const router = useRouter();
  const { logout } = useAuthContext();

  console.log("currentCompany", currentCompany)

  const mdUp = useResponsive('up', 'md');

  const [tableLoading, setTableLoading] = useState(false)

  const [banks, setBanks] = useState([])

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 50
  });

  const [tableData, setTableData] = useState([]);

  const notFound = (!tableData.length) || !tableData.length;

  const { enqueueSnackbar } = useSnackbar();

  const statuses = [
    { value: 'active', label: 'Идэвхитэй' },
    { value: 'inactive', label: 'Идэвхигүй' },
  ]

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Компанийн нэр бөглөнө үү!"),
    rd: Yup.string()
      .max(6, "РД 6 оронтой тоо байх ёстой!")
      .matches(/^\d{6}$/, "РД 6 оронтой тоо байх ёстой!")
      .required("Компанийн регистрийн дугаар бөглөнө үү!"),
    bank: Yup.string().required("Банк сонгоно уу!"),
    account: Yup.string().required("Дансны дугаар бөглөнө үү!"),
    email: Yup.string().required("И-мэйл хаяг бөглөнө үү!"),
    social: Yup.string().required("Вэб хуудас болон сошил хаяг бөглөнө үү!"),
    phone1: Yup.string()
      .matches(/^\d{8}$/, "Утасны дугаар 8 оронтой тоо байх ёстой!")
      .required("Утасны дугаар бөглөнө үү!"),
    phone2: Yup.string()
      .matches(/^\d{8}$/, "Утасны дугаар 2 8 оронтой тоо байх ёстой!")
      .required("Утасны дугаар 2 бөглөнө үү!"),
    logo: Yup.mixed().nullable().required('Лого оруулна уу'),
    status: Yup.object(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCompany?.name || null,
      rd: currentCompany?.rd || null,
      bank: currentCompany?.bank || null,
      account: currentCompany?.account || null,
      email: currentCompany?.email || null,
      social: currentCompany?.social || null,
      phone1: currentCompany?.phone1 || null,
      phone2: currentCompany?.phone2 || null,
      logo: (currentCompany && currentCompany?.logo !== null && currentCompany?.logo !== "" && currentCompany?.logo !== undefined) ? `${HOST_API}${currentCompany?.logo}` : null,
      status: statuses[1],
    }),
    [currentCompany]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentCompany) {
      reset(defaultValues);
    }
  }, [currentCompany, defaultValues, reset]);

  useEffect(() => {
    getBankData()
  }, []);



  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('logo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('logo', null);
  }, [setValue]);


  const submitLogic = async (inputFormData) => {
    try {
      const formdata = new FormData();
      let bodyData = {
        name: inputFormData?.name,
        regno: inputFormData?.rd,
        status: 1,
        BankId: inputFormData?.bank,
        Account: inputFormData?.account,
        Email: inputFormData?.email,
        Weburl: inputFormData?.social,
        phone: inputFormData?.phone1,
        Phone2: inputFormData?.phone2,
        usecorporate: "N",
      };

      if (currentCompany) bodyData.id = currentCompany.id;

      for (const key in bodyData) {
        if (bodyData[key] != null) formdata.append(key, bodyData[key]);
      }

      if (typeof inputFormData.logo !== 'string') {
        formdata.append('img', inputFormData.logo);
      }

      // setFormData(formdata);  

      const { success, msg, data } = await addEditCompany(formdata);

      if (!success) {
        if (msg === "Дахин нэвтэрнэ үү!") {
          enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' });
          logout();
          router.push(paths.auth.jwt.login);
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
        }
      } else {
        enqueueSnackbar(msg);
      }

      return { success, msg, data };
    } catch (error) {
      console.error(error);
      return { success: false, msg: error.message };
    }
  };


  const onSubmit = handleSubmit(async (inputFormData) => {
    return await submitLogic(inputFormData);
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      let result;
      await handleSubmit(async (data) => {
        result = await submitLogic(data); // store result here
      })();
      return result; // this will now be returned to the parent
    },
  }));


  const getBankData = async () => {
    const { success, msg, data } = await getBankList();
    if (success) {
      setBanks(data.banklist)
    } else {
      if (data === "Дахин нэвтэрнэ үү!") {
        logout();
        router.push(paths.auth.jwt.login);
      }
      enqueueSnackbar(msg ?? MESSAGES.API_DEFAULT_ERROR, { variant: 'error' })
    }
  }

  const renderDetails = (
    <>
      {mdUp && !currentCompany && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Компанийн мэдээлэл
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={!currentCompany ? 8 : 12}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}


          <Stack spacing={3} sx={{ p: 3 }}>


            {currentCompany && <Stack spacing={1}>
              <Typography variant="subtitle2">Төлөв</Typography>
              <RHFRadioGroup row name="status" options={statuses} />
            </Stack>
            }

            <Stack direction={currentCompany ? 'row' : 'column'} spacing={2}>
              <RHFTextField name="name" label="Компанийн нэр" />
              <RHFTextField
                name="rd"
                label="Компанийн РД"
                inputProps={{
                  maxLength: 6,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }} />
            </Stack>

            <Stack direction={currentCompany ? 'row' : 'column'} spacing={2}>
              <RHFSelect
                fullWidth
                name="bank"
                label="Банк"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {banks.map((bank) => (
                  <MenuItem key={bank.id} value={bank.code}>
                    {bank.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="account" label="Дансны дугаар" />
            </Stack>

            <Stack direction={currentCompany ? 'row' : 'column'} spacing={2}>
              <RHFTextField name="email" label="И-мэйл хаяг" />

              <RHFTextField name="social" label="Вэб хуудас болон сошил хаяг" />
            </Stack>

            <Stack direction={currentCompany ? 'row' : 'column'} spacing={2}>
              <RHFTextField name="phone1" label="Утасны дугаар" />

              <RHFTextField name="phone2" label="Утасны дугаар 2" />
            </Stack>


            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Лого</Typography>
              <RHFUpload
                name="logo"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>


            {currentCompany && <RHFTextField name="note" label="Тэмдэглэгээ" multiline rows={3} />}

            {currentCompany && <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {tableLoading ? (
                      [...Array(table.rowsPerPage)].map((i, index) => (
                        <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      ))
                    ) : (
                      <>
                        {tableData
                          .map((row, index) => {
                            // row.sequence = table.page * table.rowsPerPage + index + 1;
                            return <CompanyInvoiceRow
                              key={row.id}
                              row={row}
                              selected={table.selected.includes(row.id)}
                              onSelectRow={() => table.onSelectRow(row.id)}
                              onDeleteRow={() => handleDeleteRow(row.id)}
                              onEditRow={() => handleEditRow(row.id)}
                              onViewRow={() => handleViewRow(row.id)}
                            />
                          })}
                      </>
                    )}

                    {tableLoading ? <></> : <TableNoData notFound={notFound} />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
            }
            {/* <RHFSwitch name="isUseCGW" label="CGW ашиглах эсэх" /> */}

            {/* <RHFTextField name="password" label="Нэвтрэх код" />

            <RHFTextField name="phone" label="Утас" /> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const userPermissions = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Програмын хандах эрхийн тохиргоо
          </Typography>
          {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Нэвтрэх эрхийн мэдээлэл
          </Typography> */}
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Нэр" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentCompany ? 'Үүсгэх' : 'Засах'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* {userPermissions} */}

        {!isModal && renderActions}
      </Grid>
    </FormProvider>
  );
})

CompanyNewEditForm.propTypes = {
  currentCompany: PropTypes.object,
  onSucess: PropTypes.func,
};

export default CompanyNewEditForm;