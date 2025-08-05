import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiDrawer from "@mui/material/Drawer";
import HomeRepairServiceOutlinedIcon from "@mui/icons-material/HomeRepairServiceOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import StarRateIcon from "@mui/icons-material/StarRate";
import ErrorIcon from "@mui/icons-material/Error";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import { HistoryIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Avatar,
  List,
  styled,
  Typography,
  useTheme,
  Collapse,
  Box,
  Tooltip,
} from "@mui/material";
import BrowserUpdatedRoundedIcon from "@mui/icons-material/BrowserUpdatedRounded";
import { useLocation, useNavigate } from "react-router-dom";
import avatarImage from "../../public/scx.png";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e2d" : "#ffffff",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e2d" : "#ffffff",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const IconWrapper = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const MotionListItem = motion(ListItem);
const MotionListItemIcon = motion(ListItemIcon);
const MotionAvatar = motion(Avatar);
const MotionTypography = motion(Typography);

const Array1 = [
  {
    text: "Dashboard",
    icon: (
      <IconWrapper>
        <DashboardIcon />
      </IconWrapper>
    ),
    path: "/dashboard",
    roleRequired: [
      "achat",
      "superviseur",
      "docteurs",
      "chargés de performance",
    ],
  },
  {
    text: "Inventaire des actifs",
    icon: (
      <IconWrapper>
        <RemoveRedEyeRoundedIcon />
      </IconWrapper>
    ),
    path: "/Inventaire",
    roleRequired: [
      "admin",
      "achat",
      "superviseur",
      "docteurs",
      "chargés de performance",
    ],
  },
  {
    text: "Création ticket",
    icon: (
      <IconWrapper>
        <BookOnlineOutlinedIcon />
      </IconWrapper>
    ),
    path: "/Tickets",
  },
  {
    text: "Validation des tickets",
    icon: (
      <IconWrapper>
        <BookmarkAddedIcon />
      </IconWrapper>
    ),
    path: "/Validation",
    roleRequired: ["admin", "superviseur", "chargés de performance"],
  },
  {
    text: "Gestion Achat",
    icon: (
      <IconWrapper>
        <AttachMoneyIcon />
      </IconWrapper>
    ),
    path: "/Achat",
    roleRequired: ["admin", "achat", "superviseur", "chargés de performance"],
  },
  {
    text: "Gestion des tickets",
    icon: (
      <IconWrapper>
        <HomeRepairServiceOutlinedIcon />
      </IconWrapper>
    ),
    path: "#",
    roleRequired: ["admin", "superviseur", "achat", "chargés de performance"],
    children: [
      {
        text: "Gestion de maintenance",
        icon: (
          <IconWrapper>
            <ConstructionOutlinedIcon />
          </IconWrapper>
        ),
        path: "/ticket",
        roleRequired: ["admin", "superviseur", "chargés de performance"],
      },
      {
        text: "Gestion de commande",
        icon: (
          <IconWrapper>
            <ListAltIcon />
          </IconWrapper>
        ),
        path: "/Besoin",
        roleRequired: ["admin", "superviseur", "chargés de performance"],
      },
      {
        text: "Gestion de véhicule",
        icon: (
          <IconWrapper>
            <DirectionsCarRoundedIcon />
          </IconWrapper>
        ),
        path: "/BesoinVehicule",
        roleRequired: ["admin", "superviseur", "chargés de performance"],
      },
      {
        text: "Portail de tickets SI",
        icon: (
          <IconWrapper>
            <DesktopWindowsRoundedIcon />
          </IconWrapper>
        ),
        path: "/TicketSI",
        roleRequired: ["admin", "superviseur", "chargés de performance"],
      },
    ],
  },
  {
    text: "Historique",
    icon: (
      <IconWrapper>
        <HistoryIcon className="w-[16px]" />
      </IconWrapper>
    ),
    path: "#",
    children: [
      {
        text: "Historique Intervention",
        icon: (
          <IconWrapper>
            <ConstructionOutlinedIcon />
          </IconWrapper>
        ),
        path: "/HistoriqueIntervention",
        roleRequired: ["admin", "docteurs", "user", "chargé de stock", "chargés de performance"],
      },
      {
        text: "Historique commande",
        icon: (
          <IconWrapper>
            <ListAltIcon />
          </IconWrapper>
        ),
        path: "/HistoriqueBesoin",
        roleRequired: ["admin", "docteurs", "user", "chargé de stock", "chargés de performance"],
      },
      {
        text: "Historique véhicule",
        icon: (
          <IconWrapper>
            <DirectionsCarRoundedIcon />
          </IconWrapper>
        ),
        path: "/Historiquevehicule",
      },
      {
        text: "Historique SI",
        icon: (
          <IconWrapper>
            <DesktopWindowsRoundedIcon />
          </IconWrapper>
        ),
        path: "/HistoriqueSI",
        roleRequired: ["admin", "docteurs", "user", "chargé de stock", "chargés de performance"],
      },
      {
        text: "Historique des rejets",
        icon: (
          <IconWrapper>
            <HighlightOffRoundedIcon />
          </IconWrapper>
        ),
        path: "/HistoriqueDesRejets",
        roleRequired: ["admin", "docteurs", "chargé de stock", "chargés de performance"],
      },
    ],
  },
  {
    text: "Paramètres",
    icon: (
      <IconWrapper>
        <SettingsIcon />
      </IconWrapper>
    ),
    path: "/parametres",
    roleRequired: ["admin", "superviseur", "chargés de performance"],
  },
  {
    text: "Suivi demande",
    icon: (
      <IconWrapper>
        <StarRateIcon />
      </IconWrapper>
    ),
    path: "/SuiviDemande",
    roleRequired: ["admin", "docteurs", "user", "chargé de stock", "technicien"],
  },
  {
    text: "Utilisateur",
    icon: (
      <IconWrapper>
        <BadgeOutlinedIcon />
      </IconWrapper>
    ),
    path: "/utilisateur",
  },
  {
    text: "Alertes",
    icon: (
      <IconWrapper>
        <ErrorIcon />
      </IconWrapper>
    ),
    path: "/Alerte",
    roleRequired: ["superviseur", "achat", "chargés de performance"],
  },
  {
    text: "Configuration Asset",
    icon: (
      <IconWrapper>
        <BrowserUpdatedRoundedIcon />
      </IconWrapper>
    ),
    path: "/ConfigurationAsset",
    roleRequired: ["superviseur"],
  },
];

