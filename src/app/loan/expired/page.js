// sections
import { ExpiredLoanListView } from "src/sections/expired-loan/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Expired Loan List',
};

export default function LoanListPage() {
  return <ExpiredLoanListView />;
}
