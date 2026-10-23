import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
// routes
import { RouterLink } from 'src/routes/components';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { COLORS } from '../config-layout';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function LoginButton({ sx }) {
  return (
    <Button
      component={RouterLink}
      href={paths.auth.jwt.login}
      sx={{
        backgroundColor: COLORS.Secondary,
        color: 'white',
        width: '120px',
        height: '35px',
        borderRadius: '20px 20px 20px 20px',
        fontSize: '11px',
        fontWeight: 'bold',
        // fontFamily: '"Open Sans Condensed", sans-serif',
        '&:hover': {
          backgroundColor: COLORS.Secondary, // Keep the same background
          color: 'white', // Keep the same text color
          boxShadow: 'none', // Remove hover shadow
          borderColor: 'transparent', // Prevent border changes
          opacity: 0.5,
        },
        ...sx
      }}
      style={{
      }}
    >
      НЭВТРЭХ
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
