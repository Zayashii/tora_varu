import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
//
import NavList from './nav-list';
import { fontSize } from '@mui/system';

// ----------------------------------------------------------------------

export default function WelcomeNavDesktop({ offsetTop, data, handleExperienceClick, handleUsClick, handleServiceClick, handleContactUsClick, handleProjectClick }) {
  return (
    <Stack component="nav" direction="row" spacing={5} sx={{ height: 1 }}>
      {data.map((link, index) => (
        <NavList key={link.title} item={link} offsetTop={offsetTop} index={index} handleExperienceClick={handleExperienceClick} handleUsClick={handleUsClick} handleServiceClick={handleServiceClick} handleContactUsClick={handleContactUsClick} handleProjectClick={handleProjectClick} sx={{ fontSize: '12px' }} />
      ))}
    </Stack>
  );
}

WelcomeNavDesktop.propTypes = {
  data: PropTypes.array,
  offsetTop: PropTypes.bool,
};
