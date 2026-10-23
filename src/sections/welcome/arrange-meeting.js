// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _mock } from 'src/_mock';
// components
import { MotionViewport, varFade } from 'src/components/animate';
import { COLORS, HEADER } from 'src/layouts/config-layout';
import Logo from 'src/components/logo';
import { useRef, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Link, Alert } from '@mui/material'; // Added Alert for error message
import FormProvider, {
  RHFTextField,
  RHFRadioGroup,
} from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

// Placeholder for registerCompany function - Assuming it's defined elsewhere
const registerCompany = async (body, login) => {
  console.log("Submitting form data:", body);
  // Simulate API call success/failure
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (body.email === 'error@test.mn') {
      return { success: false, msg: "Системд бүртгэх үед алдаа гарлаа." };
  }
  
  return { success: true, msg: "Уулзалт товлох хүсэлтийг амжилттай илгээлээ." };
};


const RegisterCompanySchema = Yup.object().shape({
  name: Yup.string().required('Уулзалт товлох хүний нэр оруулна уу.'),
  companyRd: Yup.string().required('Мэдээлэл оруулна уу.'),
  email: Yup.string().required('И-мэйл хаяг оруулна уу.').email('И-мэйл хаяг зөв оруулна уу.'),
  phone: Yup.string().required('Утасны дугаар оруулна уу.'),
});

const defaultValues = {
  name: '',
  companyRd: '',
  email: '',
  phone: '',
};


