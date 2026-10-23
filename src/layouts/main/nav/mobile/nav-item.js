import PropTypes from "prop-types";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
// @mui
import Link from "@mui/material/Link";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// routes
import { RouterLink } from "src/routes/components";
// components
import Iconify from "src/components/iconify";
//
import { ListItem } from "./styles";

// ----------------------------------------------------------------------

export default function NavItem({
  item,
  open,
  active,
  externalLink,
  index,
  onItemSelect,
  handleExperienceClick,
  handleUsClick,
  handleServiceClick,
  handleContactUsClick,
  handleProjectClick,
  ...other
}) {
  const { title, path, icon, children } = item;
  const [isHovered, setIsHovered] = useState(false);

  const entranceDelay = Number.isInteger(index) ? index * 0.08 : 0;

  const renderContent = (
    <ListItem
      active={active}
      disableRipple
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...other}
    >
      <ListItemIcon sx={{ mr: 1 }}>
        <m.div
          animate={{ rotate: isHovered && !active ? [0, -10, 10, 0] : 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </m.div>
      </ListItemIcon>

      <ListItemText disableTypography primary={title} />

      {!!children && (
        <Iconify
          width={16}
          icon={
            open ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"
          }
          sx={{
            ml: 1,
            flexShrink: 0,
            color: active ? "primary.main" : "text.disabled",
          }}
        />
      )}

      {!children && (
        <AnimatePresence>
          {isHovered && !active && (
            <m.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              <Iconify
                width={16}
                icon="eva:arrow-ios-forward-fill"
                sx={{ color: "primary.main" }}
              />
            </m.div>
          )}
        </AnimatePresence>
      )}
    </ListItem>
  );

  // External link
  if (externalLink) {
    return (
      <m.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: entranceDelay }}
      >
        <Link
          href={path}
          target="_blank"
          rel="noopener"
          underline="none"
          color="inherit"
          sx={{ display: "block" }}
        >
          {renderContent}
        </Link>
      </m.div>
    );
  }

  // Has child
  if (children) {
    return (
      <m.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: entranceDelay }}
      >
        {renderContent}
      </m.div>
    );
  }

  // Default
  return (
    <m.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: entranceDelay }}
    >
      <Link
        component={RouterLink}
        href={path}
        underline="none"
        color="inherit"
        sx={{ display: "block" }}
        onClick={(event) => {
          onItemSelect?.(index);
          switch (index) {
            case 0:
              handleUsClick?.(event);
              break;
            case 1:
              handleProjectClick?.(event);
              break;
            case 2:
              handleServiceClick?.(event);
              break;
            case 3:
              handleExperienceClick?.(event);
              break;
            case 4:
              handleContactUsClick?.(event);
              break;
            default:
              break;
          }
        }}
      >
        {renderContent}
      </Link>
    </m.div>
  );
}

NavItem.propTypes = {
  active: PropTypes.bool,
  externalLink: PropTypes.bool,
  handleContactUsClick: PropTypes.func,
  handleExperienceClick: PropTypes.func,
  handleProjectClick: PropTypes.func,
  handleServiceClick: PropTypes.func,
  handleUsClick: PropTypes.func,
  index: PropTypes.number,
  item: PropTypes.object,
  onItemSelect: PropTypes.func,
  open: PropTypes.bool,
};
