'use client';

import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useCountdownSeconds } from 'src/hooks/use-countdown';
// auth
import { useAuthContext } from 'src/auth/hooks';
// assets
import { SentIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFCode } from 'src/components/hook-form';
import { ChagnePassword, GetOTPPassword, ValidateOtp } from 'src/api/user';
import { useSnackbar } from 'src/components/snackbar';
import PasswordIcon from 'src/assets/icons/password-icon';

// ----------------------------------------------------------------------

export default function ChangePasswordView() {
  const { logout, login } = useAuthContext();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const VerifySchema = Yup.object().shape({
    password: Yup.string()
      .min(4, 'Нууц үг дор хаяж 4 тэмдэгтээс бүрдэх ёстой')
      .required('Нууц үг оруулна уу.'),
    confirmPassword: Yup.string()
      .required('Нууц үгээ баталгаажуулах шаардлагатай')
      .oneOf([Yup.ref('password')], 'Нууц үгнүүд таарч байх ёстой'),
  });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (formdata) => {
    try {
      // await newPassword?.(data.email, data.code, data.password);

      let body = {
        "pass": formdata.password
      }

      const { success, msg, data } = await ChagnePassword(body, login)

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
      } else {
        enqueueSnackbar(msg, { variant: 'success' })
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      const { success, msg, data } = await GetOTPPassword({ phone: phone })

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
      } else {
        enqueueSnackbar("Баталгаажуулах код амжилттай илгээгдлээ.", { variant: 'success' })
      }
    } catch (error) {
      console.error(error);
    }
  }, [startCountdown]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">

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

      <RHFTextField
        name="confirmPassword"
        label="Нууц үг давтах"
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Нууц үг солих
      </LoadingButton>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Нууц үгээ оруулна уу!</Typography>

        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Бид таны дугаар руу 6 оронтой баталгаажуулах код илгээсэн.
          <br />
          Нууц үгээ сэргээхийн тулд доорх нүдэнд кодыг оруулна уу.
        </Typography> */}
      </Stack>
    </>
  );

  return (
    <div style={{
      paddingLeft: '200px',
      paddingRight: '200px'
    }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}

        {renderForm}
      </FormProvider>
    </div>
  );
}
