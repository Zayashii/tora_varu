// sections
import { LoanCloseView } from "src/sections/loan/view";
// ----------------------------------------------------------------------

export const metadata = {
    title: 'Loan: Close',
};

export default function LoanClosePage({ params }) {
    const { id } = params;

    return <LoanCloseView id={id} />;
}