'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import FAQNewEditForm from '../faq-new-edit-form';

// ----------------------------------------------------------------------

export default function FAQCreateView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Асуулт, хариулт нэмэх"
                links={[
                    {
                        name: '',
                    },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <FAQNewEditForm />
        </Container>
    );
}
