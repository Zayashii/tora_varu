import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
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


// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentUser, isDetail }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');
  const { user, logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();
  const [managers, setManagers] = useState(user?.username ? [user?.username] : []);

  const [sex, setSex] = useState([{ id: "1", name: "Эрэгтэй" }, { id: "0", name: "Эмэгтэй" }])
  const [objects, setObjects] = useState([{ id: 1, name: "Өөрийнх" }, { id: 0, name: "Түрээсийнх" }])
  const [married, setMarried] = useState([{ id: 1, name: "Тийм" }, { id: 0, name: "Үгүй" }])
  const [banks, setBanks] = useState([])
  const [loanRights, setLoanRights] = useState([])
  const [isLoading, setIsLoading] = useState([])


  const [identityImages, setIdentityImages] = useState((currentUser?.identityimg !== "" && currentUser?.identityimg !== null) ? currentUser?.identityimg.split(';') : [])
  const [contractImages, setContractImages] = useState((currentUser?.contractimg !== "" && currentUser?.contractimg !== null) ? currentUser?.contractimg.split(';') : [])


  const [removedIdentityImages, setRemovedIdentityImages] = useState([])
  const [removedContractImages, setRemovedContractImages] = useState([])

  async function getData() {
    setIsLoading(true)
    const { success, data } = await getBankList();
    if (!success) {
      logout();
      router.push(paths.auth.jwt.login);
    }
    setBanks(data)
    const { success2, data2 } = await getProductList();
    console.log("success2, data2", success2, data2);
    if (!success2) {
      logout();
      router.push(paths.auth.jwt.login);
    }
    setLoanRights(data2)
    setIsLoading(false)
  }

  useEffect(() => {
    getData();
  }, []);


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
    if (loanRights.length > 0) {
      if (currentUser !== null && currentUser !== undefined && currentUser?.productId !== null) {
        setValue('selectedProduct', currentUser.productId);
      } else {
        setValue('selectedProduct', loanRights[0].id);
      }

    }
  }, [loanRights]);

  console.log("currentUser", currentUser);

  const NewProductSchema = Yup.object().shape({
    manager: Yup.string().required(),
    username: Yup.string().required("Нэвтрэх нэр бөглөнө үү!"),
    password: Yup.string().required("Нууц бөглөнө үү!"),

    lastname: Yup.string().required("Эцэг /эх/-ийн нэр бөглөнө үү!"),
    firstname: Yup.string().required("Нэр бөглөнө үү!"),
    rd: Yup.string().required("Регистр бөглөнө үү!"),
    address: Yup.string().required("Амьдарч буй хаяг бөглөнө үү!"),
    email: Yup.string().required("Имэйл бөглөнө үү!"),
    phone: Yup.string().required("Утасны дугаар бөглөнө үү!"),
    relatedPerson: Yup.string().required("Яаралтай үед холбогдох хүн бөглөнө үү!"),
    connectPhone: Yup.string().required("Холбогдох бөглөнө үү!"),
    bankAccount: Yup.string().required("Данс бөглөнө үү!"),

    status: Yup.boolean(),
    birthdate: Yup.mixed().required("Төрсөн өдрөө бөглөнө үү!"),
    isMarried: Yup.number().required("Гэрлэсэн эсэх бөглөнө үү!"),
    selectedSex: Yup.string().required("Хүйс бөглөнө үү!"),
    selectedObject: Yup.string().required("Обектын эзэмшил бөглөнө үү!"),
    selectedBank: Yup.string().required("Банк бөглөнө үү!"),
    selectedProduct: Yup.number().required("Зээлийн эрх бөглөнө үү!"),

    facebook: Yup.string().nullable(),
    merchantInfo: Yup.string().required("Дэлгүүрийн мэдээлэл бөглөнө үү!"),
    orgName: Yup.string().required("Байгууллагын нэр"),
    orgRd: Yup.string().required("Байгууллагын регистр"),
    marchantName: Yup.string().required("Дэлгүүрийн нэр"),
    merchantAddress: Yup.string().required("Хаяг байршил"),
    description: Yup.string().required("Тайлбар бөглөнө үү!"),

    identityCardImage: Yup.array(),
    contractImage: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      manager: managers.length > 0 ? managers[0] : "",
      username: currentUser?.phoneLogin ?? "",
      password: currentUser?.pass || Math.floor(100000 + Math.random() * 900000),

      lastname: currentUser?.lname ?? "",
      firstname: currentUser?.fname ?? "",
      rd: currentUser?.rd ?? "",
      address: currentUser?.address ?? "",
      email: currentUser?.email ?? "",
      phone: currentUser?.phone ?? "",
      relatedPerson: currentUser?.familymember ?? "",
      connectPhone: currentUser?.familymemberPhone ?? "",
      bankAccount: currentUser?.acc ?? "",

      status: currentUser != null ? currentUser?.status === 1 : false,
      birthdate: (currentUser?.bdate !== null && currentUser?.bdate !== undefined) ? new Date(currentUser?.bdate) : null,
      isMarried: currentUser?.merred ?? married[1].id,
      selectedSex: currentUser?.gender ?? sex[0].id,
      selectedObject: currentUser?.isobject ?? objects[0].id,
      selectedBank: currentUser?.bankCode ?? '',
      selectedProduct: currentUser?.productId ?? null,

      facebook: currentUser?.social ?? null,
      merchantInfo: currentUser?.ajil ?? null,
      orgName: currentUser?.company ?? null,
      orgRd: currentUser?.companyreg ?? null,
      marchantName: currentUser?.shopname ?? null,
      merchantAddress: currentUser?.shopaddress ?? null,
      description: currentUser?.descr ?? null,

      identityCardImage: [],
      contractImage: [],
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

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const onSubmit = handleSubmit(async (formFrontData) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      const formdata = new FormData();
      let bodyData = {
        "fname": formFrontData.firstname,
        "lname": formFrontData.lastname,
        "rd": formFrontData.rd,
        "social": formFrontData.facebook,
        "bdate": formatDateToString(formFrontData.birthdate),
        "merred": formFrontData.isMarried,
        "company": formFrontData.orgName,
        "ajil": formFrontData.merchantInfo,
        "phone": formFrontData.phone,
        "phoneLogin": formFrontData.username,
        "email": formFrontData.email,
        "gender": formFrontData.selectedSex,
        "address": formFrontData.address,
        "productId": formFrontData.selectedProduct,
        "status": formFrontData.status ? 1 : 0,
        "companyreg": formFrontData.orgRd,
        "shopname": formFrontData.marchantName,
        "shopaddress": formFrontData.merchantAddress,
        "descr": formFrontData.description,
        "familymember": formFrontData.relatedPerson,
        "familymemberPhone": formFrontData.connectPhone,
        "isobject": formFrontData.selectedObject,
        "bankCode": formFrontData.selectedBank,
        "account": formFrontData.bankAccount,
        "pass": formFrontData.password
      };
      if (currentUser !== null && currentUser !== undefined) {
        bodyData.id = currentUser.id;
      }
      for (const key in bodyData) {
        if (bodyData[key] !== undefined && bodyData[key] !== null) {
          formdata.append(key, bodyData[key]);
        }
      }
      if (formFrontData.identityCardImage.length > 0) {
        for (let index = 0; index < formFrontData.identityCardImage.length; index++) {
          const element = formFrontData.identityCardImage[index];
          formdata.append("identityfiles", element)
        }
      }
      if (formFrontData.contractImage.length > 0) {
        for (let index = 0; index < formFrontData.contractImage.length; index++) {
          const element = formFrontData.contractImage[index];
          formdata.append("contractfiles", element)
        }
      }

      console.log("identityfiles --> ", formFrontData.identityCardImage);
      console.log("contractfiles ---> ", formFrontData.contractImage);
      console.log("formdata ----> ", formdata);


      const { success, data } = (currentUser !== null && currentUser !== undefined) ? await editNewUser(formdata) : await addNewUser(formdata)
      console.log("success, data", success, data);

      if (success) {
        enqueueSnackbar(data)
      } else {
        if (data === "Дахин нэвтэрнэ үү!") {
          logout();
          router.push(paths.auth.jwt.login);
        }
        enqueueSnackbar(data ?? MESSAGES.API_DEFAULT_ERROR, { variant: 'error' })
      }
      // reset();
      // enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      console.info('DATA', formData);
      console.info('bodyData', bodyData);
    } catch (error) {
      console.error(error);
      if ((error?.errors?.identityfiles?.length > 0 && error?.errors?.identityfiles[0]) || (error?.errors?.contractfiles?.length > 0 && error?.errors?.contractfiles[0])) {
        if (error?.errors?.identityfiles?.length > 0 && error?.errors?.identityfiles[0]) {
          enqueueSnackbar(error.errors.identityfiles[0], { variant: 'error' })
          return;
        }
        if (error?.errors?.contractfiles?.length > 0 && error?.errors?.contractfiles[0]) {
          enqueueSnackbar(error.errors.contractfiles[0], { variant: 'error' })
          return;
        }
      }
    }
  });

  const handlIdentityDrop = useCallback(
    (acceptedFiles) => {
      const files = values.identityCardImage || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('identityCardImage', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.identityCardImage]
  );

  const handleIdentityRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.identityCardImage && values.identityCardImage?.filter((file) => file !== inputFile);
      setValue('identityCardImage', filtered);
    },
    [setValue, values.identityCardImage]
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
    setIdentityImages((prevImages) => {
      setRemovedIdentityImages((prevRemovedImages) => [
        ...prevRemovedImages,
        ...prevImages
      ]);

      return [];
    });

    setValue('identityCardImage', []);
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




  const loginInfoDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Нэвтрэх эрхийн мэдээлэл
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
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >

              <RHFSelect
                disabled={isDetail}
                fullWidth
                name="manager"
                label="Харилцах менежер"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {managers.map((manager) => (
                  <MenuItem key={manager} value={manager}>
                    {manager}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="username" label="Нэвтрэх эрх" disabled={isDetail} />

              <RHFTextField name="password" label="Нууц үг" disabled />

              {/* <Stack spacing={1.5}>
                <Typography variant="subtitle2">Content</Typography>
                <RHFEditor simple name="description" />
              </Stack> */}

              <RHFSwitch name="status" label={"Төлөв"} sx={{ m: 0 }} disabled={isDetail} />
            </Box>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Иргэний үнэмлэхний зураг</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="identityCardImage"
                maxSize={3145728}
                onDrop={handlIdentityDrop}
                onRemove={handleIdentityRemoveFile}
                onRemoveUrl={handleIdentityRemoveUrl}
                onRemoveAll={handleIdentityRemoveAllFiles}
                disabled={isDetail}
                urls={identityImages}
              />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Гэрээний зураг</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="contractImage"
                maxSize={3145728}
                onDrop={handleContractDrop}
                onRemove={handleContractRemoveFile}
                onRemoveUrl={handleContractRemoveUrl}
                onRemoveAll={handleContractRemoveAllFiles}
                disabled={isDetail}
                urls={contractImages}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const userInfo = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Хэрэглэгчийн мэдээлэл
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="lastname" label="Эцэг /эх/-ийн нэр" disabled={isDetail} />

              <RHFTextField name="facebook" label="Facebook хаяг" disabled={isDetail} />

              <RHFTextField name="firstname" label="Нэр" disabled={isDetail} />

              <RHFTextField name="merchantInfo" label="Дэлгүүрийн мэдээлэл" disabled={isDetail} />

              <RHFTextField name="rd" label="Регистр" disabled={isDetail} />

              <RHFTextField name="orgName" label="Байгууллагын нэр" disabled={isDetail} />

              <RHFSelect
                disabled={isDetail}
                fullWidth
                name="selectedSex"
                label="Хүйс"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {sex.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField disabled={isDetail} name="orgRd" label="Байгууллагын регистр" onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 7);
              }} />


              <Controller
                name="birthdate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    disabled={isDetail}
                    {...field}
                    label="Төрсөн он сар"
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />

              <RHFTextField name="marchantName" label="Дэлгүүрийн нэр" disabled={isDetail} />

              <RHFTextField name="address" label="Амьдарч буй хаяг" disabled={isDetail} />

              <RHFSelect
                disabled={isDetail}
                fullWidth
                name="selectedObject"
                label="Обектын эзэмшил"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {objects.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="email" label="Имэйл хаяг" disabled={isDetail} />

              <RHFTextField name="merchantAddress" label="Хаяг байршил" disabled={isDetail} />

              <RHFTextField name="phone" label="Утасны дугаар" disabled={isDetail} />

              <RHFTextField name="description" label="Тайлбар" disabled={isDetail} />

              <RHFSelect
                disabled={isDetail}
                fullWidth
                name="isMarried"
                label="Гэрлэсэн эсэх"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {married.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                disabled={isDetail}
                fullWidth
                name="selectedBank"
                label="Банк"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {banks.map((bank) => (
                  <MenuItem key={bank.code} value={bank.code}>
                    {bank.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="relatedPerson" label="Яаралтай үед холбогдох" disabled={isDetail} />

              <RHFTextField name="bankAccount" label="Данс" disabled={isDetail} />

              <RHFTextField name="connectPhone" label="Холбогдох утас" disabled={isDetail} />

              <RHFSelect
                disabled={isDetail}
                fullWidth
                name="selectedProduct"
                label="Зээлийн эрх"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {loanRights.map((right) => (
                  <MenuItem key={right.id} value={right.id}>
                    {right.name + "-" + right.maxAmt}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentUser ? 'Үүсгэх' : 'Хадгалах'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {loginInfoDetails}

        {userInfo}

        {isDetail != true ? renderActions : <></>}
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
