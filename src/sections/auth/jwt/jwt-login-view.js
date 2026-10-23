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
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { MESSAGES } from 'src/const/msg';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    phone: Yup.string().required('Утасны дугаар оруулна уу'),
    // phone: Yup.string().matches(/^\d+$/, 'Утасны дугаар зөвхөн тоо байх ёстой').length(8, 'Утасны дугаар нь 8 оронтой байх ёстой').required('Утасны дугаар оруулна уу'),
    password: Yup.string().required('Нууц үг оруулна уу'),
  });

  const defaultValues = {
    phone: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { isSuccess, responseMsg } = await login?.(data.phone, data.password);

      console.log("go to", returnTo || PATH_AFTER_LOGIN);
      if (isSuccess) {
        router.push(returnTo || PATH_AFTER_LOGIN);
      } else {
        setErrorMsg(responseMsg)
      }
    } catch (error) {
      console.error("onSubmit login -> ", error);
      // reset();
      setErrorMsg(typeof error === 'string' ? error : error.message ? MESSAGES.API_DEFAULT_ERROR : MESSAGES.API_DEFAULT_ERROR);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Хэрэглэгч нэвтрэх хэсэг</Typography>

      {/* <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack> */}
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="phone" label="И-Мэйл хаяг" />

      <RHFTextField
        name="password"
        label="Нууц үг"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link href={paths.auth.jwt.forgotPassword} variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Нууц үгээ мартсан?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Нэвтрэх
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderForm}
    </FormProvider>
  );
}
