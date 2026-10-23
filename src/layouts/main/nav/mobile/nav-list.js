import PropTypes from "prop-types";
// @mui
import Collapse from "@mui/material/Collapse";
import { listClasses } from "@mui/material/List";
import { listItemTextClasses } from "@mui/material/ListItemText";
import { listItemButtonClasses } from "@mui/material/ListItemButton";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import { NavSectionVertical } from "src/components/nav-section";
import { usePathname } from "src/routes/hooks";
//
import NavItem from "./nav-item";

// ----------------------------------------------------------------------

export default function NavList({
  item,
  index,
  activeIndex,
  isWelcomeMenu,
  onItemSelect,
  handleExperienceClick,
  handleUsClick,
  handleServiceClick,
  handleContactUsClick,
  handleProjectClick,
}) {
  const pathname = usePathname();

  const { path, children } = item;

  const externalLink = path.includes("http");

  const nav = useBoolean();
  const isActive = isWelcomeMenu ? activeIndex === index : pathname === path;

  return (
    <>
      <NavItem
        item={item}
        open={nav.value}
        onClick={children ? nav.onToggle : undefined}
        active={isActive}
        externalLink={externalLink}
        index={index}
        onItemSelect={onItemSelect}
        handleExperienceClick={handleExperienceClick}
        handleUsClick={handleUsClick}
        handleServiceClick={handleServiceClick}
        handleContactUsClick={handleContactUsClick}
        handleProjectClick={handleProjectClick}
      />

      {!!children && (
        <Collapse in={nav.value} unmountOnExit>
          <NavSectionVertical
            data={children}
            sx={{
              [`& .${listClasses.root}`]: {
                "&:last-of-type": {
                  [`& .${listItemButtonClasses.root}`]: {
                    height: 160,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    bgcolor: "background.neutral",
                    backgroundRepeat: "no-repeat",
                    backgroundImage:
                      "url(/assets/illustrations/illustration_dashboard.png)",
                    [`& .${listItemTextClasses.root}`]: {
                      display: "none",
                    },
                  },
                },
              },
            }}
          />
        </Collapse>
      )}
    </>
  );
}

NavList.propTypes = {
  activeIndex: PropTypes.number,
  handleContactUsClick: PropTypes.func,
  handleExperienceClick: PropTypes.func,
  handleProjectClick: PropTypes.func,
  handleServiceClick: PropTypes.func,
  handleUsClick: PropTypes.func,
  index: PropTypes.number,
  isWelcomeMenu: PropTypes.bool,
  item: PropTypes.object,
  onItemSelect: PropTypes.func,
};
