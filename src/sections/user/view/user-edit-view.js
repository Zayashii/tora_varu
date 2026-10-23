'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserNewEditForm from '../user-new-edit-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { getUserDataById } from 'src/api/user';
import { useState, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function UserEditView({ id }) {
  const settings = useSettingsContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuthContext();

  const [data, setData] = useState(null)

  useEffect(() => {
    console.log('consumer id ', id)
    getUserDataById({ dataid: id }).then((res) => {
      console.log("res")
      console.log(res)
      if (!res.success) {
        enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
        logout()
        router.push(paths.auth.jwt.login);
        return;
      }
      setData(res.data.datalist[0])
    })
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Хэрэглэгч засах"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Харилцагчийн жагсаалт',
            href: paths.dashboard.user.root,
          },
          { name: 'Хэрэглэгч засах' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {data === null ? <LoadingScreen /> : <UserNewEditForm currentUser={data} />}
    </Container>
  );
}