export default function ArrangeMeeting({ introRef }) {
  const mdUp = useResponsive('up', 'md');
  const smUp = useResponsive('up', 'sm');
  const lgUp = useResponsive('up', 'lg');

  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);
  const router = useRouter();
  const [selector, setSelector] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  // NOTE: Assuming useAuthContext, registerCompany are available or mocked
  const { logout, login } = { 
      logout: () => console.log('logged out'), 
      login: (u, p) => console.log('logged in'),
      user: null
  }; 

  const methods = useForm({
    resolver: yupResolver(RegisterCompanySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { enqueueSnackbar } = { enqueueSnackbar: (msg, options) => console.log(msg, options) }; // Mock useSnackbar

  const onSubmit = async (formData) => {
    try {
      setErrorMsg(''); // Clear previous errors
      const body = {
        "regno": formData.companyRd,
        "name": formData.name,
        "status": 1,
        "phone": formData.phone,
        "email": formData.email,
        "usecorporate": selector === 0 ? "Y" : "N"
      }
      const { success, msg, data } = await registerCompany(body, login);
      
      if (!success) {
        if (msg === "Дахин нэвтэрнэ үү!") {
          enqueueSnackbar(msg, { variant: 'error' })
          logout()
          // router.push(paths.auth.jwt.login); // Commented out routing for runnable demo
          return;
        }
        else {
          enqueueSnackbar(msg, { variant: 'error' })
          setErrorMsg(msg);
          return;
        }
      }
      enqueueSnackbar(msg)
      reset(); // Reset form on success
      // router.push(paths.auth.jwt.login); // Commented out routing for runnable demo
    } catch (error) {
      console.error(error);
      const message = typeof error === 'string' ? error : error.message;
      setErrorMsg(message || 'Үл мэдэгдэх алдаа гарлаа.');
    }
  };

  useEffect(() => {
    if (textRef.current) {
      console.log("zxc ===========> ", textRef.current.offsetWidth)
      setTextWidth(textRef.current.offsetWidth); // Get the width of the content
    }
  }, []);

  const handleSelect = (index) => {
    setSelector(index);
  }

  return (
    <div
      ref={introRef}
      style={{
        width: '100%',
        minHeight: lgUp ? '100vh' : 'auto',
        display: 'flex',
        alignItems: lgUp ? 'center' : 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#E4F4F1', // light background color
        position: 'relative',
        padding: lgUp ? '140px 32px 160px' : mdUp ? '120px 24px 140px' : '88px 16px 120px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          backgroundColor: 'white',
          padding: lgUp ? '72px' : mdUp ? '56px 48px' : '36px 22px',
          margin: 0,
          border: '2px solid black',
          boxShadow: '4px 4px 0px #FFBA38',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: lgUp ? 'row' : 'column', // Stack sooner to avoid cramped medium widths
            gap: lgUp ? '64px' : '32px', // Spacing between the text and form columns
          }}
        >

          {/* Left Column: Title and Description */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: lgUp ? 1 : 'none', // Allow flex 1 on desktop, none on mobile
              maxWidth: lgUp ? '520px' : '100%',
            }}
          >
            <div style={{ width: '130px', padding: '5px 15px', backgroundColor: COLORS.Orange, borderRadius: 25, textAlign: 'center' }}>
              <p style={{ color: 'white', fontSize: '14px', textAlign: 'center', margin: 0 }}>Бидний амжилт</p>
            </div>

            <div style={{ height: '18px' }} />

            <p
              style={{
                color: 'black',
                fontSize: lgUp ? '46px' : mdUp ? '36px' : '30px', // Smaller font size on mobile
                fontWeight: 'bold',
                lineHeight: 1.25,
                margin: 0
              }}>
              Бидний уулзалт таны бизнест шинэ эхлэл авч ирнэ гэдэгт итгэлтэй байна.
            </p>

            <div style={{ height: '8px' }} />

            <p
              style={{
                color: '#6B7280',
                fontSize: lgUp ? '18px' : mdUp ? '16px' : '15px', // Slightly smaller text on mobile
                fontWeight: 'lighter',
                lineHeight: 1.65,
                margin: 0
              }}>
              Та тодорхой мэдээллээ өгвөл бид үнэ төлбөр уулзалт хийж хүссэн мэдээлээр өгөхөд бэлэн байна.
            </p>
          </div>

          {/* Right Column: Selector and Form */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: lgUp ? 1 : 'none',
              marginTop: lgUp ? 0 : '16px', // Additional spacing between text and form columns on mobile
            }}
          >

            {/* Selector: Bayguulaga / Huvi Hun */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: lgUp ? 'flex-start' : 'center', // Center selector on mobile
                gap: lgUp ? '24px' : '12px',
                flexWrap: 'wrap',
              }}
            >
              {/* Item 1: Байгууллага */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginRight: lgUp ? '20px' : 0,
                }}
                onClick={() => { handleSelect(0) }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.Green2,
                    marginRight: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selector === 0 ? <Logo imageSrc='/icons/correct.svg' size={18} disabledLink sx={{}} /> : <></>}
                </div>

                <p
                  style={{
                    color: COLORS.Primary,
                    fontSize: '20px',
                    fontWeight: selector === 0 ? 'bold' : 'lighter',
                    margin: 0,
                  }}
                >
                  Байгууллага
                </p>
              </div>

              {/* Item 2: Хувь хүн */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginLeft: lgUp ? '20px' : 0, // Reduced spacing
                }}
                onClick={() => { handleSelect(1) }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.Green2,
                    marginRight: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selector === 1 ? <Logo imageSrc='/icons/correct.svg' size={18} disabledLink sx={{}} /> : <></>}
                </div>

                <p
                  style={{
                    color: COLORS.Primary,
                    fontSize: '20px',
                    fontWeight: selector === 1 ? 'bold' : 'lighter',
                    margin: 0,
                  }}
                >
                  Хувь хүн
                </p>
              </div>
            </div>


            <div style={{ height: '30px' }} />

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5}>
                {!!errorMsg && (
                    <Box sx={{ p: 2, bgcolor: '#fee2e2', color: '#991b1b', borderRadius: 1 }}>
                        <p style={{ margin: 0, fontSize: '14px' }}>Алдаа: {errorMsg}</p>
                    </Box>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <RHFTextField name="name" label="Уулзалт товлох хүний нэр" />
                  <RHFTextField 
                    name="companyRd" 
                    label={selector === 0 ? "Компанийн РД" : "Хувь хүний РД"} 
                    helperText={"Бизнесийн тухай товч мэдээлэл. Уулзалт хийх сэдэвийн агуулга."} 
                  />
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
                    helperText="Таны бүртгүүлсэн мэдээллээр бид холбогдох болно."
                  />
                </Stack>

                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                  rel="noopener"
                  sx={{
                    backgroundColor: COLORS.ButtonColor,
                    color: 'black',
                    alignSelf: lgUp ? 'flex-start' : 'stretch',
                    width: lgUp ? 'auto' : '100%', // Full width button on mobile
                    height: '40px',
                    borderRadius: '0px',
                    border: '2px solid black',
                    fontSize: '13px',
                    fontWeight: 300,
                    marginTop: '20px',
                    '&:hover': {
                      backgroundColor: COLORS.ButtonColor,
                      opacity: 0.5,
                      boxShadow: '4px 4px 0 black',
                    },
                    boxShadow: '4px 4px 0 black',
                    '&:active': { boxShadow: '4px 4px 0 black', },
                  }}
                >
                  Илгээх
                </LoadingButton>
              </Stack>
            </FormProvider>
          </div>
        </div>
      </div>
      
      {/* Decorative Boxes (hidden on mobile) */}
      <Box sx={{
        position: 'absolute',
        top: '13%',
        left: '12%',
        display: { xs: 'none', md: 'block' },
      }}>
        <Box
          component="img"
          src={"/icons/develop.svg"}
          sx={{
            width: '100%',
            cursor: 'pointer',
            objectFit: 'fill',
          }}
        />
      </Box>

      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        display: { xs: 'none', md: 'block' },
      }}>
        <Box
          component="img"
          src={"/icons/test.svg"}
          sx={{
            width: '100%',
            cursor: 'pointer',
            objectFit: 'fill',
          }}
        />
      </Box>
    </div>
  );
}
