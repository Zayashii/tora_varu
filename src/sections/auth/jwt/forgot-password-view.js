'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// auth
// assets
import { PasswordIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { GetOTPPassword } from 'src/api/user';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const { logout } = useAuthContext();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const ForgotPasswordSchema = Yup.object().shape({
    phone: Yup.string().required('Утасны дугаар оруулна уу.').min(8, 'Утасны дугаар нь дор хаяж 8 оронтой байх ёстой'),
  });

  const defaultValues = {
    phone: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (formdata) => {
    try {

      const { success, msg, data } = await GetOTPPassword({ phone: formdata.phone })

      console.log(success, msg, data);


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


      const searchParams = new URLSearchParams({
        phone: formdata.phone,
      }).toString();

      const href = `${paths.auth.jwt.newPassword}?${searchParams}`;
      router.push(href);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="phone" label="Утасны дугаар" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Үргэлжлүүлэх
      </LoadingButton>

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
        Буцах
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Нууц үгээ мартсан</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Бүртгэлтэй холбоотой утасны дугаараа оруулна уу
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
