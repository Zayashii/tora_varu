// @mui
import { styled, alpha } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import { listItemTextClasses } from "@mui/material/ListItemText";
import { listItemIconClasses } from "@mui/material/ListItemIcon";

// ----------------------------------------------------------------------

const ACTIVE_BG = "#16c9b5";
const INACTIVE_TEXT = "#374151";
const INACTIVE_ICON = "#0ea98e";

export const ListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active, theme }) => ({
  ...theme.typography.subtitle2,
  color: INACTIVE_TEXT,
  position: "relative",
  minHeight: 56,
  marginInline: theme.spacing(2),
  marginBlock: theme.spacing(1),
  paddingBlock: theme.spacing(1.1),
  paddingInline: theme.spacing(2.25),
  borderRadius: 16,
  border: "1px solid #d8dde2",
  backgroundColor: "#ffffff",
  boxShadow: "0 1px 4px rgba(15, 23, 42, 0.08)",
  transition: theme.transitions.create(
    ["background-color", "border-color", "box-shadow", "color"],
    {
      duration: theme.transitions.duration.shorter,
    },
  ),
  [`& .${listItemIconClasses.root}`]: {
    minWidth: 30,
    display: "inline-flex",
    alignItems: "center",
    color: INACTIVE_ICON,
    "& svg": {
      width: 20,
      height: 20,
    },
    transition: theme.transitions.create(["color"], {
      duration: theme.transitions.duration.shorter,
    }),
  },
  [`& .${listItemTextClasses.primary}`]: {
    ...theme.typography.body1,
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 1.2,
    letterSpacing: 0.4,
  },
  "&:hover": {
    backgroundColor: alpha(ACTIVE_BG, 0.08),
    borderColor: alpha(ACTIVE_BG, 0.4),
    boxShadow: "0 3px 8px rgba(15, 23, 42, 0.12)",
  },
  // Active
  ...(active && {
    color: "#ffffff",
    background: "linear-gradient(90deg, #1dd4c0 0%, #16c9b5 100%)",
    borderColor: "#1dd4c0",
    boxShadow: `0 10px 20px ${alpha(ACTIVE_BG, 0.3)}`,
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: 4,
      height: 36,
      borderRadius: "0 999px 999px 0",
      backgroundColor: "#ffffff",
    },
    [`& .${listItemIconClasses.root}`]: {
      color: "#ffffff",
    },
    [`& .${listItemTextClasses.primary}`]: {
      color: "#ffffff",
      fontWeight: 700,
    },
  }),
}));
