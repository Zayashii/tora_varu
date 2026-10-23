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
import { getCollateralTypes, addCollateral, getCollaterals } from 'src/api/collateral';
import { getUserList } from 'src/api/dashboard';
import { Checkbox, RadioGroup } from '@mui/material';
import { addLoanManually } from 'src/api/loan';

// ----------------------------------------------------------------------

export default function LoanCreateManuallyForm({ currentUser, isDetail }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');
  const { user, logout, login } = useAuthContext();

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

  const [products, setProducts] = useState([])
  const [collaterals, setCollaterals] = useState([])


  const [identityImages, setIdentityImages] = useState((currentUser?.identityimg !== "" && currentUser?.identityimg !== null) ? currentUser?.identityimg.split(';') : [])
  const [contractImages, setContractImages] = useState((currentUser?.contractimg !== "" && currentUser?.contractimg !== null) ? currentUser?.contractimg.split(';') : [])


  const [removedIdentityImages, setRemovedIdentityImages] = useState([])
  const [removedContractImages, setRemovedContractImages] = useState([])

  async function getData() {
    try {
      setIsLoading(true)
      const { success2, msg2, data2 } = await getProductList({}, login);

      if (!success2) {
        if (msg2 === "Дахин нэвтэрнэ үү!") {
          enqueueSnackbar(msg2, { variant: 'error' })
          logout()
          router.push(paths.auth.jwt.login);
          return;
        }
        else {
          enqueueSnackbar(msg2, { variant: 'error' })
          return;
        }
      }
      console.log("data bn 3 ->", data2)
      const activeProducts = data2.filter(item => item.status === 1)
      setProducts(activeProducts)

      const { success, msg, data } = await getCollaterals({}, login);
      setCollaterals(data)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }

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
    rd: Yup.string().required("Харилцагчийн РД бөглөнө үү!"),
    lastname: Yup.string().required("Харилцагчийн овог бөглөнө үү!"),
    firstname: Yup.string().required("Харилцагчийн нэр бөглөнө үү!"),
    product: Yup.number().required("Бүтээгдэхүүн сонгоно уу!"),
    product_price: Yup.number().required("Бүтээгдэхүүний дүн бөглөнө үү!"),
    loan_price: Yup.number().required("Зээлийн дүн бөглөнө үү!"),
    useCollateral: Yup.boolean(),
    collateral: Yup.number().nullable(),
    loan_duration: Yup.number().required("Зээлийн хугацаа сонгоно уу!"),
  });

  const defaultValues = useMemo(
    () => ({
      rd: "",
      lastname: "",
      firstname: "",
      product: null,
      product_price: null,
      loan_price: null,
      useCollateral: false,
      collateral: null,
      loan_duration: null,
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
        "dataid": userData?.id,
        "productid": formFrontData.product,
        "days": formFrontData.loan_duration,
        "loanamount": formFrontData.loan_price,
        "collateralid": formFrontData.useCollateral ? formFrontData.collateral : null,
      };

      console.log("bodyData", bodyData);

      console.log("formFrontData", formFrontData);

      const { success, msg, data } = await addLoanManually(bodyData)

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

      // if (currentUser !== null && currentUser !== undefined) {
      //   bodyData.id = currentUser.id;
      // }
      // for (const key in bodyData) {
      //   if (bodyData[key] !== undefined && bodyData[key] !== null) {
      //     formdata.append(key, bodyData[key]);
      //   }
      // }
      // if (formFrontData.image.length > 0) {
      //   for (let index = 0; index < formFrontData.image.length; index++) {
      //     const element = formFrontData.image[index];
      //     formdata.append("imgs", element)
      //   }
      // }
      // if (formFrontData.contractImage.length > 0) {
      //   for (let index = 0; index < formFrontData.contractImage.length; index++) {
      //     const element = formFrontData.contractImage[index];
      //     formdata.append("contractfiles", element)
      //   }
      // }

      // console.log("identityfiles --> ", formFrontData.identityCardImage);
      // console.log("contractfiles ---> ", formFrontData.contractImage);
      // console.log("formdata ----> ", formdata);



      // console.log("success, data", success, data);

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
    if (rd === "" || rd === null || rd === undefined) return;
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
      setValue("lastname", data.datalist[0]?.lname)
      setValue("firstname", data.datalist[0]?.fname)
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

  useEffect(() => {
    let currentProduct = products.find(item => item.id === values.product)
    setValue("product_price", currentProduct?.amount)
  }, [values.product])

  useEffect(() => {
    if (!values.collateral) {
      setValue('collateral_rate', '');
      return;
    }

    const selectedCollateral = collaterals.find(
      (item) => String(item.id) === String(values.collateral)
    );

    if (selectedCollateral) {
      setValue('collateral_rate', selectedCollateral.rateAmt ?? '');
    } else {
      setValue('collateral_rate', '');
    }
  }, [values.collateral, collaterals, setValue]);


  const loginInfoDetails = (
    <>

      <Grid xs={12} md={12}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }} flexDirection={"row"}>
            <Stack
              columnGap={2}
              rowGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(1, 1fr)',
              }}

              width={"100%"}
            >

              <RHFTextField name="rd" label="Харилцагчийн РД" /> {/*  disabled={isDetail} /> */}

              <RHFTextField name="lastname" label="" disabled helperText={"Харилцагчийн овог"} />

              <RHFTextField name="firstname" label="" disabled helperText={"Харилцагчийн нэр"} />

              <div style={{ height: '80px' }} />

              <RHFSelect
                fullWidth
                name="product"
                label="Бүтээгдэхүүн"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {products.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="product_price" helperText="Бүтээгдэхүүний дүн" disabled />

              <RHFTextField name="loan_price" label="Зээлийн дүн" />

            </Stack>

            <Stack
              columnGap={3}
              rowGap={3}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(1, 1fr)',
              }}
              width={"100%"}
            >

              <Stack direction={'column'} sx={{ display: "flex", alignItems: "start" }} spacing={1}>
                <Typography sx={{ paddingRight: '30px' }} variant="subtitle2">Барьцаа хөрөнгө ашиглах эсэх</Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <Checkbox name="useCollateral" label="Хүү алданги зогсоох" checked={watch("useCollateral")} onChange={(event) => { setValue("useCollateral", event.target.checked) }} />
                </RadioGroup>
              </Stack>

              <RHFSelect
                fullWidth
                name="collateral"
                label="Барьцаа хөрөнгө"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                disabled={!watch("useCollateral")}
              >
                {collaterals.map((col) => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="collateral_rate" helperText="Барьцаа хөрөнгийн үнэлгээ" disabled />

              <RHFSelect
                fullWidth
                name="loan_duration"
                label="Зээлийн хугацаа"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[7, 14, 30].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </RHFSelect>

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
          {!currentUser ? 'Үүсгэх' : 'Хадгалах'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {loginInfoDetails}

        {/* {userInfo} */}

        {isDetail != true ? renderActions : <></>}
      </Grid>
    </FormProvider>
  );
}

LoanCreateManuallyForm.propTypes = {
  currentUser: PropTypes.object,
};
