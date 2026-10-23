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
import Iconify from 'src/components/iconify';
import { updateQuestionAnswers } from 'src/api/settings';


// ----------------------------------------------------------------------

export default function FAQNewEditForm() {
    const router = useRouter();
    const { logout } = useAuthContext();

    const mdUp = useResponsive('up', 'md');

    const { enqueueSnackbar } = useSnackbar();

    const [answers, setAnswers] = useState([""])

    const [isLoading, setIsLoading] = useState(false)

    const addAnswer = () => {
        setAnswers([...answers, ""]);
    }

    const handleChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const removeAnswer = (index) => {
        const updatedAnswers = [...answers];
        console.log("before", updatedAnswers);
        updatedAnswers.splice(index, 1)
        console.log("after", updatedAnswers);
        setAnswers(updatedAnswers);
    }


    const NewProductSchema = Yup.object().shape({
        question: Yup.string(),
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
            question: null,

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
        []
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
            const { success, data } = await addNewProduct(bodyData);
            if (success) {
                enqueueSnackbar(data)
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

    const saveNewQuestion = async () => {
        try {
            console.log("gg ->", values.question)
            if (values.question === "" || values.question === undefined || values.question === null) {
                enqueueSnackbar("Асуулт оруулна уу!", { variant: 'error' })
                return
            }
            const cleanedAnswers = answers.filter((answer) => answer.trim() !== "");
            if (cleanedAnswers.length === 0) {
                enqueueSnackbar("Хариулт оруулна уу!", { variant: 'error' })
                return
            }
            var body = {};
            body.questions = {
                question: values.question
            }
            let objectAnswer = []
            cleanedAnswers.map((el) => {
                objectAnswer.push({
                    answer: el
                })
            })
            body.answers = objectAnswer
            setIsLoading(true)
            const { success, msg, data } = await updateQuestionAnswers(body);
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
                enqueueSnackbar(msg)
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    const renderDetails = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Асуулт
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
                        <RHFTextField name="question" label="Асуулт" multiline rows={5} />
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
                        Хариултууд
                    </Typography>
                    {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Нэвтрэх эрхийн мэдээлэл
          </Typography> */}
                </Grid>
            )}
            <Grid xs={12} md={8}>
                <Card>
                    {!mdUp && <CardHeader title="Details" />}

                    {answers.map((answer, index) => {
                        return <Stack key={index} spacing={3} sx={{ p: 3 }}>
                            <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <RHFTextField
                                    value={answer}
                                    name={"answer"}
                                    label=""
                                    onChange={(e) => handleChange(index, e.target.value)}
                                />
                                <Iconify onClick={() => { removeAnswer(index) }} icon="eva:minus-circle-fill" width={25} sx={{
                                    marginLeft: '10px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }} />
                            </Stack>
                        </Stack>
                    })}
                    <Box sx={{ padding: '20px', justifySelf: "center" }}>
                        <Iconify
                            onClick={addAnswer}
                            icon="eva:plus-circle-fill"
                            width={30}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        />
                    </Box>
                </Card>
            </Grid>
        </>
    );

    const renderActions = (
        <>
            {mdUp && <Grid md={4} />}
            <Grid xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                <LoadingButton onClick={saveNewQuestion} variant="contained" size="large" loading={isLoading}>
                    {'Үүсгэх'}
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

FAQNewEditForm.propTypes = {
};
