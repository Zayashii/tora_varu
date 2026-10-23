// sections
import { LoanHistoryListView } from 'src/sections/loan-history/view/index';

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Dashboard: User Loan History',
};

export default function UserListPage({ params }) {
    const { id } = params;
    return <LoanHistoryListView id={id} />;
}
