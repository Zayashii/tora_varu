'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CompanyNewEditForm from '../company-new-edit-form';
import React, { forwardRef } from 'react';
//

// ----------------------------------------------------------------------

const CompanyCreateView = forwardRef(({ isModal, setFormData }, ref) => {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Компани бүртгэх"
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

      <CompanyNewEditForm isModal={isModal} setFormData={setFormData} ref={ref} />
    </Container>
  );
});

export default CompanyCreateView;

