"use client";

import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";
// routes
import { usePathname } from "src/routes/hooks";
//
import Footer from "./footer";
import WelcomeHeader from "./welcome-header";
import WelcomeFooter from "./welcome-footer";
import { HEADER } from "../config-layout";

// ----------------------------------------------------------------------

export default function WelcomeMainLayout({
  children,
  handleExperienceClick,
  handleUsClick,
  handleServiceClick,
  handleContactUsClick,
  handleProjectClick,
}) {
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: 1 }}>
      <WelcomeHeader
        handleExperienceClick={handleExperienceClick}
        handleUsClick={handleUsClick}
        handleServiceClick={handleServiceClick}
        handleContactUsClick={handleContactUsClick}
        handleProjectClick={handleProjectClick}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: {
            xs: `${HEADER.H_MOBILE}px`,
            md: isHome ? `${HEADER.W_H_DESKTOP}px` : `${HEADER.H_DESKTOP}px`,
          },
        }}
      >
        {children}
      </Box>

      <WelcomeFooter />
    </Box>
  );
}

WelcomeMainLayout.propTypes = {
  children: PropTypes.node,
};
