import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { useForm, Controller, useFormContext } from 'react-hook-form';
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
} from 'src/components/hook-form';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAuthContext } from 'src/auth/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
import { getBankList, getProductList, addNewUser, editNewUser } from 'src/api/user';
import { formatDateToString } from 'src/utils/formatter';
import { MESSAGES } from 'src/const/msg';
import { getCollateralTypes, addCollateral } from 'src/api/collateral';
import { getUserList } from 'src/api/dashboard';
import StatementTableToolbar from '../statement/statement-table-toolbar';
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
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import isEqual from 'lodash/isEqual';
import { getStatementList } from 'src/api/finance';
import StatementTableRow from '../statement/statement-table-row';
import { useSettingsContext } from 'src/components/settings';
import Container from '@mui/material/Container';


const TABLE_HEAD = [
  { id: '', label: '' },
  { id: 'Журнал №', label: 'Журнал №', width: '10px' },
  { id: 'Гүйлгээ орсон данс', label: 'Гүйлгээ орсон данс' },
  { id: 'Данс', label: 'Данс', },
  { id: 'Дүн', label: 'Дүн', },
  { id: 'Гүйлгээний утга', label: 'Гүйлгээний утга', },
  { id: 'Регистр', label: 'Регистр', },
  { id: 'Утас', label: 'Утас' },
  { id: 'Нэр', label: 'Нэр' },
  { id: 'Огноо', label: 'Огноо' },
  { id: 'Төлөв', label: 'Төлөв' },
];

// ----------------------------------------------------------------------

const defaultFilters = {
  begindate: new Date(new Date().setDate(new Date().getDate() - 3)),
  enddate: new Date(),
};

