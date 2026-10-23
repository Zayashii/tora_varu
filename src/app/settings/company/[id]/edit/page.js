// sections
import { CompanyEditView } from "src/sections/company/view";
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Edit the company',
};

export default function CompanyEditPage({ params }) {
  const { id } = params;
  return <CompanyEditView id={id} />;
}
