'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import LoanCreateManuallyForm from 'src/sections/loan/loan-create-manually-form';
import CollateralNewEditForm from '../collateral-new-edit-form';

// ----------------------------------------------------------------------

export default function CollateralCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Барьцаа хөрөнгө нэмэх"
        links={[
          {
            name: 'Барьцаа хөрөнгийн жагсаалт',
            href: paths.dashboard.user.root,
          },
          { name: 'Барьцаа хөрөнгө' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CollateralNewEditForm />
    </Container>
  );
}
