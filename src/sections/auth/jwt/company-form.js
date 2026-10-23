'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // or 'next/router' if using older Next.js

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { PATH_AFTER_LOGIN } from 'src/config-global';
import FormProvider, {
    RHFTextField,
    RHFRadioGroup,
} from 'src/components/hook-form';
import { registerCompany } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';


const RegisterCompanySchema = Yup.object().shape({
    name: Yup.string().required('Компанийн нэр оруулна уу.'),
    companyRd: Yup.string().required('Компанийн РД оруулна уу.'),
    email: Yup.string().required('И-мэйл хаяг оруулна уу.').email('И-мэйл хаяг зөв оруулна уу.'),
    phone: Yup.string().required('Утасны дугаар оруулна уу.'),
});

const defaultValues = {
    name: '',
    companyRd: '',
    email: '',
    phone: '',
};

export default function CompanyForm() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState('');
    const { logout, login } = useAuthContext();

    const methods = useForm({
        resolver: yupResolver(RegisterCompanySchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (formData) => {
        try {
            let body = {
                "regno": formData.companyRd,
                "name": formData.name,
                "status": 1,
                "phone": formData.phone,
                "email": formData.email,
                "usecorporate": "N"
            }
            const { success, msg, data } = await registerCompany(body, login)
            if (!success) {
                if (msg === "Дахин нэвтэрнэ үү!") {
                    enqueueSnackbar(msg, { variant: 'error' })
                    logout()
                    router.push(paths.auth.jwt.login);
                    return;
                }
                else {
                    enqueueSnackbar(msg, { variant: 'error' })
                    return;
                }
            }
            enqueueSnackbar(msg)
            router.push(paths.auth.jwt.login);
        } catch (error) {
            console.error(error);
            setErrorMsg(typeof error === 'string' ? error : error.message);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
                {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <RHFTextField name="name" label="Компанийн нэр" />
                    <RHFTextField name="companyRd" label="Компанийн РД" />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <RHFTextField
                        name="email"
                        label="И-Мэйл хаяг"
                        helperText="Таны бүртгүүлсэн И-мэйл уруу системын нууц үг сэргээх мэдээлэл илгээх тул үнэн зөв бөглөнө үү?"
                    />
                    <RHFTextField
                        name="phone"
                        label="Гар утасны дугаар"
                        helperText="Таны бүртгүүлсэн утасны дугаар луу системд нэвтрэх нэр, нууц үг илгээгдэх тул үнэн зөв бөглөнө үү?"
                    />
                </Stack>

                <LoadingButton
                    fullWidth
                    color="inherit"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                >
                    Бүртгүүлэх
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}
