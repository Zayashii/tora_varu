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

// ----------------------------------------------------------------------

export default function CollateralTypeCreateView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Барьцаа хөрөнгийн төрөл нэмэх"
                links={[
                    {
                        name: '',
                    },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <CollateralTypeNewEditForm />
        </Container>
    );
}
