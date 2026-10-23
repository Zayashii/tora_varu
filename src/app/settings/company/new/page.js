import React, { forwardRef } from 'react';
import { CompanyCreateView } from 'src/sections/company/view';

const CompanyCreatePage = forwardRef(({ isModal, setFormData }, ref) => {
  return (
    <CompanyCreateView isModal={isModal ?? false} setFormData={setFormData} ref={ref} />
  );
});

export default CompanyCreatePage;
