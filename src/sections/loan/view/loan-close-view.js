'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import LoanCloseForm from '../loan-close-form';

// ----------------------------------------------------------------------

export default function LoanCloseView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Зээл хаах"
        links={[
          {
            name: 'Зээлийн жагсаалт',
            href: paths.dashboard.loan.root,
          },
          { name: 'Зээл хаах' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LoanCloseForm id={id} />
    </Container>
  );
}
