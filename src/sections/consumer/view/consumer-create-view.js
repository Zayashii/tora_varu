'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ConsumerNewEditForm from '../consumer-new-edit-form';

// ----------------------------------------------------------------------

export default function ConsumerCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Шинэ хэрэглэгч нэмэх"
        links={[
          {
            name: 'Хэрэглэгчийн жагсаалт',
            href: paths.dashboard.settings.root,
          },
          { name: 'Шинэ хэрэглэгч' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ConsumerNewEditForm />
    </Container>
  );
}
