'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // or 'next/router' if using older Next.js
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import FormProvider, {
    RHFTextField,
} from 'src/components/hook-form';
import { registerIndividual } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';

const RD_DIGIT_LENGTH = 8;

const RegisterSchema = Yup.object().shape({
    lastname: Yup.string().required('Овог оруулна уу.'),
    firstname: Yup.string().required('Нэр оруулна уу.'),
    rd: Yup.string()
        .matches(new RegExp(`^[А-ЯЁӨҮ]{2}\\d{${RD_DIGIT_LENGTH}}$`, 'i'), `РД нь 2 үсэг, ${RD_DIGIT_LENGTH} цифртэй байх ёстой.`)
        .required('РД оруулна уу.'),
    email: Yup.string().required('И-мэйл хаяг оруулна уу.').email('И-мэйл хаяг зөв оруулна уу.'),
    phone: Yup.string().required('Утасны дугаар оруулна уу.'),
});

const defaultValues = {
    lastname: '',
    firstname: '',
    rd: '',
    email: '',
    phone: '',
};

const MONGOLIAN_LETTERS = [
    'А',
    'Б',
    'В',
    'Г',
    'Д',
    'Е',
    'Ё',
    'Ж',
    'З',
    'И',
    'Й',
    'К',
    'Л',
    'М',
    'Н',
    'О',
    'Ө',
    'П',
    'Р',
    'С',
    'Т',
    'У',
    'Ү',
    'Ф',
    'Х',
    'Ц',
    'Ч',
    'Ш',
    'Щ',
    'Ъ',
    'Ы',
    'Ь',
    'Э',
    'Ю',
    'Я',
];

function RdField({ name, label }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [letterIndex, setLetterIndex] = useState(0);
    const { control } = useFormContext();

    const handleClose = () => setAnchorEl(null);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const rawValue = field.value || '';
                const letters = rawValue.slice(0, 2).toUpperCase();
                const firstLetter = letters.charAt(0) || '';
                const secondLetter = letters.charAt(1) || '';
                const digits = rawValue.slice(2).replace(/\D/g, '').slice(0, RD_DIGIT_LENGTH);

                const handleDigitsChange = (event) => {
                    const numeric = event.target.value.replace(/\D/g, '').slice(0, RD_DIGIT_LENGTH);
                    field.onChange(`${firstLetter}${secondLetter}${numeric}`);
                };

                const handleLetterSelect = (letter) => {
                    const updatedLetters = letterIndex === 0 ? `${letter}${secondLetter}` : `${firstLetter}${letter}`;
                    field.onChange(`${updatedLetters}${digits}`);
                    handleClose();
                };

                const handleOpenPicker = (index, event) => {
                    setLetterIndex(index);
                    setAnchorEl(event.currentTarget);
                };

                return (
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            {label}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                            {[{ value: firstLetter, index: 0 }, { value: secondLetter, index: 1 }].map((item) => (
                                <Button
                                    key={item.index}
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => handleOpenPicker(item.index, event)}
                                    sx={{
                                        minWidth: 46,
                                        height: 46,
                                        borderRadius: 1.5,
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                    }}
                                >
                                    {item.value || '_'}
                                </Button>
                            ))}

                            <TextField
                                fullWidth
                                value={digits}
                                onChange={handleDigitsChange}
                                onBlur={field.onBlur}
                                placeholder={'0'.repeat(RD_DIGIT_LENGTH)}
                                inputProps={{
                                    maxLength: RD_DIGIT_LENGTH,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                error={!!error}
                            />
                        </Stack>

                        {error && <FormHelperText error>{error?.message}</FormHelperText>}

                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            <Box sx={{ p: 2, maxWidth: 340 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                    {letterIndex === 0 ? 'Эхний үсгийг сонгоно уу' : 'Дараагийн үсгийг сонгоно уу'}
                                </Typography>

                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1 }}>
                                    {MONGOLIAN_LETTERS.map((letter) => (
                                        <Button
                                            key={letter}
                                            variant="outlined"
                                            onClick={() => handleLetterSelect(letter)}
                                            sx={{ minWidth: 44, borderRadius: 1.25, fontWeight: 700 }}
                                        >
                                            {letter}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>
                        </Popover>
                    </Stack>
                );
            }}
        />
    );
}

export default function IndividualForm() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState('');
    const { logout, login } = useAuthContext();

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (formData) => {
        try {
            const body = {
                "email": formData.email,
                "regno": formData.rd,
                "fname": formData.firstname,
                "lname": formData.lastname,
                "status": 1,
                "phone": formData.phone,
                "isagree": true
            }
            const { success, msg } = await registerIndividual(body, login)
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
                    <RHFTextField name="lastname" label="Овог" />
                    <RdField name="rd" label="РД" />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row', }} spacing={2} >
                    <RHFTextField name="firstname" label="Нэр" sx={{ width: "48%" }} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <RHFTextField
                        name="email"
                        label="И-Мэйл хаяг"
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
