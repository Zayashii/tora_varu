// sections
import { LoanExtendView } from "src/sections/loan/view";
// ----------------------------------------------------------------------

export const metadata = {
    title: 'Loan: Extend',
};

export default function LoanExtendPage({ params }) {
    const { id } = params;

    return <LoanExtendView id={id}/>;
}