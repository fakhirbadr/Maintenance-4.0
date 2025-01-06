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
import { Avatar, List, styled, Typography, useTheme } from "@mui/material";
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
  // @ts-ignore
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
    roleRequired: "superviseur",
  },
  {
    text: "Inventaire des actifs",
    icon: (
      <IconWrapper>
        <RemoveRedEyeRoundedIcon />
      </IconWrapper>
    ),
    path: "/Inventaire",
    roleRequired: ["admin", "superviseur"],
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
    text: "Validation demandes",
    icon: (
      <IconWrapper>
        <BookmarkAddedIcon />
      </IconWrapper>
    ),
    path: "/Validation",
    roleRequired: ["admin"],
  },
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
    text: "Demande véhicule",
    icon: (
      <IconWrapper>
        <DirectionsCarRoundedIcon />
      </IconWrapper>
    ),
    path: "/BesoinVehicule",
    roleRequired: ["admin", "superviseur"],
  },
  {
    text: "Historique Intervention",
    icon: (
      <IconWrapper>
        <ConstructionOutlinedIcon />
        <HistoryIcon className="w-[16px]" />
      </IconWrapper>
    ),
    path: "/HistoriqueIntervention",
  },
  {
    text: "Historique commande",
    icon: (
      <IconWrapper>
        <ListAltIcon />
        <HistoryIcon className="w-[16px]" />
      </IconWrapper>
    ),
    path: "/HistoriqueBesoin",
  },
  {
    text: "Historique véhicule",
    icon: (
      <IconWrapper>
        <DirectionsCarRoundedIcon />
        <HistoryIcon className="w-[16px]" />
      </IconWrapper>
    ),
    path: "/Historiquevehicule",
  },
  // {
  //   text: "test",
  //   icon: (
  //     <IconWrapper>
  //       <ListAltIcon />
  //     </IconWrapper>
  //   ),
  //   path: "/test",
  //   roleRequired: "superviseur",
  // },
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
    roleRequired: "user",
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
    roleRequired: ["superviseur"],
  },
];

export default function SidBar({ open, handleDrawerClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  let location = useLocation();

  // Récupérer le rôle de l'utilisateur depuis le localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Parse l'objet JSON
  const role = userInfo ? userInfo.role : null; // Si userInfo existe, on récupère le rôle,

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
        mr {userInfo ? userInfo.nomComplet : "Nom Complet"}{" "}
        {/* Affiche le nom complet ou une valeur par défaut */}
      </Typography>

      <Divider />

      <List>
        {Array1.map((item) => {
          // Vérification des rôles
          if (
            item.roleRequired &&
            !(Array.isArray(item.roleRequired)
              ? item.roleRequired.includes(role)
              : role === item.roleRequired)
          ) {
            return null; // Si l'utilisateur n'a pas le bon rôle, ne pas afficher l'élément
          }

          return (
            <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                }}
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
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
    </Drawer>
  );
}
