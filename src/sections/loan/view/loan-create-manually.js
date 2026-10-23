'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoanCreateManuallyForm from '../loan-create-manually-form';
//
// ----------------------------------------------------------------------

export default function LoanCreateManuallyView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Зээл гараар нэмэх"
        links={[
          {
            name: 'Зээлийн жагсаалт',
            href: paths.dashboard.loan.root,
          },
          { name: 'Шинэ зээл' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LoanCreateManuallyForm />
    </Container>
  );
}
