'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CollateralTypeNewEditForm from '../collateral-type-new-edit-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useState, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { getUserDataById } from 'src/api/user';
import { getCollateralTypes } from 'src/api/collateral';
// ----------------------------------------------------------------------

export default function CollateralTypeEditView({ id }) {
    const settings = useSettingsContext();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { logout } = useAuthContext();

    const [data, setData] = useState(null)

    useEffect(() => {

        getCollateralTypes().then((res) => {
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
                heading="Барьцаа хөрөнгийн төрөл засах"
                links={[
                    {
                        name: '',
                    },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            {data === null ? <LoadingScreen /> : <CollateralTypeNewEditForm />}
        </Container>
    );
}
