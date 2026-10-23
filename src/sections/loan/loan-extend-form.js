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

// ----------------------------------------------------------------------

export default function LoanExtendForm({ currentUser, isDetail, id }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');
  const { user, logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();
  const [managers, setManagers] = useState(user?.username ? [user?.username] : []);

  const [sex, setSex] = useState([{ id: "1", name: "Эрэгтэй" }, { id: "0", name: "Эмэгтэй" }])
  const [objects, setObjects] = useState([{ id: 1, name: "Өөрийнх" }, { id: 0, name: "Түрээсийнх" }])
  const [married, setMarried] = useState([{ id: 1, name: "Тийм" }, { id: 0, name: "Үгүй" }])
  const [status, setStatus] = useState([{ id: 1, name: "Идэвхтэй" }, { id: 0, name: "Идэвхгүй" }])
  const [types, setTypes] = useState([])
  const [banks, setBanks] = useState([])
  const [loanRights, setLoanRights] = useState([])
  const [isLoading, setIsLoading] = useState([])


  const [identityImages, setIdentityImages] = useState((currentUser?.identityimg !== "" && currentUser?.identityimg !== null) ? currentUser?.identityimg.split(';') : [])
  const [contractImages, setContractImages] = useState((currentUser?.contractimg !== "" && currentUser?.contractimg !== null) ? currentUser?.contractimg.split(';') : [])


  const [removedIdentityImages, setRemovedIdentityImages] = useState([])
  const [removedContractImages, setRemovedContractImages] = useState([])

  async function getData() {
    setIsLoading(true)
    const { success, msg, data } = await getCollateralTypes();
    if (!success) {
      if (msg === "Дахин нэвтэрнэ үү!") {
        setIsLoading(false)
        enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
        logout()
        router.push(paths.auth.jwt.login);
        return;
      } else {
        enqueueSnackbar(msg, { variant: 'error' })
        setIsLoading(false)
        return;
      }
    }
    setTypes(data)
    console.log("setTypes", data);
    // const { success2, data2 } = await getProductList();
    // console.log("success2, data2", success2, data2);
    // if (!success2) {
    //   logout();
    //   router.push(paths.auth.jwt.login);
    // }
    // setLoanRights(data2)
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
    if (types.length > 0) {
      if (currentUser !== null && currentUser !== undefined && currentUser?.typeId !== null) {
        setValue('type', currentUser.typeId);
      } else {
        setValue('type', types[0].id);
      }

    }
  }, [types]);

  console.log("currentUser", currentUser);

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
                <RHFTextField name="extendedUser" label="Зээл сунгасан ажилтан" />
                <RHFTextField name="month" label="Сунгалт хийх сар" />
                <RHFTextField name="extendRate" label="Сунгалтын хүү" />
              </Stack>
              <RHFTextField
                name="description"
                label="Тайлбар"
                multiline
                rows={5}
                sx={{ flex: 1 }}
              />
            </Stack>
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

LoanExtendForm.propTypes = {
  currentUser: PropTypes.object,
};