export default function LoanCloseForm({ currentUser, isDetail, id }) {
  const router = useRouter();

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 50
  });

  const denseHeight = table.dense ? 60 : 80;

  const [filters, setFilters] = useState(defaultFilters);
  const [reLoadData, setReloadData] = useState(false);
  const [statuses, setStatuses] = useState(['Бүгд', 'Баталгаажсан', 'Баталгаажаагүй']);
  const [selectedStatus, setSelectedStatus] = useState(statuses[0])
  const [total, setTotal] = useState(0);


  const handleFilters = useCallback(
    (name, value) => {
      // table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );


  const mdUp = useResponsive('up', 'md');
  const { user, logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();
  const [managers, setManagers] = useState(user?.username ? [user?.username] : []);
  const settings = useSettingsContext();

  const [sex, setSex] = useState([{ id: "1", name: "Эрэгтэй" }, { id: "0", name: "Эмэгтэй" }])
  const [objects, setObjects] = useState([{ id: 1, name: "Өөрийнх" }, { id: 0, name: "Түрээсийнх" }])
  const [married, setMarried] = useState([{ id: 1, name: "Тийм" }, { id: 0, name: "Үгүй" }])
  const [status, setStatus] = useState([{ id: 1, name: "Идэвхтэй" }, { id: 0, name: "Идэвхгүй" }])
  const [types, setTypes] = useState([])
  const [banks, setBanks] = useState([])
  const [loanRights, setLoanRights] = useState([])
  const [isLoading, setIsLoading] = useState([])
  const [tableData, setTableData] = useState([]);

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!tableData.length && canReset) || !tableData.length;


  const [identityImages, setIdentityImages] = useState((currentUser?.identityimg !== "" && currentUser?.identityimg !== null) ? currentUser?.identityimg.split(';') : [])
  const [contractImages, setContractImages] = useState((currentUser?.contractimg !== "" && currentUser?.contractimg !== null) ? currentUser?.contractimg.split(';') : [])


  const [removedIdentityImages, setRemovedIdentityImages] = useState([])
  const [removedContractImages, setRemovedContractImages] = useState([])

  const NewProductSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required("Барьцаа хөрөнгийн нэр бөглөнө үү!"),
    type: Yup.number().required("Барьцаа хөрөнгийн төрөл сонгоно уу!"),
    status: Yup.number().required("Төлөв сонгоно уу!"),
    rate: Yup.string().required("Үнэлгээ бөглөнө үү!"),
    rd: Yup.string().required("Харилцагчийн РД бөглөнө үү!"),
    username: Yup.string().required("Харилцагчийн нэр бөглөнө үү!"),
    addition: Yup.string().required("Нэмэлт бөглөнө үү!"),
    image: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id ?? "",
      name: currentUser?.name ?? "",
      type: currentUser?.type ?? null,
      status: currentUser?.status ?? status[0].id,
      rate: currentUser?.rate ?? "",
      rd: currentUser?.rd ?? "",
      username: currentUser?.username ?? "",
      addition: currentUser?.addition ?? "",
      image: [],
    }),
    [currentUser]
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
    control,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const clearFilter = () => {
    setFilters(defaultFilters);
    setReloadData(!reLoadData);
    setSelectedStatus(null)
    methods.setValue("status", statuses[0])
  }


  async function getData() {
    setIsLoading(true)
    const { success, data } = await getStatementList({ begindate: formatDateToString(filters.begindate), enddate: formatDateToString(filters.enddate), pagenumber: table.page + 1, pagesize: table.rowsPerPage, StatusName: selectedStatus === "Бүгд" ? null : selectedStatus });
    console.log("res bn ->", data)

    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data)
    if (Array.isArray(data.datalist)) {
      data.datalist = data.datalist.filter(item => item.id !== undefined); // Ensure `id` exists
      data.datalist.sort((a, b) => String(a.id).localeCompare(String(b.id)));
      setTableData(data.datalist);
    } else {
      console.error('data.datalist is not an array or is improperly structured.');
    }
    setTotal(data.totaldataqty)
    methods.setValue("status", statuses[0])
    setSelectedStatus(statuses[0])
    setIsLoading(false)
  }

  useEffect(() => {
    if (methods.watch("status") !== null && methods.watch("status") !== undefined) {
      const selectedData = methods.watch("status")
      const data = statuses.find(item => item === selectedData)
      console.log("asdasd", data);
      setSelectedStatus(data)
    }
  }, [methods.watch("status")])

  useEffect(() => {
    getData();
  }, [reLoadData, table.rowsPerPage, table.page]);


  useEffect(() => {
    if (banks.length > 0) {
      console.log("currentUser", currentUser);

      if (currentUser !== null && currentUser !== undefined && currentUser?.bankCode !== null) {
        setValue('selectedBank', currentUser.bankCode);
      }
      else {
        setValue('selectedBank', banks[0].code);
      }

    }
  }, [banks]);

  useEffect(() => {
    if (types.length > 0) {
      if (currentUser !== null && currentUser !== undefined && currentUser?.typeId !== null) {
        setValue('type', currentUser.typeId);
      } else {
        setValue('type', types[0].id);
      }

    }
  }, [types]);

  console.log("currentUser", currentUser);



  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const onSubmit = handleSubmit(async (formFrontData) => {
    try {
      const formdata = new FormData();
      let bodyData = {
        "Name": formFrontData.name,
        "CollateraltypeId": formFrontData.type,
        "status": formFrontData.status,
        "RateAmt": formFrontData.rate,
        "dataid": userData?.id,
        "Addit": formFrontData?.addition,
      };
      if (currentUser !== null && currentUser !== undefined) {
        bodyData.id = currentUser.id;
      }
      for (const key in bodyData) {
        if (bodyData[key] !== undefined && bodyData[key] !== null) {
          formdata.append(key, bodyData[key]);
        }
      }
      if (formFrontData.image.length > 0) {
        for (let index = 0; index < formFrontData.image.length; index++) {
          const element = formFrontData.image[index];
          formdata.append("imgs", element)
        }
      }
      // if (formFrontData.contractImage.length > 0) {
      //   for (let index = 0; index < formFrontData.contractImage.length; index++) {
      //     const element = formFrontData.contractImage[index];
      //     formdata.append("contractfiles", element)
      //   }
      // }

      // console.log("identityfiles --> ", formFrontData.identityCardImage);
      // console.log("contractfiles ---> ", formFrontData.contractImage);
      console.log("formdata ----> ", formdata);


      const { success, msg, data } = await addCollateral(formdata)
      console.log("success, data", success, data);

      if (!success) {
        if (msg === "Дахин нэвтэрнэ үү!") {
          enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
          logout()
          router.push(paths.auth.jwt.login);
          return;
        } else {
          enqueueSnackbar(msg, { variant: 'error' })
          return;
        }
      }
      enqueueSnackbar(msg)
    } catch (error) {
      console.error(error);
      if ((error?.errors?.imgs?.length > 0 && error?.errors?.imgs[0])) {
        if (error?.errors?.imgs?.length > 0 && error?.errors?.imgs[0]) {
          enqueueSnackbar(error.errors.imgs[0], { variant: 'error' })
          return;
        }
      }
    }
  });

  const handlIdentityDrop = useCallback(
    (acceptedFiles) => {
      const files = values.image || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('image', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.image]
  );

  const handleIdentityRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.image && values.image?.filter((file) => file !== inputFile);
      setValue('image', filtered);
    },
    [setValue, values.image]
  );

  const handleIdentityRemoveUrl = useCallback(
    (url) => {
      setIdentityImages((prevImages) =>
        prevImages.filter((image) => image !== url)
      );
      setRemovedIdentityImages((prevRemovedImages) => [...prevRemovedImages, url]);
    },
    [setIdentityImages]
  );

  // const handleIdentityRemoveAllFiles = useCallback(() => {
  //   setValue('identityCardImage', []);
  // }, [setValue]);


  const handleIdentityRemoveAllFiles = useCallback(() => {
    // setIdentityImages((prevImages) => {
    //   setRemovedIdentityImages((prevRemovedImages) => [
    //     ...prevRemovedImages,
    //     ...prevImages
    //   ]);

    //   return [];
    // });

    setValue('image', []);
  }, [setIdentityImages, setRemovedIdentityImages, setValue]);


  const handleContractDrop = useCallback(
    (acceptedFiles) => {
      const files = values.contractImage || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('contractImage', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.contractImage]
  );

  const handleContractRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.contractImage && values.contractImage?.filter((file) => file !== inputFile);
      setValue('contractImage', filtered);
    },
    [setValue, values.contractImage]
  );

  const handleContractRemoveUrl = useCallback(
    (url) => {
      setContractImages((prevImages) =>
        prevImages.filter((image) => image !== url)
      );
      setRemovedContractImages((prevRemovedImages) => [...prevRemovedImages, url]);
    },
    [setContractImages]
  );

  // const handleContractRemoveAllFiles = useCallback(() => {
  //   setValue('contractImage', []);
  // }, [setValue]);

  const handleContractRemoveAllFiles = useCallback(() => {
    setContractImages((prevImages) => {
      setRemovedContractImages((prevRemovedImages) => [
        ...prevRemovedImages,
        ...prevImages
      ]);

      return [];
    });

    setValue('contractImage', []);
  }, [setContractImages, setRemovedContractImages, setValue]);


  const [userData, setUserData] = useState(null)

  const onChangeRd = async (rd) => {
    console.log("rd", rd);
    const { success, data } = await getUserList({ regno: values.rd, pageno: 1, pagesize: 1 });
    console.log("res bn ->", data)

    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data)
    if (data.datalist.length > 0) {
      setUserData(data.datalist[0])
    }
  }

  useEffect(() => {
    console.log("userData", userData);
    setValue("username", userData?.fname)
  }, [userData])

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      onChangeRd(values.rd);
    } else {
      isMounted.current = true;
    }
  }, [values.rd]);

  const loginInfoDetails = (
    <>
      <Grid xs={12} md={12}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            > */}

            <Stack direction={'row'} spacing={5} sx={{ width: '100%' }}>
              <Stack direction={'column'} spacing={3} sx={{ flex: 1 }}>
                <RHFTextField name="closedUser" label="Зээл хаасан ажилтан" />
                <RHFTextField name="amount" label="Дүн" />
                <RHFTextField name="date" label="Гүйлгээний огноо" />
                <RHFTextField name="phone" label="Утас" />
                <RHFTextField name="zeelId" label="Зээлийн дугаар" />
                <RHFTextField name="closeAmount" label="Хаах дүн" />
              </Stack>
              <Stack direction={'column'} spacing={3} sx={{ flex: 1 }}>
                <RHFTextField
                  name="description"
                  label="Тайлбар"
                  multiline
                  rows={4}
                  sx={{ flex: 1 }}
                />
                <RHFTextField name="name" label="Овог нэр" />
                <RHFTextField name="rd" label="Регистр" />
                <RHFTextField name="extendAmount" label="Сунгах дүн" />
                <RHFTextField name="extendAmount" label="Сунгах дүн" />

              </Stack>

            </Stack>
          </Stack>
          <StatementTableToolbar
            filters={filters}
            onFilters={handleFilters}
            clearFilter={clearFilter}
            reLoadData={reLoadData}
            setReloadData={() => {
              setReloadData(!reLoadData)
              table.onResetPage();
            }}
            statuses={statuses}
            selectedStatus={selectedStatus}
          //
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                  {isLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData
                        .map((row, index) => (
                          <StatementTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected2.includes(row)}
                            onSelectRow={() => table.onOneSelectRow(row)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            page={table.page}
                            rowsPerPage={table.rowsPerPage}
                            index={index}
                            onSelectLoanHistory={() => router.push(paths.dashboard.user.loanHistory(row.id))}
                            handleOnEdit={() => router.push(paths.dashboard.user.edit(row.id))}
                            onAddNone={() => {
                              setNoteId(row.id)
                              confirm.onTrue();
                            }}
                            onNoteList={() => {
                              getNoteList(row.id)
                              noteList.onTrue()
                            }}
                            onDetail={() => {
                              getUserDetail(row.id)
                              detailPage.onTrue();
                            }}
                            getData={getData}
                            isShowAction={false}
                          />
                        ))}
                    </>
                  )}

                  {isLoading ? <></> : <TableNoData notFound={notFound} />}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {'Хадгалах'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {loginInfoDetails}

        {isDetail != true ? renderActions : <></>}
      </Grid>
    </FormProvider>
  );
}

LoanCloseForm.propTypes = {
  currentUser: PropTypes.object,
};
