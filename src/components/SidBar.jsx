import React from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiDrawer from "@mui/material/Drawer";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeRepairServiceOutlinedIcon from "@mui/icons-material/HomeRepairServiceOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CandlestickChartOutlinedIcon from "@mui/icons-material/CandlestickChartOutlined";
import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import BugReportIcon from "@mui/icons-material/BugReport";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import {
  Avatar,
  List,
  styled,
  Typography,
  useTheme,
  Collapse,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { HistoryIcon } from "lucide-react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import avatarImage from "../../public/scx.png";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import StarRateIcon from "@mui/icons-material/StarRate";
import ErrorIcon from "@mui/icons-material/Error";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
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
    <div style={{ fontSize: "10px", display: "flex", alignItems: "center" }}>
      {children}
    </div>
  );
};

const Array1 = [
  {
    text: "Dashboard",
    icon: (
      <IconWrapper>
        <DashboardIcon />
      </IconWrapper>
    ),
    path: "/dashboard",
    roleRequired: ["achat", "superviseur", "docteurs"],
  },
  {
    text: "Inventaire des actifs",
    icon: (
      <IconWrapper>
        <RemoveRedEyeRoundedIcon />
      </IconWrapper>
    ),
    path: "/Inventaire",
    roleRequired: ["admin", "achat", "superviseur", "docteurs"],
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
    roleRequired: ["admin", "superviseur"],
  },
  {
    text: "Gestion Achat",
    icon: (
      <IconWrapper>
        <AttachMoneyIcon />
      </IconWrapper>
    ),
    path: "/Achat",
    roleRequired: ["admin", "achat", "superviseur"],
  },
  {
    text: "Gestion des tickets",
    icon: (
      <IconWrapper>
        <HomeRepairServiceOutlinedIcon />
      </IconWrapper>
    ),
    path: "#",
    roleRequired: ["admin", "superviseur", "achat"],
    children: [
      {
        text: "Gestion de maintenance",
        icon: (
          <IconWrapper>
            <ConstructionOutlinedIcon />
          </IconWrapper>
        ),
        path: "/ticket",
        roleRequired: ["admin", "superviseur"],
      },
      {
        text: "Gestion de commande",
        icon: (
          <IconWrapper>
            <ListAltIcon />
          </IconWrapper>
        ),
        path: "/Besoin",
        roleRequired: ["admin", "superviseur"],
      },
      {
        text: "Gestion de véhicule",
        icon: (
          <IconWrapper>
            <DirectionsCarRoundedIcon />
          </IconWrapper>
        ),
        path: "/BesoinVehicule",
        roleRequired: ["admin", "superviseur"],
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
      },
      {
        text: "Historique commande",
        icon: (
          <IconWrapper>
            <ListAltIcon />
          </IconWrapper>
        ),
        path: "/HistoriqueBesoin",
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
    roleRequired: ["admin", "superviseur"],
  },
  {
    text: "Suivi demande",
    icon: (
      <IconWrapper>
        <StarRateIcon />
      </IconWrapper>
    ),
    path: "/SuiviDemande",
    roleRequired: ["admin", "docteurs", "user"],
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
    roleRequired: ["superviseur", "achat"],
  },
];

export default function SidBar({ open, handleDrawerClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  const handleMenuToggle = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const role = userInfo ? userInfo.role : null;

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "",
          color: "",
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Divider />
      <Avatar
        sx={{
          mx: "auto",
          width: open ? 90 : 40,
          height: open ? 90 : 40,
          my: "2px",
          transition: "0.5s",
          border: "2px solid grey",
        }}
        alt="avatar"
        src={avatarImage}
      />
      <Typography
        className="text-orange-500"
        align="center"
        sx={{ fontSize: open ? 12 : 0, transition: "0.5s" }}
      >
        SCX Asset Management
      </Typography>
      <Typography
        align="center"
        sx={{
          fontSize: open ? 15 : 0,
          transition: "0.5s",
          color: theme.palette.info.main,
          fontFamily: "fantasy",
        }}
      >
        {userInfo ? userInfo.nomComplet : "Nom Complet"}
      </Typography>

      <Divider />

      <List>
        {Array1.map((item) => {
          if (item.roleRequired && !item.roleRequired.includes(role)) {
            return null;
          }

          return (
            <div key={item.text}>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={
                    item.children
                      ? () => handleMenuToggle(item.text)
                      : () => navigate(item.path)
                  }
                  sx={{
                    minHeight: 10,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    bgcolor:
                      location.pathname === item.path
                        ? theme.palette.mode === "dark"
                          ? grey[800]
                          : grey[300]
                        : null,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: "12px" }}
                    primary={item.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                  {item.children &&
                    open &&
                    (openMenus[item.text] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              {item.children && (
                <Collapse
                  in={openMenus[item.text]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((child) => {
                      if (
                        child.roleRequired &&
                        !child.roleRequired.includes(role)
                      ) {
                        return null;
                      }
                      return (
                        <ListItem
                          key={child.path}
                          disablePadding
                          sx={{ display: "block" }}
                        >
                          <ListItemButton
                            onClick={() => navigate(child.path)}
                            sx={{
                              minHeight: 10,
                              justifyContent: open ? "initial" : "center",
                              px: 2.5,
                              pl: 4,
                              bgcolor:
                                location.pathname === child.path
                                  ? theme.palette.mode === "dark"
                                    ? grey[800]
                                    : grey[300]
                                  : null,
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 2 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText
                              primaryTypographyProps={{ fontSize: "12px" }}
                              primary={child.text}
                              sx={{ opacity: open ? 1 : 0 }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </div>
          );
        })}
      </List>

      <Divider />
    </Drawer>
  );
}
