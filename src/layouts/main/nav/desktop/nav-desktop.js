import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
//
import NavList from './nav-list';

// ----------------------------------------------------------------------

export default function NavDesktop({ offsetTop, data, handleExperienceClick, handleIntroClick, handleServiceClick }) {
  return (
    <Stack component="nav" direction="row" spacing={5} sx={{ mr: '50px', height: 1 }}>
      {data.map((link, index) => (
        <NavList key={link.title} item={link} offsetTop={offsetTop} index={index} handleExperienceClick={handleExperienceClick} handleIntroClick={handleIntroClick} handleServiceClick ={handleServiceClick}/>
      ))}
    </Stack>
  );
}

NavDesktop.propTypes = {
  data: PropTypes.array,
  offsetTop: PropTypes.bool,
};
