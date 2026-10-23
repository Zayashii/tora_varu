import PropTypes from 'prop-types';
// sections
import { UserEditView } from 'src/sections/user/view/index';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User Edit',
};

export default function UserEditPage({ params }) {
  const { id } = params;

  return <UserEditView id={id} />;
}