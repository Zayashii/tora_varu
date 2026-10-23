'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import { COLORS } from 'src/layouts/config-layout';
import FormProvider, {
  RHFEditor,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import CompanyForm from './company-form';
import IndividualForm from './individual-form';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    userType: Yup.string().required('Төрөл сонгоно уу.'),
  });

  const defaultValues = {
    userType: 'company'
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const type = [
    { value: 'company', label: 'Байгууллага' },
    { value: 'individual', label: 'Хувь хүн' },
  ]

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Stack flexDirection={"column"}>
        <p
          style={{
            color: COLORS.Primary,
            fontWeight: 400,
            fontSize: '1.5rem',
            paddingBottom: 3,
            whiteSpace: "nowrap",
            textAlign: 'center'
          }}
        >
          “ХУРГАН ЗЭЭЛ” СИСТЕМД
        </p>

        <p
          style={{
            color: COLORS.Primary,
            fontWeight: 'bold',
            fontSize: '2.25rem',
            textAlign: 'center'
          }}
        >
          БҮРТГҮҮЛЭХ
        </p>
      </Stack>

      <Stack direction="row" spacing={0.5}>
        <Stack spacing={1}>
        </Stack>
      </Stack>
    </Stack>
  );

  const renderForm = (


    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <div style={{
            alignSelf: 'center',
          }}>
            <RHFRadioGroup row spacing={4} name="userType" options={type} />
          </div>
        </Stack>
      </FormProvider>

      {watch("userType") === "company" ? <CompanyForm /> : <IndividualForm />}
    </Stack>

  );

  return (
    <>
      {renderHead}

      {renderForm}
    </>
  );
}
