'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CompanyNewEditForm from '../company-new-edit-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { getUserDataById } from 'src/api/user';
import { useState, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
//

// ----------------------------------------------------------------------

export default function CompanyEditView({ id }) {
  const settings = useSettingsContext();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuthContext();

  const [data, setData] = useState(null)

  useEffect(() => {
    console.log('consumer id ', id)
    setData(1)
    // getUserDataById({ dataid: id }).then((res) => {
      // console.log("res")
      // console.log(res)
      // if (!res.success) {
      //   enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      //   logout()
      //   router.push(paths.auth.jwt.login);
      //   return;
      // }
      // setData(res.data.datalist[0])
    // })
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Компани дэлгэрэнгүй"
        links={[
          {
            name: 'Компанийн жагсаалт',
            href: paths.dashboard.settings.companyList,
          },
          { name: 'Шинэ компани' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {data === null ? <LoadingScreen /> : <CompanyNewEditForm currentCompany={1} />}
    </Container>
  );
}
