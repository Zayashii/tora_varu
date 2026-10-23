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
import { GetOTPPassword, ValidateOtp } from 'src/api/user';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function NewPasswordView() {
  const { logout, login } = useAuthContext();

  const router = useRouter();

  const searchParams = useSearchParams();

  const phone = searchParams.get('phone');

  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const VerifySchema = Yup.object().shape({
    code: Yup.string().min(6, 'Код дор хаяж 6 оронтой байх ёстой').required('Код оруулна уу.'),
    phone: Yup.string().required('Утасны дугаар оруулна уу.').min(8, 'Утасны дугаар нь дор хаяж 8 оронтой байх ёстой'),
    password: Yup.string()
      .min(4, 'Нууц үг дор хаяж 4 тэмдэгтээс бүрдэх ёстой')
      .required('Нууц үг оруулна уу.'),
    confirmPassword: Yup.string()
      .required('Нууц үгээ баталгаажуулах шаардлагатай')
      .oneOf([Yup.ref('password')], 'Нууц үгнүүд таарч байх ёстой'),
  });

  const defaultValues = {
    code: '',
    phone: phone || '',
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
        "otp": formdata.code,
        "phone": formdata.phone,
        "newpass": formdata.password
      }

      const { success, msg, data } = await ValidateOtp(body, login)

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

      router.push(paths.auth.jwt.login);
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
        name="phone"
        label="Утасны дугаар"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled
      />

      <RHFCode name="code" />

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

      <Typography variant="body2">
        {`Код ирээгүй юу? `}
        <Link
          variant="subtitle2"
          onClick={handleResendCode}
          sx={{
            cursor: 'pointer',
            ...(counting && {
              color: 'text.disabled',
              pointerEvents: 'none',
            }),
          }}
        >
          Кодыг дахин илгээх {counting && `(${countdown}s)`}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Нэвтрэх рүү буцах
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Хүсэлтийг амжилттай илгээлээ!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Бид таны дугаар руу 6 оронтой баталгаажуулах код илгээсэн.
          <br />
          Нууц үгээ сэргээхийн тулд доорх нүдэнд кодыг оруулна уу.
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
