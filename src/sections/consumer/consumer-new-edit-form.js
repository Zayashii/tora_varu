import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
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
} from 'src/components/hook-form';
import { addNewProduct } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import RHFRadioGroup from 'src/components/hook-form';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';


// ----------------------------------------------------------------------

export default function ConsumerNewEditForm({ currentProduct, onSucess }) {
  const router = useRouter();
  const { logout } = useAuthContext();

  console.log("currentProduct", currentProduct?.freeMonth)

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Бүтээгдэхүүний нэр бөглөнө үү!"),
    maxAmt: Yup.number().required("Дээд дүн бөглөнө үү!"),
    amount: Yup.number().required("Эхлэх дүн бөглөнө үү!"),
    minAmt: Yup.number().required("Доод дүн бөглөнө үү!"),
    rate: Yup.number().required("Хүү бөглөнө үү!"),
    month: Yup.number().required("Хугацаа бөглөнө үү!"),
    freeMonth: Yup.number().nullable(),
    status: Yup.boolean(),
    countextend: Yup.number().required("Сунгалтын тоо бөглөнө үү!"),
    extendtaxp: Yup.number().required("Сунгалтын шимтгэл бөглөнө үү!"),
    testes: Yup.array().min(2, 'Must have at least 2 services'),
  });

  const defaultValues = useMemo(
    //     "name": formData.name,
    //     "amount": formData.amount,
    //     "maxAmt": formData.maxAmt,
    //     "minAmt": formData.minAmt,
    //     "rate": formData.rate,
    //     "month": formData.month,
    //     "status": formData.status ? 1 : 0,
    //     "countextend": formData.countextend,
    //     "extendtaxp": formData.extendtaxp,
    () => ({
      name: currentProduct?.name || null,
      maxAmt: currentProduct?.maxAmt || null,
      amount: currentProduct?.amount || null,
      minAmt: currentProduct?.maxAmt || null,
      rate: currentProduct?.rate || null,
      month: currentProduct?.month || null,
      freeMonth: currentProduct?.freeMonth !== null ? currentProduct?.freeMonth : null,
      status: (currentProduct?.status === 1 ? true : false) || false,
      countextend: currentProduct?.countextend || null,
      extendtaxp: currentProduct?.extendtaxp || null,

      // name: currentProduct?.name || '',
      // description: currentProduct?.description || '',
      // subDescription: currentProduct?.subDescription || '',
      // images: currentProduct?.images || [],
      // //
      // code: currentProduct?.code || '',
      // sku: currentProduct?.sku || '',
      // price: currentProduct?.price || 0,
      // quantity: currentProduct?.quantity || 0,
      // priceSale: currentProduct?.priceSale || 0,
      // tags: currentProduct?.tags || [],
      // taxes: currentProduct?.taxes || 0,
      // gender: currentProduct?.gender || '',
      // category: currentProduct?.category || '',
      // colors: currentProduct?.colors || [],
      // sizes: currentProduct?.sizes || [],
      // newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      // saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
    }),
    [currentProduct]
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
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);


  const onSubmit = handleSubmit(async (formData) => {
    try {
      let bodyData = {
        "name": formData.name,
        "amount": formData.amount,
        "maxAmt": formData.maxAmt,
        "minAmt": formData.minAmt,
        "rate": formData.rate,
        "month": formData.month,
        "status": formData.status ? 1 : 0,
        "countextend": formData.countextend,
        "extendtaxp": formData.extendtaxp,
      }
      if (currentProduct !== null) {
        bodyData.id = currentProduct.id;
      }
      const { success, data } = await addNewProduct(bodyData);
      if (success) {
        enqueueSnackbar(data)
        if (currentProduct !== null && currentProduct !== undefined) {
          onSucess()
        }
        else {
          router.push(paths.product.root);
        }
      } else {
        if (data === "Дахин нэвтэрнэ үү!") {
          logout();
          router.push(paths.auth.jwt.login);
        }
        enqueueSnackbar(data ?? MESSAGES.API_DEFAULT_ERROR, { variant: 'error' })
      }
      console.info('DATA', formData);
      console.info('bodyData', bodyData);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
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
            <Stack direction={'row'} sx={{ display: "flex", alignItems: "center" }} spacing={1}>
              <Typography sx={{ paddingRight: '30px' }} variant="subtitle2">Experience</Typography>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="state"
              >
                <FormControlLabel value="Y" control={<Radio />} label="Идэвхитэй" />
                <FormControlLabel value="N" control={<Radio />} label="Хаагдсан" />
              </RadioGroup>
            </Stack>


            <RHFTextField name="name" label="Нэр" />

            <RHFTextField name="email" label="И-мэйл" />

            <RHFTextField name="password" label="Нэвтрэх код" />

            <RHFTextField name="phone" label="Утас" />
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
          {!currentProduct ? 'Үүсгэх' : 'Хадгалах'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {userPermissions}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ConsumerNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
  onSucess: PropTypes.func,
};