export default function SidBar({ open, handleDrawerClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuToggle = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const role = userInfo ? userInfo.role : null;

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const getIconColor = (path, index) => {
    if (location.pathname === path) {
      return theme.palette.mode === "dark" ? "#1ac2f0" : "#1976d2";
    }

    if (hoveredItem === index) {
      return theme.palette.mode === "dark" ? "#1ac2f0" : "#1976d2";
    }

    return theme.palette.mode === "dark" ? "#a3a3a3" : "#666666";
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "rotate(180deg)",
              color: theme.palette.primary.main,
            },
          }}
        >
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ mb: 1 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <MotionAvatar
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          sx={{
            width: open ? 90 : 40,
            height: open ? 90 : 40,
            my: "8px",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            },
          }}
          alt="avatar"
          src={avatarImage}
        />

        <MotionTypography
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            fontSize: open ? 14 : 0,
            transition: "0.5s",
            color: "#f97316",
            fontWeight: "bold",
            letterSpacing: "0.5px",
            mt: 1,
          }}
        >
          SCX Asset Management
        </MotionTypography>

        <MotionTypography
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          sx={{
            fontSize: open ? 16 : 0,
            transition: "0.5s",
            color: theme.palette.primary.main,
            fontWeight: "500",
            mt: 0.5,
          }}
        >
          {userInfo ? userInfo.nomComplet : "Nom Complet"}
        </MotionTypography>
      </Box>

      <Divider sx={{ mb: 1 }} />

      <List sx={{ px: 1 }}>
        {Array1.map((item, index) => {
          if (item.roleRequired && !item.roleRequired.includes(role)) {
            return null;
          }

          const isActive = location.pathname === item.path;
          const isHovered = hoveredItem === index;

          return (
            <div key={item.text}>
              <MotionListItem
                disablePadding
                sx={{ display: "block", mb: 0.5 }}
                initial={mounted ? "hidden" : "visible"}
                animate="visible"
                variants={itemVariants}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Tooltip title={open ? "" : item.text} placement="right">
                  <ListItemButton
                    onClick={
                      item.children
                        ? () => handleMenuToggle(item.text)
                        : () => navigate(item.path)
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      borderRadius: "8px",
                      backgroundColor: isActive
                        ? theme.palette.mode === "dark"
                          ? "rgba(25, 118, 210, 0.15)"
                          : "rgba(25, 118, 210, 0.08)"
                        : "transparent",
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(25, 118, 210, 0.2)"
                            : "rgba(25, 118, 210, 0.12)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <MotionListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        justifyContent: "center",
                        color: getIconColor(item.path, index),
                        transition: "color 0.3s ease",
                      }}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      {item.icon}
                    </MotionListItemIcon>

                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "13px",
                        fontWeight: isActive ? "600" : "400",
                        color: isActive
                          ? theme.palette.primary.main
                          : "inherit",
                      }}
                      sx={{
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.3s ease",
                      }}
                    />

                    {item.children && open && (
                      <motion.div
                        animate={{ rotate: openMenus[item.text] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {openMenus[item.text] ? <ExpandLess /> : <ExpandMore />}
                      </motion.div>
                    )}
                  </ListItemButton>
                </Tooltip>
              </MotionListItem>

              {item.children && (
                <Collapse
                  in={openMenus[item.text]}
                  timeout="auto"
                  unmountOnExit
                  component={motion.div}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: openMenus[item.text] ? 1 : 0,
                    height: openMenus[item.text] ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <List component="div" disablePadding sx={{ pl: 1 }}>
                    {item.children.map((child, childIndex) => {
                      if (
                        child.roleRequired &&
                        !child.roleRequired.includes(role)
                      ) {
                        return null;
                      }

                      const isChildActive = location.pathname === child.path;
                      const childFullIndex = `${index}-${childIndex}`;
                      const isChildHovered = hoveredItem === childFullIndex;

                      return (
                        <MotionListItem
                          key={child.path}
                          disablePadding
                          sx={{ display: "block", mb: 0.5 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: childIndex * 0.05,
                          }}
                          onMouseEnter={() => handleMouseEnter(childFullIndex)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Tooltip
                            title={open ? "" : child.text}
                            placement="right"
                          >
                            <ListItemButton
                              onClick={() => navigate(child.path)}
                              sx={{
                                minHeight: 40,
                                justifyContent: open ? "initial" : "center",
                                pl: open ? 4 : 2.5,
                                borderRadius: "8px",
                                backgroundColor: isChildActive
                                  ? theme.palette.mode === "dark"
                                    ? "rgba(25, 118, 210, 0.15)"
                                    : "rgba(25, 118, 210, 0.08)"
                                  : "transparent",
                                color: isChildActive
                                  ? theme.palette.primary.main
                                  : theme.palette.text.secondary,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(25, 118, 210, 0.2)"
                                      : "rgba(25, 118, 210, 0.12)",
                                  transform: "translateX(4px)",
                                },
                              }}
                            >
                              <MotionListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 2 : "auto",
                                  justifyContent: "center",
                                  color: isChildActive
                                    ? theme.palette.primary.main
                                    : isChildHovered
                                    ? theme.palette.primary.main
                                    : theme.palette.text.secondary,
                                  transition: "color 0.3s ease",
                                  fontSize: "0.9rem",
                                }}
                                whileHover={{ scale: 1.2, rotate: 5 }}
                              >
                                {child.icon}
                              </MotionListItemIcon>

                              <ListItemText
                                primary={child.text}
                                primaryTypographyProps={{
                                  fontSize: "12px",
                                  fontWeight: isChildActive ? "500" : "400",
                                  color: isChildActive
                                    ? theme.palette.primary.main
                                    : "inherit",
                                }}
                                sx={{
                                  opacity: open ? 1 : 0,
                                  transition: "opacity 0.3s ease",
                                }}
                              />
                            </ListItemButton>
                          </Tooltip>
                        </MotionListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </div>
          );
        })}
      </List>

      <Divider sx={{ mt: 1 }} />
    </Drawer>
  );
}
