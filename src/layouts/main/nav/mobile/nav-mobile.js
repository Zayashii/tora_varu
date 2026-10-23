"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// @mui
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// routes
import { usePathname } from "src/routes/hooks";
// components
import Logo from "src/components/logo";
import SvgColor from "src/components/svg-color";
import Scrollbar from "src/components/scrollbar";
//
import NavList from "./nav-list";
import Button from "@mui/material/Button";
import { LoginButton } from "src/layouts/_common";
import { paths } from "src/routes/paths";
import { COLORS } from "src/layouts/config-layout";

// ----------------------------------------------------------------------

export default function NavMobile({
  offsetTop,
  data,
  notShowLogin,
  handleExperienceClick,
  handleUsClick,
  handleServiceClick,
  handleContactUsClick,
  handleProjectClick,
}) {
  const pathname = usePathname();
  const isWelcomeMenu = notShowLogin === true;
  const [activeIndex, setActiveIndex] = useState(0);

  const nav = useBoolean();

  useEffect(() => {
    if (nav.value) {
      nav.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleItemSelect = (selectedIndex) => {
    if (Number.isInteger(selectedIndex)) {
      setActiveIndex(selectedIndex);
    }
    nav.onFalse();
  };

  return (
    <>
      <IconButton
        onClick={nav.onTrue}
        sx={{
          ml: 1,
          ...(offsetTop && {
            color: "text.primary",
          }),
        }}
      >
        <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
      </IconButton>

      <Drawer
        open={nav.value}
        onClose={nav.onFalse}
        PaperProps={{
          sx: (theme) => ({
            pb: 3.5,
            width: isWelcomeMenu ? 320 : 280,
            borderTopRightRadius: isWelcomeMenu ? 0 : 20,
            borderBottomRightRadius: isWelcomeMenu ? 0 : 20,
            borderRight: isWelcomeMenu
              ? "none"
              : `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            backgroundColor: isWelcomeMenu ? "#f3f5f8" : "#f8f7f2",
            backgroundImage: isWelcomeMenu
              ? "linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)"
              : `linear-gradient(180deg, ${alpha(
                  theme.palette.common.white,
                  0.9,
                )} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
            boxShadow: isWelcomeMenu
              ? "0 24px 40px rgba(15, 23, 42, 0.18)"
              : undefined,
          }),
        }}
      >
        <Scrollbar
          sx={{
            height: 1,
            "& .simplebar-content": {
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {!isWelcomeMenu && (
            <Box
              sx={(theme) => ({
                px: 2.5,
                pt: 2.5,
                pb: 2,
                borderBottom: `1px solid ${alpha(
                  theme.palette.primary.main,
                  0.12,
                )}`,
              })}
            >
              <Logo />
            </Box>
          )}

          {isWelcomeMenu && (
            <Box
              sx={{
                px: 3.5,
                pt: 4.5,
                pb: 2.5,
              }}
            >
              <Logo
                disabledLink
                imageSrc="/assets/illustrations/admin_logo.png"
                size={100}
                sx={{ opacity: 0.95 }}
              />
            </Box>
          )}

          {!(notShowLogin === true) && (
            <Stack direction={"column"} sx={{ alignItems: "center", py: 2 }}>
              <LoginButton />
              <Button
                variant="contained"
                rel="noopener"
                href={paths.auth.jwt.register}
                sx={{
                  backgroundColor: COLORS.Third,
                  color: "white",
                  width: "120px",
                  height: "35px",
                  borderRadius: "20px 20px 20px 20px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  // fontFamily: 'Open Sans Condensed", sans-serif',
                  "&:hover": {
                    backgroundColor: COLORS.Third,
                    color: "white",
                    boxShadow: "none",
                    borderColor: "transparent",
                    opacity: 0.5,
                  },
                }}
              >
                БҮРТГҮҮЛЭХ
              </Button>
            </Stack>
          )}

          <List
            component="nav"
            disablePadding
            sx={{ px: 0.5, py: isWelcomeMenu ? 0.5 : 1.5 }}
          >
            {data.map((link, index) => (
              <NavList
                key={link.title}
                item={link}
                index={index}
                activeIndex={activeIndex}
                isWelcomeMenu={isWelcomeMenu}
                onItemSelect={handleItemSelect}
                handleExperienceClick={handleExperienceClick}
                handleUsClick={handleUsClick}
                handleServiceClick={handleServiceClick}
                handleContactUsClick={handleContactUsClick}
                handleProjectClick={handleProjectClick}
              />
            ))}
          </List>
        </Scrollbar>
      </Drawer>
    </>
  );
}

NavMobile.propTypes = {
  data: PropTypes.array,
  handleContactUsClick: PropTypes.func,
  handleExperienceClick: PropTypes.func,
  handleProjectClick: PropTypes.func,
  handleServiceClick: PropTypes.func,
  handleUsClick: PropTypes.func,
  notShowLogin: PropTypes.bool,
  offsetTop: PropTypes.bool,
};
